import { useEffect, useRef, useState } from 'react'

// UIA 공식 사이트의 4C 전략. 영어 이름은 공식 표기, 영어 설명은 한국어 공식 문구를 옮긴 것이다.
const ITEMS = [
  {
    n: '01', name: 'Connecting', color: '#2d9ed9',
    en: 'We connect universities, students, professors and local communities.',
    ko: '대학과 대학, 학생과 학생, 교수와 지역사회를 연결합니다.',
  },
  {
    n: '02', name: 'Co-Learning', color: '#fdc51b',
    en: 'Members from different majors and campuses learn together at the site of a social problem.',
    ko: '다양한 전공과 대학의 구성원이 사회문제 현장에서 함께 배웁니다.',
  },
  {
    n: '03', name: 'Co-Creating', color: '#e94545',
    en: 'University knowledge and field expertise come together to create new solutions.',
    ko: '대학의 지식과 현장의 전문성으로 새로운 해결책을 함께 만듭니다.',
  },
  {
    n: '04', name: 'Collective Impact', color: '#c4c2c1',
    en: 'Knowledge and solutions spread to communities and society as collective impact.',
    ko: '지식과 해결책을 지역과 사회로 확산해 집합적 임팩트를 만듭니다.',
  },
]

const INTERVAL = 5600

export default function FourC() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
    if (rootRef.current) io.observe(rootRef.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (paused || !inView) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = setInterval(() => setActive(a => (a + 1) % ITEMS.length), INTERVAL)
    return () => clearInterval(id)
  }, [paused, inView])

  const onKey = e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); setActive(a => (a + 1) % ITEMS.length) }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); setActive(a => (a + ITEMS.length - 1) % ITEMS.length) }
  }

  return (
    <section ref={rootRef} className="wrap fourc" aria-labelledby="fourc-title" style={{ paddingBlock: 'clamp(3rem, 6vw, 8rem)' }}>
      <div className="two fourc-grid">
        <div className="fourc-stage" aria-hidden="true">
          {ITEMS.map((c, i) => (
            <div className="orb" key={c.name} data-on={i === active} style={{ '--c': c.color }} onMouseEnter={() => setActive(i)}>
              <span>{c.name === 'Collective Impact' ? <>Collective<br />Impact</> : c.name}</span>
            </div>
          ))}
        </div>

        <div className="fourc-copy" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <h2 id="fourc-title" className="t-h1">UIA's 4C Strategy</h2>
          <div role="group" aria-label="UIA 4C Strategy" onKeyDown={onKey} className="fourc-list">
            {ITEMS.map((c, i) => (
              <button
                key={c.name}
                type="button"
                aria-pressed={i === active}
                className="fourc-row"
                data-on={i === active}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <span className="fourc-n t-label">{c.n}</span>
                <span className="fourc-body">
                  <span className="fourc-name t-h2">{c.name}</span>
                  <span className="fourc-en t-lead">{c.en}</span>
                  <span className="fourc-ko t-ko">{c.ko}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
