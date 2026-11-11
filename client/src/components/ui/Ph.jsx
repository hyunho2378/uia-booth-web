// 구절 단위 줄바꿈: "/" 로 나눈 구절을 inline-block 으로 묶어 구절 사이에서만 줄이 바뀐다.
export default function Ph({ text }) {
  if (!text.includes('/')) return text
  return text.split('/').map((p, i, a) => (
    <span key={i}>
      <span className="ph">{p}</span>
      {i < a.length - 1 ? ' ' : ''}
    </span>
  ))
}
