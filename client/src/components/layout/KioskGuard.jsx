import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { keepAwake } from '../../utils/wakeLock'

const KEY = 'uia-kiosk'
const IDLE = 90 * 1000
const DEFAULT_HOSTS = ['uia-booth.vercel.app']

// 스탠바이미 전시 화면용(주소 끝에 ?kiosk=1). 열면 바로 홈이 보이고,
// 90초 동안 아무도 만지지 않으면 다음 방문객이 이어 보지 않게 홈으로 돌아간다.
export default function KioskGuard() {
  const { search } = useLocation()
  const navigate = useNavigate()
  const [on, setOn] = useState(false)

  useEffect(() => {
    let v = false
    // 전시 모드 결정. 창을 닫았다 다시 열어도 유지되도록 localStorage에 기억한다.
    // ?kiosk=1 로 켜고 ?kiosk=0 으로 끈다. 아무 표시가 없으면 베르셀 주소를 폭 900px 이상 화면(스탠바이미와 모니터)에서 열 때 자동으로 켠다.
    try {
      const q = new URLSearchParams(search)
      if (q.get('kiosk') === '0') localStorage.setItem(KEY, '0')
      else if (q.has('kiosk')) localStorage.setItem(KEY, '1')
      const saved = localStorage.getItem(KEY)
      if (saved === '1') v = true
      else if (saved === '0') v = false
      else v = DEFAULT_HOSTS.includes(window.location.hostname) && window.innerWidth >= 900
    } catch { /* 무시 */ }
    setOn(v)
  }, [search])

  useEffect(() => {
    if (!on) return undefined
    document.documentElement.classList.add('kiosk-on')
    const release = keepAwake()
    let timer
    const arm = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        navigate('/')
        window.scrollTo(0, 0)
      }, IDLE)
    }
    const ev = ['pointerdown', 'touchstart', 'keydown', 'scroll', 'wheel']
    ev.forEach((e) => window.addEventListener(e, arm, { passive: true }))
    arm()
    return () => { release(); clearTimeout(timer); ev.forEach((e) => window.removeEventListener(e, arm)); document.documentElement.classList.remove('kiosk-on') }
  }, [on, navigate])

  return null
}
