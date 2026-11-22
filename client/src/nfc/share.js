// 저장과 공유. 폰에서는 공유 시트(이미지 저장, 메시지, 카카오톡)가 열리고, 시트가 없는 브라우저는 파일로 내려받는다.
async function toFile(dataUrl, filename) {
  const blob = await (await fetch(dataUrl)).blob()
  return new File([blob], filename, { type: blob.type || 'image/jpeg' })
}

export function siteUrl(path = '') {
  const base = window.location.origin + (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  return base + path
}

export async function saveImage(dataUrl, filename) {
  try {
    const file = await toFile(dataUrl, filename)
    if (navigator.canShare && navigator.canShare({ files: [file] }) && /iPhone|iPad|Android/i.test(navigator.userAgent)) {
      await navigator.share({ files: [file] })
      return 'shared'
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return 'cancel'
  }
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  return 'downloaded'
}

export async function shareImage(dataUrl, filename, text, url) {
  try {
    const file = await toFile(dataUrl, filename)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], text: url ? `${text}\n${url}` : text })
      return 'shared'
    }
    if (navigator.share) {
      await navigator.share({ text, url })
      return 'shared'
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return 'cancel'
  }
  if (url) {
    try { await navigator.clipboard.writeText(url); return 'copied' } catch { /* 복사 권한 없음 */ }
  }
  return 'none'
}

export async function shareLink(text, url) {
  try {
    if (navigator.share) { await navigator.share({ text, url }); return 'shared' }
  } catch (e) {
    if (e && e.name === 'AbortError') return 'cancel'
  }
  try { await navigator.clipboard.writeText(url); return 'copied' } catch { return 'none' }
}
