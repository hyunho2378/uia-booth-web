import { asset } from '../utils/asset'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import { faces } from '../data/faces'

export default function FacesPage() {
  useEffect(() => { document.title = 'People | UIA 특별관' }, [])

  return (
    <div style={{ paddingBottom: 'clamp(4rem, 8vw, 10rem)' }}>
      <PageHeader title="People" ko="UIA의 얼굴들" subtitle="내가 생각하는 UIA와 가장 인상 깊었던 경험을 참여 학생이 직접 적었습니다." />
      <ul className="people-grid">
        {faces.map((f, i) => (
          <li key={f.name}>
            <Link to={'/people/' + (i + 1)} className="person-row">
              {f.photo && <img src={asset(f.photo)} alt={f.name} className="person-thumb" loading="lazy" decoding="async" />}
              <span className="person-text">
                <span className="t-h2" style={{ display: 'block' }}>{f.name}</span>
                <span className="t-ko" style={{ display: 'block', marginTop: '.3rem' }}>{f.univ} {f.major}</span>
              </span>
              <ArrowUpRight size={26} className="person-arrow" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
