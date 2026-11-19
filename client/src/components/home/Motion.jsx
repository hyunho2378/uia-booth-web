import { useEffect, useRef, useState } from 'react'
import { asset } from '../../utils/asset'

// 화면에 들어오면 0에서 목표 숫자까지 올라간다. 자리 폭은 최종 숫자로 미리 잡아 화면이 움직이지 않는다.
export function CountUp({ value, suffix = '', duration = 1400 }) {
  const ref = useRef(null)
  const [now, setNow] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setNow(value); return undefined }
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = t => {
        const p = Math.min(1, (t - t0) / duration)
        setNow(Math.round(value * (1 - Math.pow(1 - p, 4))))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.6 })
    if (ref.current) io.observe(ref.current)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [value, duration])
  return (
    <span ref={ref} className="count" aria-label={value + suffix}>
      <span className="count-ghost" aria-hidden="true">{value}{suffix}</span>
      <span className="count-live" aria-hidden="true">{now}{suffix}</span>
    </span>
  )
}

// 현장 사진 띠. 천천히 흐르고 손을 올리면 멈춘다.
const STRIP = [
  { src: '/photos/cc-group-2.jpg', alt: '임팩톤@춘천 단체 사진' },
  { src: '/photos/sagape/booth/06.jpg', alt: '사회적가치 페스타 부스에서 설명하는 학생' },
  { src: '/photos/gyeongju/sessions/08.jpg', alt: '경주 세션장 전경' },
  { src: '/photos/chuncheon/team08/03.jpg', alt: '춘천 현장조사에 나선 학생들' },
  { src: '/photos/gj-hall.jpg', alt: '세계경주포럼 개회식' },
  { src: '/photos/sagape/session/04.jpg', alt: '사회적가치 페스타 세션 발표' },
  { src: '/photos/chuncheon/team05/02.jpg', alt: '춘천 팀 활동 자료를 펼친 학생들' },
  { src: '/photos/sagape/booth/02.jpg', alt: '봄내런 부스 전시' },
]

export function PhotoStrip() {
  const row = STRIP.map((p, i) => (
    <li key={p.src + i}><img src={asset(p.src)} alt={p.alt} loading="lazy" decoding="async" draggable="false" /></li>
  ))
  return (
    <section className="strip" aria-label="현장 사진">
      <ul className="strip-track">
        {row}
        {STRIP.map((p, i) => (
          <li key={'dup' + i} aria-hidden="true"><img src={asset(p.src)} alt="" loading="lazy" decoding="async" draggable="false" /></li>
        ))}
      </ul>
    </section>
  )
}

// 목록 줄에 손을 올리면 해당 활동 사진이 커서를 따라온다. 터치 화면에서는 나타나지 않는다.
export function useCursorPreview(items) {
  const [hover, setHover] = useState(-1)
  const boxRef = useRef(null)
  const pos = useRef({ x: 0, y: 0, cx: 0, cy: 0 })
  const raf = useRef(0)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const loop = () => {
      const p = pos.current
      p.cx += (p.x - p.cx) * 0.14
      p.cy += (p.y - p.cy) * 0.14
      if (boxRef.current) boxRef.current.style.transform = 'translate3d(' + p.cx.toFixed(1) + 'px,' + p.cy.toFixed(1) + 'px,0)'
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf.current)
  }, [])

  const bind = i => ({
    onPointerEnter: e => { if (e.pointerType === 'mouse') { pos.current.x = pos.current.cx = e.clientX; pos.current.y = pos.current.cy = e.clientY; setHover(i) } },
    onPointerMove: e => { if (e.pointerType === 'mouse') { pos.current.x = e.clientX; pos.current.y = e.clientY } },
    onPointerLeave: () => setHover(-1),
  })

  const node = (
    <div className="cursor-preview" ref={boxRef} aria-hidden="true">
      <div className="cursor-preview-frame" data-on={hover >= 0}>
        {items.map((it, i) => it && <img key={i} src={it} alt="" data-on={i === hover} decoding="async" />)}
      </div>
    </div>
  )
  return { bind, node }
}
