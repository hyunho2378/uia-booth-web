import { useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import KioskGuard from './KioskGuard'

export default function Layout({ children }) {
  const { pathname, search } = useLocation()
  const full = pathname === '/'
  // 스탠바이미와 모니터에 띄우는 전체 화면 모드: /words?screen=1
  const bare = pathname.replace(/\/$/, '') === '/words' && new URLSearchParams(search).has('screen')
  if (bare) return <div className="words-bare">{children}</div>
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <ScrollToTop />
      <KioskGuard />
      <Header />
      <main className="flex-1" style={{ paddingTop: 'var(--header-h)' }}>
        {full ? children : <div className="wrap">{children}</div>}
      </main>
      <Footer />
    </div>
  )
}
