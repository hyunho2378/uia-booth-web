import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { faces } from '../data/faces'
import { partnerByUniv } from '../data/partners'

function Paragraphs({ text }) {
  const parts = (text || '').split('\n').map(s => s.trim()).filter(Boolean)
  if (!parts.length) {
    return (
      <p className="t-body" style={{ color: 'var(--mute)' }}>
        Message coming soon <span className="t-ko" style={{ fontSize: '1rem', marginLeft: '.5em' }}>메시지를 준비하고 있습니다</span>
      </p>
    )
  }
  return parts.map((p, i) => <p key={i} className="person-body">{p}</p>)
}

export default function FaceDetailPage() {
  const { id } = useParams()
  const idx = Number(id) - 1
  const f = faces[idx]
  useEffect(() => { if (f) document.title = f.name + ' | UIA 특별관' }, [f])
  if (!f) return <Navigate to="/people" replace />

  const partner = partnerByUniv(f.univ)
  const prev = faces[(idx - 1 + faces.length) % faces.length]
  const next = faces[(idx + 1) % faces.length]

  return (
    <div style={{ paddingBlock: 'clamp(2rem, 3vw, 4rem) clamp(4rem, 8vw, 10rem)' }}>
      <Link to="/people" className="t-label" style={{ color: 'var(--mute)', display: 'inline-flex', alignItems: 'center', gap: '.5rem', marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> People
      </Link>

      <div className="two person-detail">
        <div className="person-photo-wrap">
          <div className="person-photo">
            {f.photo ? (
              <img src={f.photo} alt={f.name} decoding="async" />
            ) : partner ? (
              <img src={'/brand/symbols/' + partner.logo} alt={partner.en} className="person-logo" />
            ) : null}
          </div>
        </div>

        <div>
          <h1 className="t-h1">{f.name}</h1>
          <p className="t-ko-lg" style={{ marginTop: '.6rem' }}>{f.univ} {f.major}</p>

          <section style={{ marginTop: 'clamp(2.4rem, 4vw, 4.6rem)' }}>
            <h2 className="t-h3">What UIA means to me</h2>
            <p className="t-ko" style={{ margin: '.2rem 0 1.2rem' }}>내가 생각하는 UIA</p>
            <Paragraphs text={f.uia} />
          </section>

          <section style={{ marginTop: 'clamp(2.4rem, 4vw, 4.6rem)' }}>
            <h2 className="t-h3">A moment I remember</h2>
            <p className="t-ko" style={{ margin: '.2rem 0 1.2rem' }}>인상 깊었던 경험</p>
            <Paragraphs text={f.memory} />
          </section>

          <nav className="flex justify-between" style={{ marginTop: 'clamp(3rem, 5vw, 6rem)', gap: '2rem' }}>
            <Link to={'/people/' + (((idx - 1 + faces.length) % faces.length) + 1)} className="t-label person-nav" style={{ color: 'var(--mute)' }}>
              <ArrowLeft size={18} /> {prev.name}
            </Link>
            <Link to={'/people/' + (((idx + 1) % faces.length) + 1)} className="t-label person-nav" style={{ color: 'var(--mute)' }}>
              {next.name} <ArrowRight size={18} />
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}
