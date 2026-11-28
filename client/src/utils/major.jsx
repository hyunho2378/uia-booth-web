// 전공 이름이 줄 끝에서 '전'과 '공'처럼 갈라지지 않게 한다.
// 띄어쓰기와 '·', '/' 뒤에서만 줄을 바꾸고, 그 사이 덩어리는 절대 쪼개지 않는다.
const HINT = { '미디어영상광고홍보계열': '미디어영상 광고홍보계열' }
export const majorParts = (s) => {
  const t = String(s || '').trim()
  return (HINT[t] || t).replace(/([·/])\s*/g, '$1 ').split(/\s+/).filter(Boolean)
}
export function MajorText({ text }) {
  const parts = majorParts(text)
  return parts.map((p, i) => <span key={i}><span className="nw">{p}</span>{i < parts.length - 1 ? ' ' : ''}</span>)
}
