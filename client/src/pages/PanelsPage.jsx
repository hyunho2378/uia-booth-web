import { useEffect, useState } from 'react'
import PageHeader from '../components/ui/PageHeader'
import FadeIn from '../components/ui/FadeIn'
import PageTransition from '../components/ui/PageTransition'

const panels = [
  { id: 'chuncheon', name: '춘천 임팩톤', src: '/panels/panel-chuncheon.jpg' },
  { id: 'sagape', name: '사회적가치 페스타', src: '/panels/panel-sagape.jpg' },
  { id: 'gyeongju', name: '경주 포럼', src: '/panels/panel-gyeongju.jpg' },
  { id: 'intro', name: 'UIA 소개', src: null },
]

export default function PanelsPage() {
  const [open, setOpen] = useState(null)
  useEffect(() => { document.title = 'Panels — UIA 특별관' }, [])

  return (
    <PageTransition className="pt-10 pb-24">
      <PageHeader title="Panels" subtitle="부스에 설치되는 A1 판넬" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {panels.map((p, i) => (
          <FadeIn key={p.id} delay={i * 80}>
            <button
              onClick={() => p.src && setOpen(p)}
              className="w-full text-left flex flex-col gap-3 bg-transparent border-none p-0"
              style={{ cursor: p.src ? 'zoom-in' : 'default' }}
            >
              <div style={{ aspectRatio: '1 / 1.414', background: '#141414', borderRadius: '4px', overflow: 'hidden' }}>
                {p.src ? (
                  <img src={p.src} alt={p.name} loading="lazy" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs text-text-muted font-ui uppercase tracking-widest">Coming Soon</span>
                  </div>
                )}
              </div>
              <span className="text-sm font-bold text-text-primary font-ui">{p.name}</span>
            </button>
          </FadeIn>
        ))}
      </div>

      {open && (
        <div
          onClick={() => setOpen(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,10,10,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}
        >
          <img src={open.src} alt={open.name} style={{ maxWidth: '95vw', maxHeight: '95vh', objectFit: 'contain' }} />
        </div>
      )}
    </PageTransition>
  )
}
