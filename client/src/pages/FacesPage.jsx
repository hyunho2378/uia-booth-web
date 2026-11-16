import { asset } from '../utils/asset'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import { faces } from '../data/faces'
import { partnerByUniv } from '../data/partners'

export default function FacesPage() {
  useEffect(() => { document.title = '참여 학생 | UIA 특별관' }, [])

  return (
    <div style={{ paddingBottom: 'clamp(4rem, 8vw, 10rem)' }}>
      <PageHeader title="참여 학생" subtitle="학생들이 직접 적은 UIA에 대한 생각과 기억을 소개합니다." />
      <ul className="people-grid">
        {faces.map((f, i) => (
          <li key={f.name}>
            <Link to={'/people/' + (i + 1)} className="person-row">
              {f.photo ? <img src={asset(f.photo)} alt={f.name} className="person-thumb" loading="lazy" decoding="async" /> : partnerByUniv(f.univ) && <img src={asset('/brand/symbols/' + partnerByUniv(f.univ).logo)} alt={f.univ} className="person-thumb person-logo-thumb" loading="lazy" decoding="async" />}
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
