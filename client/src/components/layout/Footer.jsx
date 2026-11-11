export default function Footer() {
  return (
    <footer className="wrap" style={{ paddingBlock: '4rem 5rem', color: 'var(--mute)' }}>
      <div className="flex flex-col md:flex-row md:justify-between" style={{ gap: '2.4rem' }}>
        <div>
          <p className="t-label" style={{ color: 'var(--ink)' }}>UIA Special Hall</p>
          <p className="t-label">대학 임팩트 얼라이언스 특별관</p>
        </div>
        <div className="md:text-right">
          <p className="t-label" style={{ color: 'var(--ink)' }}>The 8th Social Solidarity Economy Expo, KINTEX Goyang</p>
          <p className="t-label">제8회 대한민국 사회연대경제박람회, 고양 킨텍스</p>
          <p className="t-label">2026.11.27 to 2026.11.29</p>
          <p className="t-label" style={{ marginTop: '.8rem' }}>
            Website: Juhyunho,
            <a href="mailto:h20222583@glab.hallym.ac.kr" style={{ marginLeft: '.4em', color: 'var(--ink)' }}>h20222583@glab.hallym.ac.kr</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
