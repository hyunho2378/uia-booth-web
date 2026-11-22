// 한국어 줄바꿈 보정. 한 글자 관형사가 다음 어절과 떨어지지 않게 붙이고, " / " 자리에서 줄을 나눈다.
const GLUE = ['한', '두', '세', '네', '첫', '새', '그', '이', '저', '온', '각', '매', '여러', '모든', '어느', '무슨', '어떤', '다른', '같은']
const RE = new RegExp(`(^|\\s)(${GLUE.join('|')})\\s+`, 'g')
export const koGlue = (t) => String(t ?? '').replace(RE, (_, pre, w) => `${pre}${w}\u00a0`)
export const koLines = (t) => String(t ?? '').split(' / ').map(koGlue)
