// 영어 제목 아래에 한국어를 함께 둔다.
export default function PageHeader({ title, ko, subtitle }) {
  return (
    <div style={{ paddingBlock: 'clamp(3rem, 5vw, 6rem) clamp(2rem, 3vw, 4rem)' }}>
      <h1 className="t-display">{title}</h1>
      {ko && <p className="t-ko-lg" style={{ marginTop: '1rem' }}>{ko}</p>}
      {subtitle && <p className="t-ko" style={{ marginTop: '.6rem', maxWidth: '44rem' }}>{subtitle}</p>}
    </div>
  )
}
