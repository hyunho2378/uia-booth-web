import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { events, eventById } from '../data/events'
import { works } from '../data/works'
import { photos } from '../data/photos'

export default function ActivityDetailPage() {
  const { id } = useParams()
  const ev = eventById(id)
  useEffect(() => { if (ev) document.title = ev.ko + ' | UIA 특별관' }, [ev])
  if (!ev) return <Navigate to="/activities" replace />

  const idx = events.findIndex((e) => e.id === ev.id)
  const related = ev.subjectId ? works.filter((w) => w.subjectId === ev.subjectId) : []
  const shots = photos.filter((p) => p.event === ev.id).filter((_, i) => i % 3 === 0).slice(0, 8)

  return (
    <div style={{ paddingBottom: 'clamp(4rem, 8vw, 10rem)' }}>
      <div style={{ paddingBlock: 'clamp(2rem, 3.4vw, 4rem) clamp(1.6rem, 2.6vw, 3rem)' }}>
        <Link to="/activities" className="person-nav t-label" style={{ color: 'var(--mute)' }}>활동 목록</Link>
      </div>

      <div className="two" style={{ alignItems: 'end', marginBottom: 'clamp(2rem, 3.4vw, 4.4rem)' }}>
        <div>
          <h1 className="t-display" style={{ fontSize: 'clamp(2.6rem, 5.2vw, 8rem)' }}>{ev.ko}</h1>
        </div>
        <div>
          <p className="t-lead" style={{ fontWeight: 700 }}>{ev.dateKo}</p>
          <p className="t-lead" style={{ color: 'var(--ink-2)' }}>{ev.placeKo}</p>
        </div>
      </div>

      {ev.cover && (
        <div className="act-hero"><img src={ev.cover} alt={ev.coverAlt} decoding="async" /></div>
      )}

      <div className="two" style={{ paddingBlock: 'clamp(2.6rem, 5vw, 6rem)' }}>
        <h2 className="t-h2">활동 소개</h2>
        <div style={{ maxWidth: '44rem' }}>
          <p className="t-ko" style={{ color: 'var(--ink-2)' }}>{ev.summaryKo}</p>
        </div>
      </div>

      {related.length > 0 && (
        <section style={{ paddingBottom: 'clamp(2.6rem, 5vw, 6rem)' }}>
          <h2 className="t-h2" style={{ marginBottom: 'clamp(1.4rem, 2.4vw, 3rem)' }}>활동 결과</h2>
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
          <h2 className="t-h2" style={{ marginBottom: 'clamp(1.4rem, 2.4vw, 3rem)' }}>Photo</h2>
          <ul className="shot-row">
            {shots.map((p) => (
              <li key={p.src}><img src={p.thumb} alt={ev.ko} loading="lazy" decoding="async" /></li>
            ))}
          </ul>
          <Link to={'/photos?event=' + ev.id} className="more-link t-label" style={{ marginTop: '1.6rem' }}>사진 전체 보기</Link>
        </section>
      )}

    </div>
  )
}
