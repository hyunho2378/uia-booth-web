import { NavLink } from 'react-router-dom'
import { NAV_LINKS } from './navLinks'

export default function MobileMenu({ isOpen, onClose, theme, onToggleTheme }) {
  return (
    <div
      className="xl:hidden"
      style={{
        position: 'absolute', left: 0, right: 0, top: '100%',
        background: 'var(--bg)', boxShadow: isOpen ? 'var(--s2)' : 'none',
        opacity: isOpen ? 1 : 0, transform: isOpen ? 'none' : 'translateY(-8px)',
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: 'opacity .3s var(--ease), transform .3s var(--ease)',
      }}
    >
      <nav className="wrap flex flex-col" style={{ paddingBlock: '1rem 1.6rem' }}>
        {NAV_LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className="t-h3"
            style={({ isActive }) => ({ color: isActive ? 'var(--ink)' : 'var(--mute)', paddingBlock: '.55rem' })}
          >
            {label}
          </NavLink>
        ))}
        <button type="button" onClick={onToggleTheme} className="t-label" style={{ color: 'var(--mute)', textAlign: 'left', paddingBlock: '.9rem' }}>
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </nav>
    </div>
  )
}
