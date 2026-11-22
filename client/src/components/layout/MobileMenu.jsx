import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { NAV_LINKS } from './navLinks'

// 세로 화면과 좁은 화면에서 햄버거로 여는 전체 화면 메뉴.
// 헤더 아래 화면 전체를 덮고, 열려 있는 동안 뒤 화면은 스크롤되지 않는다.
export default function MobileMenu({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [isOpen, onClose])

  return (
    <div
      className="xl:hidden mobile-menu"
      data-open={isOpen}
      aria-hidden={!isOpen}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <nav className="wrap mobile-menu-nav" aria-label="주 메뉴">
        {NAV_LINKS.map(({ to, label, end }, i) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            tabIndex={isOpen ? 0 : -1}
            className="mobile-menu-link"
            style={({ isActive }) => ({ color: isActive ? 'var(--ink)' : 'var(--ink-2)', '--i': i })}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
