import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { asset } from '../utils/asset'
import { partners } from '../data/partners'
import { StatsBand, Programs, TimelineRows, FeaturedProjects, Voices, Notices, VisitBand } from '../components/home/Sections'
import { heroPhotos } from '../data/photos'

const FOUR_C = [
  { name: '대학 연결', color: '#2d9ed9', body: '대학과 대학, 학생과 학생, 교수와 지역사회를 연결합니다.' },
  { name: '함께 배우기', color: '#fdc51b', body: '다양한 전공과 대학의 구성원이 사회문제 현장에서 함께 배웁니다.' },
  { name: '함께 만들기', color: '#e94545', body: '대학의 지식과 현장의 전문성을 모아 새로운 해결책을 함께 만듭니다.' },
  { name: '공동의 변화', color: '#c4c2c1', body: '지식과 해결책을 지역과 사회로 확산해 공동의 변화를 만듭니다.' },
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
  useEffect(() => { document.title = 'UIA 특별관 소개' }, [])

  return (
    <>
      {/* 첫 화면 */}
      <section ref={heroRef} className="wrap two" style={{ minHeight: 'calc(100vh - var(--header-h))', alignItems: 'center', paddingBlock: '2rem 4rem', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 3, display: 'grid', gap: '2.4rem' }}>
          <div>
            <h1 className="t-display">대학 임팩트 얼라이언스</h1>
          </div>
          <div>
            <p className="t-h2" style={{ maxWidth: '24em' }}>한 대학이 혼자서는 만들 수 없는 배움과 임팩트를 함께 만듭니다.</p>
          </div>
          <div>
            <p className="t-lead" style={{ fontWeight: 700 }}>2026 사회연대경제박람회 UIA 특별관</p>
            <p className="t-lead" style={{ color: 'var(--ink-2)' }}>11월 27일부터 29일까지, 고양 킨텍스</p>
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
          <Shot refs={layerRefs} i={3} depth="1.1" src={heroPhotos.chuncheon} alt="춘천 임팩톤 참가 학생 단체 사진" style={{ left: 0, top: '9%', width: '62%', aspectRatio: '2400/1363' }} />
          <Shot refs={layerRefs} i={4} depth="1.7" src={heroPhotos.sagape} alt="UIA 특별관을 찾은 학생들" style={{ right: 0, top: '33%', width: '56%', aspectRatio: '3/2' }} />
          <Shot refs={layerRefs} i={5} depth="2.2" src={heroPhotos.gyeongju} alt="세계경주포럼에 참여한 학생들" style={{ left: '13%', bottom: 0, width: '25%', aspectRatio: '2/3' }} />
        </div>
      </section>

      <StatsBand />

      {/* UIA는 */}
      <section className="wrap two" style={{ paddingBlock: 'clamp(4rem, 9vw, 11rem)' }}>
        <div>
          <h2 className="t-h1">UIA는</h2>
        </div>
        <div style={{ display: 'grid', gap: '2.2rem', maxWidth: '44rem' }}>
          <div>
            <p className="t-ko" style={{ color: 'var(--ink-2)' }}>국내 주요 대학과 사회혁신 생태계 조직이 연대해 사회와 환경 문제 해결에 기여하는 미래세대를 양성하는 대학 사회혁신 협력 네트워크입니다.</p>
          </div>
          <div>
            <p className="t-ko" style={{ color: 'var(--ink-2)' }}>각 대학의 교육과 연구 역량, 인재와 지역사회 네트워크를 연결해 한 대학이 혼자서는 만들 수 없는 배움과 임팩트를 함께 만듭니다.</p>
          </div>
        </div>
      </section>

      {/* 4C */}
      <section className="wrap" style={{ paddingBlock: 'clamp(2rem, 4vw, 5rem) clamp(4rem, 9vw, 11rem)' }}>
        <div className="two" style={{ alignItems: 'center' }}>
          <div className="orbs" aria-hidden="true">
            {FOUR_C.map(c => (
              <div className="orb" key={c.name} style={{ '--c': c.color }}>
                <span>{c.name}</span>
              </div>
            ))}
          </div>
          <div>
            <h2 className="t-h1">UIA의 4C 전략</h2>
            {FOUR_C.map(c => (
              <div key={c.name} style={{ marginBottom: '2.2rem' }}>
                <h3 className="t-h3" style={{ marginBottom: '.5rem' }}>{c.name}</h3>
                <p className="t-ko" style={{ fontSize: '1rem' }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 함께하는 대학 */}
      <section className="wrap" style={{ paddingBlock: 'clamp(2rem, 4vw, 5rem) clamp(4rem, 9vw, 11rem)' }}>
        <div className="two" style={{ marginBottom: 'clamp(2.4rem, 4vw, 5rem)' }}>
          <div>
            <h2 className="t-h1">함께하는 대학</h2>
          </div>
          <div style={{ maxWidth: '44rem' }}>
            <p className="t-ko" style={{ color: 'var(--ink-2)' }}>대학과 루트임팩트가 함께합니다. 각 대학은 자신의 색으로 참여하며, 사회혁신 교육을 운영하는 대학이라면 언제든 합류할 수 있습니다.</p>
          </div>
        </div>
        <ul className="partner-grid">
          {partners.map(p => (
            <li key={p.id}>
              <div className="partner-logo"><img src={asset('/brand/symbols/' + p.logo)} alt={p.ko} loading="lazy" decoding="async" /></div>
              <p className="t-label" style={{ color: 'var(--ink)', marginTop: '.9rem' }}>{p.ko}</p>
            </li>
          ))}
        </ul>
      </section>

      <Programs />
      <TimelineRows />
      <FeaturedProjects />
      <Voices />
      <Notices />
      <VisitBand />
    </>
  )
}
