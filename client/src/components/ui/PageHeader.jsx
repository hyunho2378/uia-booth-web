export default function PageHeader({ title, ko, subtitle }) {
  return (
    <div style={{ paddingBlock: 'clamp(3rem, 5vw, 6rem) clamp(2rem, 3vw, 4rem)' }}>
      <h1 className="t-display">{ko || title}</h1>
      {subtitle && <p className="t-ko" style={{ marginTop: '.6rem', maxWidth: '44rem' }}>{subtitle}</p>}
    </div>
  )
}
