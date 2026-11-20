import { useEffect, useMemo, useRef, useState } from 'react'
import PageHeader from '../components/ui/PageHeader'
import { getWords } from '../nfc/db'

const COLORS = ['#212120', '#2d9ed9', '#e94545', '#e0a400', '#3c3c3c']
const POLL = 3000

function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) }

// 큰 단어부터 나선을 따라 겹치지 않는 자리에 놓는다.
function layout(items, W, H) {
  const ctx = document.createElement('canvas').getContext('2d')
  const max = items[0] ? items[0].count : 1
  const n = items.length
  const k = n <= 15 ? 1.9 : n <= 40 ? 1.35 : 1
  const base = (W > H ? 54 : 46) * k
  const placed = []
  for (const it of items) {
    const size = Math.round(base * (0.5 + 1.5 * Math.pow(it.count / max, 0.6)) * (n > 60 ? 0.7 : 1))
    ctx.font = `800 ${size}px Pretendard Variable, Pretendard, sans-serif`
    const w = ctx.measureText(it.word).width + size * 0.3
    const h = size * 1.15
    let ok = false
    const rot = false
    const bw = rot ? h : w, bh = rot ? w : h
    const seed = hash(it.word) % 628 / 100
    for (let t = 0; t < 4000 && !ok; t++) {
      const a = seed + t * 0.35, r = 2 + t * 0.9
      const x = W / 2 + r * Math.cos(a) * 1.7 - bw / 2
      const y = H / 2 + r * Math.sin(a) - bh / 2
      if (x < 0 || y < 0 || x + bw > W || y + bh > H) continue
      if (placed.some((p) => x < p.x + p.bw && x + bw > p.x && y < p.y + p.bh && y + bh > p.y)) continue
      placed.push({ ...it, x, y, bw, bh, size, rot, cx: x + bw / 2, cy: y + bh / 2 })
      ok = true
    }
  }
  return placed
}

export default function WordsPage() {
  const [data, setData] = useState(null)
  const [fail, setFail] = useState(false)
  const [portrait, setPortrait] = useState(false)
  const box = useRef(null)

  useEffect(() => { document.title = 'Words | UIA' }, [])

  useEffect(() => {
    let off = false, timer
    const tick = async () => {
      if (document.hidden) { timer = setTimeout(tick, POLL); return }
      try { const r = await getWords(); if (!off) { setData(r); setFail(false) } } catch { if (!off) setFail(true) }
      timer = setTimeout(tick, POLL)
    }
    tick()
    return () => { off = true; clearTimeout(timer) }
  }, [])

  useEffect(() => {
    const f = () => setPortrait(window.innerWidth < window.innerHeight * 1.05)
    f(); window.addEventListener('resize', f)
    return () => window.removeEventListener('resize', f)
  }, [])

  const W = portrait ? 900 : 1600, H = portrait ? 1100 : 720
  const items = data ? data.items : []
  const key = items.map((i) => i.word + i.count).join('|') + W
  const placed = useMemo(() => layout(items, W, H), [key]) // eslint-disable-line

  return (
    <div style={{ paddingBottom: 'clamp(3rem, 6vw, 7rem)' }}>
      <PageHeader title="Words" />
      <p className="t-lead" style={{ maxWidth: '46rem' }}>방문객이 NFC로 남긴 “UIA 하면 떠오르는 단어”가 실시간으로 모입니다.</p>
      <div ref={box} className="words-stage" aria-live="polite">
        {data && placed.length === 0 && <p className="words-empty t-ko">아직 남겨진 단어가 없습니다.</p>}
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="워드클라우드">
          {placed.map((p) => (
            <text key={p.word.toLowerCase()} className="words-t" textAnchor="middle" dominantBaseline="central" fontSize={p.size} fill={COLORS[hash(p.word) % COLORS.length]}
              style={{ transform: `translate(${p.cx}px, ${p.cy}px) rotate(${p.rot ? -90 : 0}deg)` }}>{p.word}</text>
          ))}
        </svg>
      </div>
      <p className="t-ko words-meta">{data ? `참여 ${data.participants}명 / 단어 ${data.total}개` : ' '}{fail ? ' / 연결을 다시 시도하는 중입니다' : ''}</p>
    </div>
  )
}
