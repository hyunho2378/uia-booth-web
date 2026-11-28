import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { pollWords } from '../nfc/db'
import { QUESTIONS } from '../nfc/survey'
import { keepAwake } from '../utils/wakeLock'

const POLL = 700
const SLOW = 8000
const CACHE = 'uia-words-cache'
const readCache = () => { try { return JSON.parse(localStorage.getItem(CACHE) || 'null') } catch { return null } }

function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) }

// 많이 나온 단어부터 중앙에서 나선으로 퍼지며 겹치지 않는 자리에 놓는다. 좌표는 무대 폭(W) 기준 숫자다.
// 느린 전시 기기를 위해 이미 놓인 단어는 그 자리에 두고, 새 단어와 숫자가 바뀐 단어만 빈자리에 놓는다.
// 가장 많은 단어의 숫자가 바뀌어 전체 크기가 달라질 때만 처음부터 다시 배치한다.
const measure = (() => { let ctx; return (font, text) => { ctx = ctx || document.createElement('canvas').getContext('2d'); ctx.font = font; return ctx.measureText(text).width } })()
function sizeOf(it, max, n, W, H) {
  const k = n <= 4 ? 1.25 : n <= 12 ? 1.05 : n <= 30 ? 0.85 : 0.7
  return (W > H ? 40 : 36) * k * (0.62 + 1.3 * Math.pow(it.count / max, 0.55))
}
function place(it, base, placed, W, H) {
  for (const shrink of [1, 0.85, 0.7, 0.55, 0.42]) {
    const size = Math.round(base * shrink)
    const w = measure(`700 ${size}px Pretendard Variable, Pretendard, sans-serif`, it.word) + size * 1.1
    const h = size * 1.72
    const seed = (hash(it.word) % 628) / 100
    for (let t = 0; t < 2500; t++) {
      const a2 = seed + t * 0.33, r = 2 + t * 0.85
      const x = W / 2 + r * Math.cos(a2) * (W > H ? 1.5 : 1.1) - w / 2
      const y = H / 2 + r * Math.sin(a2) - h / 2
      if (x < 8 || y < 8 || x + w > W - 8 || y + h > H - 8) continue
      if (placed.some((p) => x < p.x + p.w + 8 && x + w + 8 > p.x && y < p.y + p.h + 8 && y + h + 8 > p.y)) continue
      return { ...it, x, y, w, h, size }
    }
  }
  return null
}
function layout(items, W, H, prev) {
  const n = items.length
  const max = items[0] ? items[0].count : 1
  const bucket = n <= 4 ? 0 : n <= 12 ? 1 : n <= 30 ? 2 : 3
  const keep = prev && prev.max === max && prev.bucket === bucket && prev.W === W
  const old = new Map(keep ? prev.list.map((p) => [p.word.toLowerCase(), p]) : [])
  const placed = []
  const todo = []
  items.forEach((it) => {
    const o = old.get(it.word.toLowerCase())
    if (o && o.count === it.count) placed.push({ ...o, ...it, x: o.x, y: o.y, w: o.w, h: o.h, size: o.size })
    else todo.push(it)
  })
  // 방금 보낸 단어가 가장 먼저 자리를 얻는다. 자리가 없으면 오래된 한 번짜리 단어를 하나씩 비운다.
  todo.sort((a, b) => (b.recent ? 1 : 0) - (a.recent ? 1 : 0) || b.count - a.count)
  todo.forEach((it) => {
    for (let tries = 0; tries < 12; tries++) {
      const p = place(it, sizeOf(it, max, n, W, H), placed, W, H)
      if (p) { placed.push(p); return }
      if (!it.recent) return
      let evict = -1
      placed.forEach((q, i) => { if (!q.recent && q.count <= 1 && (evict < 0 || q.size <= placed[evict].size)) evict = i })
      if (evict < 0) return
      placed.splice(evict, 1)
    }
  })
  const top = items[0]
  const lead = top && (n === 1 || top.count > items[1].count) ? top.word.toLowerCase() : ''
  return { max, bucket, W, list: placed.map((p) => ({ ...p, lead: p.word.toLowerCase() === lead })) }
}

// 많이 나온 단어일수록 파란색이 진해진다. 1등은 프라이머리, 그다음은 비율에 따라 세 단계, 한 번 나온 단어는 흰색.
const tierOf = (count, max) => {
  const r = count / max
  if (r >= 0.6) return 'words-t3'
  if (r >= 0.35) return 'words-t2'
  if (count >= 2) return 'words-t1'
  return ''
}

export default function WordsPage() {
  const { search } = useLocation()
  const bare = new URLSearchParams(search).has('screen')
  // 워드클라우드는 스탠바이미와 모니터에서만 보여 준다. 휴대폰 크기 화면에서는 열지 않는다.
  const phone = !bare && typeof window !== 'undefined' && window.innerWidth < 900
  // 와이파이가 느려도 바로 보이도록 마지막으로 받은 단어를 먼저 띄운다.
  const [data, setData] = useState(readCache)
  const [fail, setFail] = useState(false)
  const [portrait, setPortrait] = useState(false)

  useEffect(() => { document.title = 'Words | UIA' }, [])

  // 전체 화면 모드는 며칠 켜 두므로 30분마다 새로 불러와 메모리와 배포본을 갱신한다.
  useEffect(() => {
    if (!bare) return undefined
    // 연결이 끊긴 채로 새로 불러오면 오류 화면이 떠 복구되지 않으므로, 사이트가 응답할 때만 새로 불러오고 아니면 1분 뒤 다시 시도한다.
    let t
    const tick = async () => {
      try {
        const r = await fetch(window.location.pathname + '?ping=' + Date.now(), { cache: 'no-store' })
        if (r.ok || r.status === 404) { window.location.reload(); return }
      } catch { /* 연결 없음 */ }
      t = setTimeout(tick, 60 * 1000)
    }
    t = setTimeout(tick, 30 * 60 * 1000)
    const release = keepAwake()
    return () => { clearTimeout(t); release() }
  }, [bare])

  // 방문객이 보낸 단어가 가장 빨리 보이는 것이 최우선이다.
  // 0.7초마다 작은 확인 요청 하나만 보내고, 바뀐 것이 있을 때만 전체 단어를 함께 받아 새로 그린다.
  useEffect(() => {
    let off = false, timer, failed = 0, ver = ''
    const tick = async () => {
      if (!document.hidden) {
        try {
          // 한 번의 요청으로 변경 여부를 묻고, 바뀐 경우에만 전체 단어를 함께 받는다.
          const r = await pollWords(ver)
          if (r && r.data && !off) { setData(r.data); try { localStorage.setItem(CACHE, JSON.stringify(r.data)) } catch { /* 무시 */ } }
          if (r && r.v) ver = r.v
          if (!off) setFail(false)
          failed = 0
        } catch { failed += 1; if (!off) setFail(true) }
      }
      timer = setTimeout(tick, failed ? SLOW : POLL)
    }
    tick()
    const wake = () => { if (!document.hidden) { clearTimeout(timer); tick() } }
    document.addEventListener('visibilitychange', wake)
    return () => { off = true; clearTimeout(timer); document.removeEventListener('visibilitychange', wake) }
  }, [])

  useEffect(() => {
    const f = () => setPortrait(window.innerWidth < window.innerHeight * 1.1)
    f(); window.addEventListener('resize', f)
    return () => window.removeEventListener('resize', f)
  }, [])

  const W = portrait ? 900 : 800, H = portrait ? 620 : 720
  const qs = data ? data.qs : []
  const key = JSON.stringify(qs.map((q) => q.items.map((i) => i.word + i.count))) + W
  const prevRef = useRef([])
  const placed = useMemo(() => {
    const out = qs.map((q, n) => layout(q.items, W, H, prevRef.current[n]))
    prevRef.current = out
    return out.map((o) => o.list)
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps


  if (phone) return <Navigate to="/" replace />

  return (
    <div className={bare ? 'words-screen' : 'words-page'} style={bare ? undefined : { paddingBottom: 'clamp(1rem, 2vw, 2rem)' }}>
      {bare ? null : <h1 className="t-display words-title">Words</h1>}
      <div className="words-grid">
        {QUESTIONS.map((q, n) => (
          <section key={n}>
            <h2 className="t-h3 words-label">{q.label}</h2>
            <div className="words-stage" style={{ aspectRatio: `${W} / ${H}` }} aria-live="polite">
              {data && (!placed[n] || placed[n].length === 0) ? <p className="words-empty t-ko">아직 남겨진 단어가 없습니다.</p> : null}
              {(placed[n] || []).map((p) => (
                <span
                  key={p.word.toLowerCase()}
                  className={'words-chip ' + (p.lead ? 'words-chip-lead' : tierOf(p.count, (qs[n].items[0] || {}).count || 1))}
                  style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%`, width: `${(p.w / W) * 100}%`, height: `${(p.h / H) * 100}%`, fontSize: `${(p.size / W) * 100}cqw` }}
                >{p.word}</span>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="words-foot">
        <p className="t-ko words-meta">{data ? <><span>참여 인원: {data.participants}</span><span>수집한 단어: {data.qs.reduce((a, q) => a + q.total, 0)}</span></> : ' '}</p>
      </div>
    </div>
  )
}
