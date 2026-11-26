import { Link } from 'react-router-dom'

// 사이트의 모든 버튼은 .btn 한 규격. primary는 어두운 바탕, 나머지는 흰 바탕.
export default function Button({ variant = 'primary', onClick, href, to, children, disabled, className = '' }) {
  const base = `btn${variant === 'primary' ? ' is-on' : ''} ${className}`.trim()

  if (to) return <Link to={to} className={base}>{children}</Link>
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={base}>{children}</a>
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={base}>
      {children}
    </button>
  )
}
