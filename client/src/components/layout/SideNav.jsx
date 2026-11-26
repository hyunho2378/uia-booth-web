import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'
import { NAV_LINKS } from './navLinks'

// 왼쪽이나 오른쪽 위 햄버거로 여는 옆 메뉴. 스탠바이미를 어느 쪽 손으로 잡아도 닿도록 양쪽에 둔다.
export default function SideNav({ side, open, onClose }) {
  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [open, onClose])

  return (
    <div className={'sidenav sidenav-' + side} data-open={open} aria-hidden={!open}>
      <button type="button" className="sidenav-scrim" onClick={onClose} tabIndex={-1} aria-label="메뉴 닫기" />
      <nav className="sidenav-panel" aria-label="주 메뉴">
        <button type="button" className="icon-btn sidenav-close" onClick={onClose} aria-label="닫기" tabIndex={open ? 0 : -1}><X size={22} /></button>
        <ul>
          {NAV_LINKS.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} onClick={onClose} tabIndex={open ? 0 : -1} className={({ isActive }) => 'sidenav-link' + (isActive ? ' is-on' : '')}>{label}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
