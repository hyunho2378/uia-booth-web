import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { keepAwake } from '../../utils/wakeLock'
import { heroPhotos } from '../../data/photos'
import { asset } from '../../utils/asset'

const KEY = 'uia-kiosk'
const IDLE = 90 * 1000
const SHOTS = Object.values(heroPhotos)

// 스탠바이미 전시 화면용(주소 끝에 ?kiosk=1). 손가락으로만 쓰는 화면이라 아래에 항상 보이는 메뉴를 두고,
// 90초 동안 아무도 만지지 않으면 처음 화면으로 돌아가 사진이 돌아가는 시작 화면을 보여 준다.
export default function KioskGuard() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const [on, setOn] = useState(false)
  const [attract, setAttract] = useState(true)
  const [shot, setShot] = useState(0)

  useEffect(() => {
    let v = false
    try {
      if (new URLSearchParams(search).has('kiosk')) sessionStorage.setItem(KEY, '1')
      v = sessionStorage.getItem(KEY) === '1'
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
        setAttract(true)
      }, IDLE)
    }
    const ev = ['pointerdown', 'touchstart', 'keydown', 'scroll', 'wheel']
    ev.forEach((e) => window.addEventListener(e, arm, { passive: true }))
    arm()
    return () => { release(); clearTimeout(timer); ev.forEach((e) => window.removeEventListener(e, arm)); document.documentElement.classList.remove('kiosk-on') }
  }, [on, navigate])

  useEffect(() => {
    if (!attract || !SHOTS.length) return undefined
    const t = setInterval(() => setShot((s) => (s + 1) % SHOTS.length), 4500)
    return () => clearInterval(t)
  }, [attract])

  if (!on) return null
  return (
    <>
      {attract ? (
        <button type="button" className="kiosk-attract" onClick={() => { setAttract(false); window.scrollTo(0, 0) }} aria-label="시작하기">
          {SHOTS.map((s, i) => <img key={i} src={s} alt="" className={i === shot ? 'on' : ''} />)}
          <span className="kiosk-attract-shade" />
          <span className="kiosk-attract-body">
            <img className="kiosk-attract-logo" src={asset('/brand/uia-logo-official.svg')} alt="UIA" />
            <b>대학 임팩트 얼라이언스</b>
            <i>화면을 눌러 시작해 보세요</i>
          </span>
        </button>
      ) : null}
    </>
  )
}
