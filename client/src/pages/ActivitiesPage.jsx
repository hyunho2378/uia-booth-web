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
  useEffect(() => { document.title = '활동 | UIA 특별관' }, [])
  return (
    <div style={{ paddingBottom: 'clamp(4rem, 8vw, 10rem)' }}>
      <PageHeader title="활동" />
      <ul className="act-list">
        {events.map((e) => (
          <li key={e.id}>
            <Link to={'/activities/' + e.id} className="act-row two">
              <span className="act-cover" style={{ aspectRatio: '3/2' }}>
                {e.cover ? <img src={e.cover} alt={e.coverAlt} loading="lazy" decoding="async" /> : <RingCover />}
              </span>
              <span className="act-text">
                <span className="t-h1" style={{ display: 'block' }}>{e.ko}</span>
                <span className="t-lead" style={{ display: 'block', fontWeight: 700, marginTop: '1.2rem' }}>{e.dateKo}, {e.placeKo}</span>
                <span className="t-ko" style={{ display: 'block', marginTop: '1.2rem', maxWidth: '40rem' }}>{e.summaryKo}</span>
                <span className="more-link t-label" style={{ marginTop: '1.6rem' }}>자세히 보기<ArrowUpRight size={20} /></span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
