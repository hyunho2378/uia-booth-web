export default function ProjectFilter({ subjects, activeId, onChange }) {
  const chips = subjects.map(s => (
    <button
      key={s.id}
      onClick={() => onChange(s.id)}
      className={'tab' + (activeId === s.id ? ' is-on' : '')}
    >
      {s.name}
    </button>
  ))

  return (
    <>
      {/* 모바일: 가로 스크롤 */}
      <div className="lg:hidden">
        <div className="tab-row">{chips}</div>
      </div>

      {/* 데스크탑: 세로 사이드 */}
      <aside className="hidden lg:flex flex-col shrink-0" style={{ gap: "var(--sp-1)", alignItems: "flex-start" }}>
        {chips}
      </aside>
    </>
  )
}
