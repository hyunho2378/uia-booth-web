export default function ProjectFilter({ subjects, activeId, onChange }) {
  const chips = subjects.map(s => (
    <button
      key={s.id}
      onClick={() => onChange(s.id)}
      className={`t-h3 bg-transparent border-none p-0 text-left cursor-pointer transition-colors duration-200 ${activeId === s.id ? 'text-text-primary' : 'text-text-muted hover:text-text-primary'}`}
    >
      {s.name}
    </button>
  ))

  return (
    <>
      {/* 모바일: 가로 스크롤 */}
      <div className="lg:hidden overflow-x-auto pb-2">
        <div className="flex gap-5 w-max">{chips}</div>
      </div>

      {/* 데스크탑: 세로 사이드 */}
      <aside className="hidden lg:flex flex-col gap-3 shrink-0">
        {chips}
      </aside>
    </>
  )
}
