import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import UiaMark from '../ui/UiaMark'
import SideNav from './SideNav'
import { NAV_LINKS } from './navLinks'
import { NavLink } from 'react-router-dom'

export default function Header() {
  const [side, setSide] = useState(null)
  const { pathname } = useLocation()
  useEffect(() => { setSide(null) }, [pathname])
  const close = () => setSide(null)

  return (
    <>
    <header className="site-header fixed top-0 left-0 right-0 z-50">
      <div className="wrap h-full flex items-center justify-between" style={{ gap: 'var(--sp-3)' }}>
        <button type="button" className="icon-btn burger burger-left" onClick={() => setSide('left')} aria-label="왼쪽 메뉴 열기"><Menu size={22} /><span className="burger-label">메뉴</span></button>

        <Link to="/" className="flex items-center header-logo" style={{ color: 'var(--ink)' }} aria-label="UIA 특별관">
          <UiaMark className="" title="UIA" />
        </Link>

        <nav className="hidden xl:flex items-center site-nav" style={{ gap: 'clamp(1.2rem, 1.8vw, 2.6rem)' }}>
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className="t-label nav-link">{label}</NavLink>
          ))}
        </nav>

        <button type="button" className="icon-btn burger burger-right" onClick={() => setSide('right')} aria-label="오른쪽 메뉴 열기"><Menu size={22} /><span className="burger-label">메뉴</span></button>
      </div>
    </header>
    <SideNav side="left" open={side === 'left'} onClose={close} />
    <SideNav side="right" open={side === 'right'} onClose={close} />
    </>
  )
}
