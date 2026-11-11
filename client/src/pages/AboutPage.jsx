import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Ph from '../components/ui/Ph'
import { partners } from '../data/partners'
import { heroPhotos } from '../data/photos'

const FOUR_C = [
  { name: 'Connecting', color: '#2d9ed9', en: 'We connect university to university, student to student, and professors to local communities.', ko: '대학과 대학, 학생과 학생,/교수와 지역사회를 연결합니다' },
  { name: 'Co-Learning', color: '#fdc51b', en: 'Members from many majors and universities learn together at the sites of social problems.', ko: '다양한 전공과 대학의 구성원이/사회문제 현장에서 함께 배웁니다' },
  { name: 'Co-Creating', color: '#e94545', en: 'We create new solutions together by joining university knowledge with field expertise.', ko: '대학의 지식과 현장의 전문성으로/새로운 해결책을 함께 만듭니다' },
  { name: 'Collective Impact', color: '#c4c2c1', en: 'We spread knowledge and solutions to regions and society to build collective impact.', ko: '지식과 해결책을 지역과 사회로 확산해/집합적 임팩트를 만듭니다' },
]

const EXPLORE = [
  { to: '/projects', en: 'Projects', ko: '활동 포스터' },
  { to: '/photos', en: 'Photos', ko: '현장 사진' },
  { to: '/people', en: 'People', ko: '참여 학생' },
]

function useParallax(heroRef, layerRefs) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let tx = 0, ty = 0, cx = 0, cy = 0, idle = 0, last = performance.now(), hasPtr = false, raf = 0
    const hero = heroRef.current
    const onMove = e => {
      const b = hero.getBoundingClientRect()
      tx = (e.clientX - b.left) / b.width - 0.5
      ty = (e.clientY - b.top) / b.height - 0.5
      idle = 0; hasPtr = true
    }
    const onLeave = () => { hasPtr = false }
    hero.addEventListener('pointermove', onMove)
    hero.addEventListener('pointerleave', onLeave)
    const loop = t => {
      idle += t - last; last = t
      const ax = reduce ? 0 : Math.sin(t / 2600) * 0.22
      const ay = reduce ? 0 : Math.cos(t / 3100) * 0.16
      const useP = hasPtr && idle < 1200
      cx += ((useP ? tx : ax) - cx) * 0.06
      cy += ((useP ? ty : ay) - cy) * 0.06
      layerRefs.current.forEach(l => {
        if (!l) return
        const d = parseFloat(l.dataset.depth)
        l.style.transform = 'translate3d(' + (-cx * d * 46).toFixed(2) + 'px,' + (-cy * d * 34).toFixed(2) + 'px,0)'
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); hero.removeEventListener('pointermove', onMove); hero.removeEventListener('pointerleave', onLeave) }
  }, [heroRef, layerRefs])
}

function Layer({ depth, style, children, refs, i }) {
  return <div className="layer" data-depth={depth} style={{ position: 'absolute', willChange: 'transform', ...style }} ref={el => { refs.current[i] = el }}>{children}</div>
}

function Shot({ depth, style, src, alt, refs, i }) {
  return (
    <Layer depth={depth} refs={refs} i={i} style={style}>
      <Link to="/photos" className="shot-link" aria-label={alt}>
        <img src={src} alt={alt} loading="eager" decoding="async" />
      </Link>
    </Layer>
  )
}

export default function AboutPage() {
  const heroRef = useRef(null)
  const layerRefs = useRef([])
  useParallax(heroRef, layerRefs)
  useEffect(() => { document.title = 'UIA Special Hall | UIA 특별관' }, [])

  return (
    <>
      {/* 첫 화면 */}
      <section ref={heroRef} className="wrap two" style={{ minHeight: 'calc(100vh - var(--header-h))', alignItems: 'center', paddingBlock: '2rem 4rem', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 3, display: 'grid', gap: '2.4rem' }}>
          <div>
            <h1 className="t-display">University Impact Alliance</h1>
            <p className="t-ko-lg" style={{ marginTop: '1.1rem' }}>대학 임팩트 얼라이언스</p>
          </div>
          <div>
            <p className="t-h2" style={{ maxWidth: '24em' }}>Together we build the learning and impact that no single university can create alone.</p>
            <p className="t-ko" style={{ marginTop: '.7rem' }}><Ph text="한 대학이 혼자서는/만들 수 없는/배움과 임팩트를/함께 만듭니다" /></p>
          </div>
          <div>
            <p className="t-lead" style={{ fontWeight: 700 }}><Ph text="2026 Social Solidarity Economy Expo,/UIA Special Hall" /></p>
            <p className="t-lead" style={{ color: 'var(--ink-2)' }}><Ph text="November 27 to 29,/KINTEX, Goyang" /></p>
            <p className="t-ko" style={{ marginTop: '.5rem' }}>2026 사회연대경제박람회 UIA 특별관</p>
            <p className="t-ko">11월 27일부터 29일까지, 고양 킨텍스</p>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 2, height: 'min(80vh, 56vw)', minHeight: '30rem' }} className="hero-stage">
          <Layer refs={layerRefs} i={0} depth=".25" style={{ left: '-6%', top: 0, width: '58%', aspectRatio: '1' }}>
            <svg viewBox="0 0 400 400" style={{ display: 'block', width: '100%', height: '100%' }}><circle cx="200" cy="200" r="200" fill="#fdc51b" /><circle cx="200" cy="200" r="140" style={{ fill: 'var(--bg)' }} /><circle cx="200" cy="200" r="86" fill="#fdc51b" /><circle cx="200" cy="200" r="34" style={{ fill: 'var(--bg)' }} /></svg>
          </Layer>
          <Layer refs={layerRefs} i={1} depth=".55" style={{ right: '-5%', bottom: '-3%', width: '62%', aspectRatio: '2/1' }}>
            <svg viewBox="0 0 400 200" fill="none" stroke="#2d9ed9" strokeWidth="42" style={{ display: 'block', width: '100%', height: '100%' }}><path d="M20 160c0-90 80-90 80-20s90 70 90-20 90-90 90 0 80 70 80 10" /></svg>
          </Layer>
          <Layer refs={layerRefs} i={2} depth=".9" style={{ right: '8%', top: '-3%', width: '13%', aspectRatio: '1' }}>
            <svg viewBox="0 0 100 100" style={{ display: 'block', width: '100%', height: '100%' }}><circle cx="50" cy="50" r="50" fill="#e94545" /></svg>
          </Layer>
          <Shot refs={layerRefs} i={3} depth="1.1" src={heroPhotos.chuncheon} alt="Group photo at Impactthon Chuncheon" style={{ left: 0, top: '9%', width: '62%', aspectRatio: '2400/1363' }} />
          <Shot refs={layerRefs} i={4} depth="1.7" src={heroPhotos.sagape} alt="Students at the UIA booth" style={{ right: 0, top: '33%', width: '56%', aspectRatio: '3/2' }} />
          <Shot refs={layerRefs} i={5} depth="2.2" src={heroPhotos.gyeongju} alt="Students at the World Gyeongju Forum" style={{ left: '13%', bottom: 0, width: '25%', aspectRatio: '2/3' }} />
        </div>
      </section>

      {/* UIA는 */}
      <section className="wrap two" style={{ paddingBlock: 'clamp(4rem, 9vw, 11rem)' }}>
        <div>
          <h2 className="t-h1">About UIA</h2>
          <p className="t-ko-lg" style={{ marginTop: '.8rem' }}>UIA는</p>
        </div>
        <div style={{ display: 'grid', gap: '2.2rem', maxWidth: '44rem' }}>
          <div>
            <p className="t-lead" style={{ color: 'var(--ink-2)' }}>UIA is a university social innovation network. Leading universities and social innovation organizations in Korea join forces to raise a generation that helps solve social and environmental problems.</p>
            <p className="t-ko" style={{ marginTop: '.6rem' }}><Ph text="국내 주요 대학과 사회혁신 생태계 조직이 연대하여,/사회와 환경 문제 해결에 기여하는/미래세대를 양성하는/대학 사회혁신 협력 네트워크입니다." /></p>
          </div>
          <div>
            <p className="t-lead" style={{ color: 'var(--ink-2)' }}>By connecting each university's education and research strengths, talent and local networks, we build learning and impact that no single university could create alone.</p>
            <p className="t-ko" style={{ marginTop: '.6rem' }}><Ph text="각 대학의 교육과 연구 역량, 인재,/지역사회 네트워크를 연결해/한 대학이 혼자서는 만들 수 없는/배움과 임팩트를 함께 만듭니다." /></p>
          </div>
        </div>
      </section>

      {/* 4C */}
      <section className="wrap" style={{ paddingBlock: 'clamp(2rem, 4vw, 5rem) clamp(4rem, 9vw, 11rem)' }}>
        <div className="two" style={{ alignItems: 'center' }}>
          <div className="orbs" aria-hidden="true">
            {FOUR_C.map(c => (
              <div className="orb" key={c.name} style={{ '--c': c.color }}>
                <span>{c.name === 'Collective Impact' ? <Ph text="Collective/Impact" /> : c.name}</span>
              </div>
            ))}
          </div>
          <div>
            <h2 className="t-h1">UIA's 4C Strategy</h2>
            <p className="t-ko" style={{ marginBottom: '2.6rem' }}>UIA의 4C 전략</p>
            {FOUR_C.map(c => (
              <div key={c.name} style={{ marginBottom: '2.2rem' }}>
                <h3 className="t-h3" style={{ marginBottom: '.5rem' }}>{c.name}</h3>
                <p className="t-body" style={{ color: 'var(--ink)' }}>{c.en}</p>
                <p className="t-ko" style={{ marginTop: '.2rem', fontSize: '1rem' }}><Ph text={c.ko} /></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 함께하는 대학 */}
      <section className="wrap" style={{ paddingBlock: 'clamp(2rem, 4vw, 5rem) clamp(4rem, 9vw, 11rem)' }}>
        <div className="two" style={{ marginBottom: 'clamp(2.4rem, 4vw, 5rem)' }}>
          <div>
            <h2 className="t-h1">Partner universities</h2>
            <p className="t-ko-lg" style={{ marginTop: '.8rem' }}>함께하는 대학</p>
          </div>
          <div style={{ maxWidth: '44rem' }}>
            <p className="t-lead" style={{ color: 'var(--ink-2)' }}>Universities and Root Impact work together. Each university joins in its own color, and any university that runs social innovation education is welcome to join at any time.</p>
            <p className="t-ko" style={{ marginTop: '.6rem' }}><Ph text="대학과 루트임팩트가 함께합니다./각 대학은 자신의 색으로 참여하며,/사회혁신 교육을 운영하는 대학이라면/언제든 합류할 수 있습니다." /></p>
          </div>
        </div>
        <ul className="partner-grid">
          {partners.map(p => (
            <li key={p.id}>
              <div className="partner-logo"><img src={'/brand/symbols/' + p.logo} alt={p.en} loading="lazy" decoding="async" /></div>
              <p className="t-label" style={{ color: 'var(--ink)', marginTop: '.9rem' }}>{p.en}</p>
              <p className="t-ko" style={{ fontSize: '.95rem' }}>{p.ko}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 둘러보기 */}
      <section className="wrap" style={{ paddingBlock: 'clamp(2rem, 4vw, 5rem) clamp(5rem, 10vw, 12rem)' }}>
        <ul>
          {EXPLORE.map(x => (
            <li key={x.to}>
              <Link to={x.to} className="explore-row two">
                <span className="t-h1">{x.en}</span>
                <span className="explore-ko t-ko-lg">{x.ko}<ArrowUpRight size={28} /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
