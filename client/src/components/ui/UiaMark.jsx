// UIA 공식 사이트 로고의 획 모양을 단색(currentColor)으로 옮긴 마크. 세 글자가 같은 획 두께로 보이게 한다.
export default function UiaMark({ className = '', title = 'UIA', height = '1.9rem' }) {
  return (
    <svg className={className} style={{ height, width: 'auto', aspectRatio: '288 / 132', flex: 'none' }} viewBox="0 0 288 132" role="img" aria-label={title} fill="none" stroke="currentColor" strokeWidth="30" strokeLinecap="round">
      <path d="M45 45 V82 A30 30 0 0 0 75 112" />
      <path d="M75 112 A30 30 0 0 0 105 82 V45" />
      <path d="M150 45 V112" />
      <circle cx="218" cy="82" r="30" />
      <path d="M248 47 V112" />
      <g fill="currentColor" stroke="none">
        <circle cx="45" cy="45" r="15" /><circle cx="105" cy="45" r="15" /><circle cx="75" cy="112" r="15" />
        <circle cx="150" cy="16" r="14" /><circle cx="150" cy="112" r="15" />
        <circle cx="188" cy="82" r="14" /><circle cx="248" cy="47" r="14" /><circle cx="248" cy="112" r="15" />
      </g>
    </svg>
  )
}
