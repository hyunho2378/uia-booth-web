import { useEffect } from 'react'
import PageHeader from '../components/ui/PageHeader'
import FadeIn from '../components/ui/FadeIn'
import PageTransition from '../components/ui/PageTransition'

// 영상이 도착하면 src 에 파일 경로를 넣는다 (public/videos/...)
const videos = [
  { id: 'sagape', name: '사회적가치 페스타', src: null },
  { id: 'gyeongju', name: '경주 포럼', src: null },
  { id: 'interview', name: '학생 인터뷰', src: null },
]

export default function VideosPage() {
  useEffect(() => { document.title = 'Videos — UIA 특별관' }, [])

  return (
    <PageTransition className="pt-10 pb-24">
      <PageHeader title="Videos" subtitle="UIA 활동 영상" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videos.map((v, i) => (
          <FadeIn key={v.id} delay={i * 80}>
            <div className="flex flex-col gap-3">
              <div style={{ aspectRatio: '16 / 9', background: '#141414', borderRadius: '4px', overflow: 'hidden' }}>
                {v.src ? (
                  <video src={v.src} controls playsInline className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs text-text-muted font-ui uppercase tracking-widest">Coming Soon</span>
                  </div>
                )}
              </div>
              <span className="text-sm font-bold text-text-primary font-ui">{v.name}</span>
            </div>
          </FadeIn>
        ))}
      </div>
    </PageTransition>
  )
}
