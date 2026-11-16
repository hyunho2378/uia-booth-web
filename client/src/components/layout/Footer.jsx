export default function Footer() {
  return (
    <footer className="wrap" style={{ paddingBlock: '4rem 5rem', color: 'var(--mute)' }}>
      <div className="flex flex-col md:flex-row md:justify-between" style={{ gap: '2.4rem' }}>
        <div>
          <p className="t-label" style={{ color: 'var(--ink)' }}>대학 임팩트 얼라이언스 특별관</p>
        </div>
        <div className="md:text-right">
          <p className="t-label" style={{ color: 'var(--ink)' }}>제8회 대한민국 사회연대경제박람회, 고양 킨텍스</p>
          <p className="t-label">2026년 11월 27일부터 29일까지</p>
          <p className="t-label" style={{ marginTop: '.8rem' }}>
            웹사이트 제작: 주현호,
            <a href="mailto:h20222583@glab.hallym.ac.kr" style={{ marginLeft: '.4em', color: 'var(--ink)' }}>h20222583@glab.hallym.ac.kr</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
