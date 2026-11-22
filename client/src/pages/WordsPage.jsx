import { useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader'
import { getWords } from '../nfc/db'
import { shareLink, siteUrl } from '../nfc/share'
import { asset } from '../utils/asset'
import { QUESTIONS } from '../nfc/survey'
import { keepAwake } from '../utils/wakeLock'

const POLL = 3000

function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) }

// 많이 나온 단어부터 중앙에서 나선으로 퍼지며 겹치지 않는 자리에 놓는다. 좌표는 무대 폭(W) 기준 숫자다.
function layout(items, W, H) {
  const ctx = document.createElement('canvas').getContext('2d')
  const n = items.length
  const max = items[0] ? items[0].count : 1
  const k = n <= 4 ? 1.25 : n <= 12 ? 1.05 : n <= 30 ? 0.85 : 0.7
  const base = (W > H ? 40 : 36) * k
  const placed = []
  items.forEach((it, idx) => {
    for (const shrink of [1, 0.85, 0.7, 0.55, 0.42]) {
      const size = Math.round(base * shrink * (0.62 + 1.3 * Math.pow(it.count / max, 0.55)))
      ctx.font = `700 ${size}px Pretendard Variable, Pretendard, sans-serif`
      const w = ctx.measureText(it.word).width + size * 1.1
      const h = size * 1.72
      const seed = (hash(it.word) % 628) / 100
      let ok = false
      for (let t = 0; t < 4000 && !ok; t++) {
        const a2 = seed + t * 0.33, r = 2 + t * 0.85
        const x = W / 2 + r * Math.cos(a2) * (W > H ? 1.5 : 1.1) - w / 2
        const y = H / 2 + r * Math.sin(a2) - h / 2
        if (x < 8 || y < 8 || x + w > W - 8 || y + h > H - 8) continue
        if (placed.some((p) => x < p.x + p.w + 8 && x + w + 8 > p.x && y < p.y + p.h + 8 && y + h + 8 > p.y)) continue
        placed.push({ ...it, x, y, w, h, size, lead: idx === 0 && (n === 1 || it.count > items[1].count) })
        ok = true
      }
      if (ok) break
    }
  })
  return placed
}

export default function WordsPage() {
  const { search } = useLocation()
  const bare = new URLSearchParams(search).has('screen')
  // 워드클라우드는 스탠바이미와 모니터에서만 보여 준다. 휴대폰 크기 화면에서는 열지 않는다.
  const phone = !bare && typeof window !== 'undefined' && window.innerWidth < 900
  const [data, setData] = useState(null)
  const [fail, setFail] = useState(false)
  const [portrait, setPortrait] = useState(false)
  const [note, setNote] = useState('')

  useEffect(() => { document.title = 'Words | UIA' }, [])

  // 전체 화면 모드는 며칠 켜 두므로 30분마다 새로 불러와 메모리와 배포본을 갱신한다.
  useEffect(() => {
    if (!bare) return undefined
    const t = setTimeout(() => window.location.reload(), 30 * 60 * 1000)
    const release = keepAwake()
    return () => { clearTimeout(t); release() }
  }, [bare])

  useEffect(() => {
    let off = false, timer
    const tick = async () => {
      if (!document.hidden) {
        try { const r = await getWords(); if (!off) { setData(r); setFail(false) } } catch { if (!off) setFail(true) }
      }
      timer = setTimeout(tick, POLL)
    }
    tick()
    return () => { off = true; clearTimeout(timer) }
  }, [])

  useEffect(() => {
    const f = () => setPortrait(window.innerWidth < window.innerHeight * 1.1)
    f(); window.addEventListener('resize', f)
    return () => window.removeEventListener('resize', f)
  }, [])

  const W = portrait ? 900 : 800, H = portrait ? 620 : 720
  const qs = data ? data.qs : []
  const key = JSON.stringify(qs.map((q) => q.items.map((i) => i.word + i.count))) + W
  const placed = useMemo(() => qs.map((q) => layout(q.items, W, H)), [key]) // eslint-disable-line react-hooks/exhaustive-deps

  const share = async () => {
    const r = await shareLink('UIA 특별관 워드클라우드', siteUrl('/words'))
    if (r === 'copied') { setNote('링크를 복사했어요'); setTimeout(() => setNote(''), 2200) }
  }

  if (phone) return <Navigate to="/" replace />

  return (
    <div className={bare ? 'words-screen' : ''} style={bare ? undefined : { paddingBottom: 'clamp(3rem, 6vw, 7rem)' }}>
      {bare ? null : <PageHeader title="Words" />}
      {bare ? null : <p className="t-lead" style={{ maxWidth: '46rem' }}>방문객이 NFC로 남긴 단어가 실시간으로 모입니다.</p>}
      <div className="words-grid">
        {QUESTIONS.map((q, n) => (
          <section key={n}>
            <h2 className="t-h3 words-label">{q.label}</h2>
            <p className="t-ko words-q">{q.q}</p>
            <div className="words-stage" style={{ '--bg': `url(${asset('/nfc/bg-screen.webp')})`, aspectRatio: `${W} / ${H}` }} aria-live="polite">
              {data && (!placed[n] || placed[n].length === 0) ? <p className="words-empty t-ko">아직 남겨진 단어가 없습니다.</p> : null}
              {(placed[n] || []).map((p) => (
                <span
                  key={p.word.toLowerCase()}
                  className={'words-chip' + (p.lead ? ' words-chip-lead' : '')}
                  style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%`, width: `${(p.w / W) * 100}%`, height: `${(p.h / H) * 100}%`, fontSize: `${(p.size / W) * 100}cqw` }}
                >{p.word}</span>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="words-foot">
        <p className="t-ko words-meta">{data ? `${data.participants}명 참여  단어 ${data.qs.reduce((a, q) => a + q.total, 0)}개` : ' '}{fail ? '  연결을 다시 시도하는 중입니다' : ''}</p>
        {bare ? null : <button type="button" className="words-share t-ko" onClick={share}>{note || '링크 공유'}</button>}
      </div>
    </div>
  )
}
