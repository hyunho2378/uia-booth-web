import { asset } from '../utils/asset'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader'
import { faces } from '../data/faces'
import { partnerByUniv } from '../data/partners'

export default function FacesPage() {
  useEffect(() => { document.title = '참여 학생 | UIA 특별관' }, [])

  return (
    <div style={{ paddingBottom: 'clamp(4rem, 8vw, 10rem)' }}>
      <PageHeader title="참여 학생" />
      <ul className="people-grid">
        {faces.map((f, i) => {
          const logo = !f.photo && partnerByUniv(f.univ)
          return (
            <li key={f.name}>
              <Link to={'/people/' + (i + 1)} className="person-card">
                <span className={'person-pic' + (logo ? ' is-logo' : '')}>
                  {f.photo
                    ? <img src={asset(f.photo)} alt={f.name} loading="lazy" decoding="async" />
                    : logo && <img src={asset('/brand/symbols/' + logo.logo)} alt={f.univ} loading="lazy" decoding="async" />}
                </span>
                <span className="t-h3 person-name">{f.name}</span>
                <span className="t-ko person-sub">{f.univ} {f.major}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
