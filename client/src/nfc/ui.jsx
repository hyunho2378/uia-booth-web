import { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { asset } from '../utils/asset'
import { koLines } from './ko'
import './nfc.css'

export function Ko({ children }) {
  return koLines(children).map((l, i) => <Fragment key={i}>{i > 0 ? <br /> : null}{l}</Fragment>)
}

// 볼트업 라이브 청중 화면과 같은 구성: 번지는 배경 위에 글래스 카드 하나, 아래에 캡슐 버튼.
export function Screen({ title, children, dock, wide = false }) {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = (title ? title + ' | ' : '') + 'UIA 대학교'
  }, [title])
  return (
    <div className="vg-root" style={{ '--vg-bg': `url(${asset('/nfc/bg-vote.webp')})` }}>
      <div className={'vg-col' + (wide ? ' vg-wide' : '')}>
        {children}
      </div>
      {dock ? <div className={'vg-dock' + (wide ? ' vg-wide' : '')}>{dock}</div> : null}
    </div>
  )
}

export function Card({ children, className = '', logo = false }) {
  return (
    <section className={'vg-card enter ' + className}>
      {logo ? <img className="vg-logo-in" src={asset('/brand/uia-logo-official.svg')} alt="UIA" /> : null}
      {children}
    </section>
  )
}

export function Btn({ children, prominent = true, ...rest }) {
  return <button type="button" className={'vg-btn' + (prominent ? ' vg-btn-prominent' : '')} {...rest}>{children}</button>
}

export function BtnLink({ to, href, children, prominent = false, ...rest }) {
  const cls = 'vg-btn' + (prominent ? ' vg-btn-prominent' : '')
  return to ? <Link to={to} className={cls} {...rest}>{children}</Link> : <a href={href} className={cls} {...rest}>{children}</a>
}

export function Radio({ on }) {
  return <span className={'vg-radio' + (on ? ' on' : '')} aria-hidden="true"><i /></span>
}

export function vibrate(ms) {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') navigator.vibrate(ms)
}

import { useCallback, useRef, useState } from 'react'
export function useToast() {
  const [msg, setMsg] = useState('')
  const t = useRef(null)
  const show = useCallback((m) => {
    setMsg(m)
    clearTimeout(t.current)
    t.current = setTimeout(() => setMsg(''), 2200)
  }, [])
  return [msg ? <div className="vg-toast" role="status">{msg}</div> : null, show]
}
