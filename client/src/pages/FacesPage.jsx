import { useEffect } from 'react'
import PageHeader from '../components/ui/PageHeader'
import FadeIn from '../components/ui/FadeIn'
import PageTransition from '../components/ui/PageTransition'
import { faces } from '../data/faces'

const TOTAL = 14
const slots = [...faces, ...Array.from({ length: Math.max(0, TOTAL - faces.length) }, () => null)]

function Blank() {
  return <span className="text-xs text-text-muted font-ui uppercase tracking-widest">Coming Soon</span>
}

export default function FacesPage() {
  useEffect(() => { document.title = 'UIA의 얼굴들 — UIA 특별관' }, [])

  return (
    <PageTransition className="pt-10 pb-24">
      <PageHeader title="Faces" subtitle="UIA의 얼굴들. 내가 생각하는 UIA와 가장 인상 깊었던 경험" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slots.map((f, i) => (
          <FadeIn key={f ? f.name : `blank-${i}`} delay={(i % 2) * 80}>
            <article className="h-full flex flex-col gap-4 p-6" style={{ background: '#141414', borderRadius: '4px' }}>
              <div className="flex items-center gap-4">
                <div className="shrink-0 flex items-center justify-center" style={{ width: 88, height: 88, background: '#0a0a0a', borderRadius: '4px' }}>
                  {f?.photo ? <img src={f.photo} alt={f.name} className="w-full h-full object-cover" style={{ borderRadius: '4px' }} /> : <Blank />}
                </div>
                <header>
                  <h2 className="text-xl font-bold text-text-primary font-body">{f ? f.name : <Blank />}</h2>
                  {f && <p className="text-xs text-text-muted font-ui mt-1">{f.univ} {f.major}</p>}
                </header>
              </div>
              <section>
                <h3 className="text-xs font-bold text-accent font-ui tracking-wide mb-2">내가 생각하는 UIA</h3>
                {f?.uia ? <p className="text-sm text-text-primary font-body leading-relaxed whitespace-pre-line" style={{ wordBreak: 'keep-all' }}>{f.uia}</p> : <Blank />}
              </section>
              <section>
                <h3 className="text-xs font-bold text-accent font-ui tracking-wide mb-2">인상 깊었던 경험</h3>
                {f?.memory ? <p className="text-sm text-text-primary font-body leading-relaxed whitespace-pre-line" style={{ wordBreak: 'keep-all' }}>{f.memory}</p> : <Blank />}
              </section>
            </article>
          </FadeIn>
        ))}
      </div>
    </PageTransition>
  )
}
