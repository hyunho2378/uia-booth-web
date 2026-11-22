import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { keepAwake } from '../../utils/wakeLock'

const KEY = 'uia-kiosk'
const IDLE = 90 * 1000

// 스탠바이미와 모니터에 띄우는 전시 화면용. 주소 끝에 ?kiosk=1을 붙여 한 번 열면 그 탭에서 계속 켜진다.
// 90초 동안 아무도 만지지 않으면 처음 화면으로 돌아가 다음 방문객이 이어서 보지 않게 한다.
export default function KioskGuard() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (new URLSearchParams(search).has('kiosk')) { try { sessionStorage.setItem(KEY, '1') } catch { /* 무시 */ } }
  }, [search])

  useEffect(() => {
    let on = false
    try { on = sessionStorage.getItem(KEY) === '1' } catch { /* 무시 */ }
    if (!on && !new URLSearchParams(search).has('kiosk')) return undefined
    document.documentElement.classList.add('kiosk-on')
    const release = keepAwake()
    let timer
    const arm = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (window.location.pathname.replace(/\/$/, '') !== (import.meta.env.BASE_URL || '/').replace(/\/$/, '')) navigate('/')
        window.scrollTo(0, 0)
      }, IDLE)
    }
    const ev = ['pointerdown', 'touchstart', 'keydown', 'scroll', 'wheel']
    ev.forEach((e) => window.addEventListener(e, arm, { passive: true }))
    arm()
    return () => { release(); clearTimeout(timer); ev.forEach((e) => window.removeEventListener(e, arm)); document.documentElement.classList.remove('kiosk-on') }
  }, [pathname, search, navigate])

  return null
}
