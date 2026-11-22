// 전시 화면이 꺼지거나 잠기지 않게 한다. 지원하지 않는 브라우저에서는 아무 일도 하지 않는다.
export function keepAwake() {
  let lock = null
  let stopped = false
  const get = async () => {
    try {
      if (stopped || !('wakeLock' in navigator) || document.hidden) return
      lock = await navigator.wakeLock.request('screen')
    } catch { /* 허용되지 않으면 무시 */ }
  }
  const onVis = () => { if (document.visibilityState === 'visible') get() }
  document.addEventListener('visibilitychange', onVis)
  get()
  return () => { stopped = true; document.removeEventListener('visibilitychange', onVis); try { lock && lock.release() } catch { /* 무시 */ } }
}
