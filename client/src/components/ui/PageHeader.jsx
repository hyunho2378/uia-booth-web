export default function PageHeader({ title, ko, subtitle }) {
  return (
    <div style={{ paddingBlock: 'clamp(2.2rem, 3.4vw, 4.2rem) clamp(1.6rem, 2.2vw, 3rem)' }}>
      <h1 className="t-display">{ko || title}</h1>
      {subtitle && <p className="t-ko" style={{ marginTop: '.6rem', maxWidth: '44rem' }}>{subtitle}</p>}
    </div>
  )
}
