import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import { events } from '../data/events'

function RingCover() {
  return (
    <span className="ring-cover">
      <svg viewBox="0 0 400 400" aria-hidden="true"><circle cx="200" cy="200" r="200" fill="#fdc51b" /><circle cx="200" cy="200" r="140" fill="#212120" /><circle cx="200" cy="200" r="86" fill="#fdc51b" /><circle cx="200" cy="200" r="34" fill="#212120" /></svg>
    </span>
  )
}

export default function ActivitiesPage() {
  useEffect(() => { document.title = 'Activities | UIA 특별관' }, [])
  return (
    <div style={{ paddingBottom: 'clamp(4rem, 8vw, 10rem)' }}>
      <PageHeader title="Activities" ko="활동" subtitle="2026년 UIA 학생들이 현장에서 한 활동 네 가지입니다." />
      <ul className="act-list">
        {events.map((e) => (
          <li key={e.id}>
            <Link to={'/activities/' + e.id} className="act-row two">
              <span className="act-cover" style={{ aspectRatio: '3/2' }}>
                {e.cover ? <img src={e.cover} alt={e.coverAlt} loading="lazy" decoding="async" /> : <RingCover />}
              </span>
              <span className="act-text">
                <span className="t-h1" style={{ display: 'block' }}>{e.en}</span>
                <span className="t-ko-lg" style={{ display: 'block', marginTop: '.5rem' }}>{e.ko}</span>
                <span className="t-lead" style={{ display: 'block', fontWeight: 700, marginTop: '1.6rem' }}>{e.dateEn}, {e.placeEn}</span>
                <span className="t-ko" style={{ display: 'block' }}>{e.dateKo}, {e.placeKo}</span>
                <span className="t-body" style={{ display: 'block', color: 'var(--ink-2)', marginTop: '1.2rem', maxWidth: '40rem' }}>{e.summaryEn}</span>
                <span className="t-ko" style={{ display: 'block', marginTop: '.4rem', fontSize: '1rem', maxWidth: '40rem' }}>{e.summaryKo}</span>
                <span className="more-link t-label" style={{ marginTop: '1.6rem' }}>View details 자세히 보기<ArrowUpRight size={20} /></span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
