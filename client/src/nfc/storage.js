const KEY = 'uia-nfc-visitor'

export function loadVisitor() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null') } catch { return null }
}

export function saveVisitor(v) {
  try { localStorage.setItem(KEY, JSON.stringify(v)) } catch { /* 저장 공간이 막힌 브라우저는 코드로 이어간다 */ }
}

export function clearVisitor() {
  try { localStorage.removeItem(KEY) } catch { /* 무시 */ }
}
