import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import UiaMark from '../ui/UiaMark'
import MobileMenu from './MobileMenu'
import { NAV_LINKS } from './navLinks'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: 'var(--header-h)',
        background: 'var(--glass)',
        backdropFilter: 'blur(22px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(22px) saturate(1.3)',
        boxShadow: 'var(--s1)',
      }}
    >
      <div className="wrap h-full flex items-center justify-between" style={{ gap: '2rem' }}>
        <Link to="/" className="flex items-center header-logo" style={{ color: 'var(--ink)' }} aria-label="UIA 특별관">
          <UiaMark className="" title="UIA" />
        </Link>

        <nav className="hidden xl:flex items-center" style={{ gap: 'clamp(1.2rem, 1.8vw, 2.6rem)' }}>
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className="t-label nav-link"
              style={({ isActive }) => ({
                color: isActive ? 'var(--ink)' : 'var(--mute)',
                transition: 'color .25s var(--ease)',
                whiteSpace: 'nowrap',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="xl:hidden tap burger" style={{ color: 'var(--ink)' }} onClick={() => setOpen(o => !o)} aria-label="메뉴">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <MobileMenu isOpen={open} onClose={() => setOpen(false)} />
    </header>
  )
}
