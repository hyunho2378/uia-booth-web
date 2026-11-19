import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { asset } from '../utils/asset'
import { partners } from '../data/partners'
import FourC from '../components/home/FourC'
import { PhotoStrip } from '../components/home/Motion'
import { heroPhotos } from '../data/photos'

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
          <Shot refs={layerRefs} i={4} depth="1.7" src={heroPhotos.sagape} alt="사회적가치 페스타 세션 무대에서 함께 찍은 참가자들" style={{ right: 0, top: '33%', width: '56%', aspectRatio: '3/2' }} />
          <Shot refs={layerRefs} i={5} depth="2.2" src={heroPhotos.gyeongju} alt="세계경주포럼에 참여한 학생들" style={{ left: '13%', bottom: 0, width: '25%', aspectRatio: '2/3' }} />
        </div>
      </section>

      {/* UIA는 */}
      <section className="wrap two" style={{ paddingBlock: 'clamp(2rem, 3.6vw, 4.6rem)' }}>
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
          <div>
            <p className="t-ko" style={{ color: 'var(--ink-2)' }}>9개 대학 11개 캠퍼스가 참여하며 2026년에 정식 출범했습니다. 춘천 임팩톤에는 학생 55명 이상이 참여했습니다.</p>
          </div>
        </div>
      </section>

      <FourC />

      {/* 함께하는 대학 */}
      <section className="wrap" style={{ paddingBlock: 'clamp(2rem, 3.4vw, 4.4rem)', textAlign: 'center' }}>
        <h2 className="t-h1" style={{ marginBottom: 'clamp(1.6rem, 2.6vw, 3.2rem)' }}>함께하는 대학</h2>
        <ul className="partner-grid">
          {partners.map(p => (
            <li key={p.id}>
              <div className="partner-logo"><img src={asset('/brand/symbols/' + p.logo)} alt={p.ko} loading="lazy" decoding="async" /></div>
              <p className="t-label" style={{ color: 'var(--ink)', marginTop: '.9rem' }}>{p.ko}</p>
            </li>
          ))}
        </ul>
      </section>

      <PhotoStrip />
    </>
  )
}
