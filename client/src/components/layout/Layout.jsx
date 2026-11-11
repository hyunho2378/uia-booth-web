import { useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'

export default function Layout({ children }) {
  const { pathname } = useLocation()
  const full = pathname === '/'
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <ScrollToTop />
      <Header />
      <main className="flex-1" style={{ paddingTop: 'var(--header-h)' }}>
        {full ? children : <div className="wrap">{children}</div>}
      </main>
      <Footer />
    </div>
  )
}
