import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { events, eventById } from '../data/events'
import { works } from '../data/works'
import { photos } from '../data/photos'

export default function ActivityDetailPage() {
  const { id } = useParams()
  const ev = eventById(id)
  useEffect(() => { if (ev) document.title = ev.en + ' | UIA 특별관' }, [ev])
  if (!ev) return <Navigate to="/activities" replace />

  const idx = events.findIndex((e) => e.id === ev.id)
  const prev = events[(idx - 1 + events.length) % events.length]
  const next = events[(idx + 1) % events.length]
  const related = ev.subjectId ? works.filter((w) => w.subjectId === ev.subjectId) : []
  const shots = photos.filter((p) => p.event === ev.id).filter((_, i) => i % 3 === 0).slice(0, 8)
  const isKintex = ev.id === 'kintex'

  return (
    <div style={{ paddingBottom: 'clamp(4rem, 8vw, 10rem)' }}>
      <div style={{ paddingBlock: 'clamp(2rem, 3.4vw, 4rem) clamp(1.6rem, 2.6vw, 3rem)' }}>
        <Link to="/activities" className="person-nav t-label" style={{ color: 'var(--mute)' }}><ArrowLeft size={18} />Activities 활동</Link>
      </div>

      <div className="two" style={{ alignItems: 'end', marginBottom: 'clamp(2rem, 3.4vw, 4.4rem)' }}>
        <div>
          <h1 className="t-display" style={{ fontSize: 'clamp(2.6rem, 5.2vw, 8rem)' }}>{ev.en}</h1>
          <p className="t-ko-lg" style={{ marginTop: '.8rem' }}>{ev.ko}</p>
        </div>
        <div>
          <p className="t-lead" style={{ fontWeight: 700 }}>{ev.dateEn}</p>
          <p className="t-lead" style={{ color: 'var(--ink-2)' }}>{ev.placeEn}</p>
          <p className="t-ko" style={{ marginTop: '.3rem' }}>{ev.dateKo}, {ev.placeKo}</p>
        </div>
      </div>

      {ev.cover && (
        <div className="act-hero"><img src={ev.cover} alt={ev.coverAlt} decoding="async" /></div>
      )}

      <div className="two" style={{ paddingBlock: 'clamp(2.6rem, 5vw, 6rem)' }}>
        <h2 className="t-h2">Overview</h2>
        <div style={{ maxWidth: '44rem' }}>
          <p className="t-lead" style={{ color: 'var(--ink-2)' }}>{ev.summaryEn}</p>
          <p className="t-ko" style={{ marginTop: '.6rem' }}>{ev.summaryKo}</p>
        </div>
      </div>

      {isKintex && (
        <div className="two" style={{ paddingBottom: 'clamp(2.6rem, 5vw, 6rem)' }}>
          <h2 className="t-h2">Program and map</h2>
          <div style={{ maxWidth: '44rem' }}>
            <p className="t-h3">Coming Soon</p>
            <p className="t-ko" style={{ marginTop: '.4rem' }}>프로그램과 전시 배치도를 준비하고 있습니다.</p>
            <Link to="/visit" className="more-link t-label" style={{ marginTop: '1.4rem' }}>Visit information 찾아오는 길<ArrowUpRight size={20} /></Link>
          </div>
        </div>
      )}

      {related.length > 0 && (
        <section style={{ paddingBottom: 'clamp(2.6rem, 5vw, 6rem)' }}>
          <h2 className="t-h2" style={{ marginBottom: 'clamp(1.4rem, 2.4vw, 3rem)' }}>Projects <span className="t-ko-lg" style={{ marginLeft: '.6rem' }}>활동 결과</span></h2>
          <ul className="poster-row">
            {related.map((w) => (
              <li key={w.id}>
                <Link to={'/projects/' + w.id} className="poster-link">
                  <span className="poster-img"><img src={w.pages[0]} alt={w.title} loading="lazy" decoding="async" /></span>
                  <span className="t-h3" style={{ display: 'block', marginTop: '1rem' }}>{w.awardLabel || w.title}</span>
                  <span className="t-ko" style={{ display: 'block' }}>{w.awardLabel ? w.title : w.author}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {shots.length > 0 && (
        <section style={{ paddingBottom: 'clamp(2.6rem, 5vw, 6rem)' }}>
          <h2 className="t-h2" style={{ marginBottom: 'clamp(1.4rem, 2.4vw, 3rem)' }}>Photos <span className="t-ko-lg" style={{ marginLeft: '.6rem' }}>현장 사진</span></h2>
          <ul className="shot-row">
            {shots.map((p) => (
              <li key={p.src}><img src={p.thumb} alt={ev.en} loading="lazy" decoding="async" /></li>
            ))}
          </ul>
          <Link to={'/photos?event=' + ev.id} className="more-link t-label" style={{ marginTop: '1.6rem' }}>All photos 사진 전체 보기<ArrowUpRight size={20} /></Link>
        </section>
      )}

      <div className="two" style={{ paddingTop: 'clamp(1rem, 2vw, 2rem)' }}>
        <Link to={'/activities/' + prev.id} className="person-nav t-label" style={{ color: 'var(--mute)' }}><ArrowLeft size={18} />{prev.en}</Link>
        <Link to={'/activities/' + next.id} className="person-nav t-label" style={{ color: 'var(--mute)', justifySelf: 'start' }}>{next.en}<ArrowRight size={18} /></Link>
      </div>
    </div>
  )
}
