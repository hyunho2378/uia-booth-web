import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'

const SEE = [
  { en: 'Activity posters', ko: '활동 포스터', body: 'Results from Chuncheon, the Social Value Festa and Gyeongju.', bodyKo: '춘천, 사회적가치 페스타, 경주의 활동 결과입니다.', to: '/projects' },
  { en: 'Field photos', ko: '현장 사진', body: 'Photos taken by students at each site.', bodyKo: '학생들이 현장에서 찍은 사진입니다.', to: '/photos' },
  { en: 'Student voices', ko: '참여 학생의 말', body: 'What UIA means to the students who were there.', bodyKo: '현장에 있었던 학생들이 생각하는 UIA입니다.', to: '/people' },
  { en: 'Interactive exhibit', ko: '체험 전시', body: 'Coming Soon', bodyKo: '준비하고 있습니다.', to: null },
]

export default function VisitPage() {
  useEffect(() => { document.title = 'Visit | UIA 특별관' }, [])
  return (
    <div style={{ paddingBottom: 'clamp(4rem, 8vw, 10rem)' }}>
      <PageHeader title="Visit" ko="특별관 찾아오기" subtitle="2026 사회연대경제박람회 UIA 특별관 안내입니다." />

      <div className="visit-hero">
        <p className="t-display" style={{ fontSize: 'clamp(2.4rem, 5.2vw, 8rem)' }}>November 27 to 29</p>
        <p className="t-ko-lg" style={{ color: 'rgba(33,33,32,.72)', marginTop: '.5rem' }}>2026년 11월 27일부터 29일까지</p>
        <p className="t-h2" style={{ marginTop: '2rem' }}>The 8th Social Solidarity Economy Expo, UIA Special Hall</p>
        <p className="t-ko-lg" style={{ color: 'rgba(33,33,32,.72)' }}>제8회 대한민국 사회연대경제박람회 UIA 특별관</p>
        <p className="t-lead" style={{ marginTop: '2rem', fontWeight: 700 }}>KINTEX, Goyang</p>
        <p className="t-ko" style={{ color: 'rgba(33,33,32,.72)' }}>고양 킨텍스</p>
      </div>

      <div className="two" style={{ paddingBlock: 'clamp(3rem, 6vw, 8rem) clamp(1.4rem, 2.4vw, 3rem)' }}>
        <h2 className="t-h1">What you can see</h2>
        <div />
      </div>
      <ul className="see-list">
        {SEE.map((s) => {
          const inner = (
            <>
              <span className="t-h2" style={{ display: 'block' }}>{s.en}</span>
              <span className="t-ko-lg" style={{ display: 'block', fontSize: 'clamp(1.1rem, 1.5vw, 2.2rem)' }}>{s.ko}</span>
              <span className="t-body" style={{ display: 'block', marginTop: '.8rem', color: 'var(--ink)' }}>{s.body}</span>
              <span className="t-ko" style={{ display: 'block', fontSize: '1rem' }}>{s.bodyKo}</span>
              {s.to && <span className="more-link t-label" style={{ marginTop: '1rem' }}>Open 보기<ArrowUpRight size={20} /></span>}
            </>
          )
          return <li key={s.en}>{s.to ? <Link to={s.to} className="see-item">{inner}</Link> : <div className="see-item see-soon">{inner}</div>}</li>
        })}
      </ul>

      <div className="two" style={{ paddingBlock: 'clamp(3rem, 6vw, 8rem) 0' }}>
        <h2 className="t-h1">Getting there</h2>
        <div style={{ maxWidth: '44rem' }}>
          <p className="t-lead" style={{ color: 'var(--ink-2)' }}>KINTEX is in Goyang, Gyeonggi. Open the map to plan your trip.</p>
          <p className="t-ko" style={{ marginTop: '.5rem' }}>경기도 고양시에 있는 킨텍스입니다. 지도에서 가는 길을 확인하세요.</p>
          <div className="link-pair">
            <a href="https://map.naver.com/p/search/%ED%82%A8%ED%85%8D%EC%8A%A4" target="_blank" rel="noreferrer" className="more-link t-label">Naver Map 네이버 지도<ArrowUpRight size={20} /></a>
            <a href="https://www.google.com/maps/search/?api=1&query=KINTEX%20Goyang" target="_blank" rel="noreferrer" className="more-link t-label">Google Maps 구글 지도<ArrowUpRight size={20} /></a>
          </div>
          <p className="t-h3" style={{ marginTop: '2.4rem' }}>Hall map and program</p>
          <p className="t-ko">Coming Soon, 전시 배치도와 프로그램을 준비하고 있습니다.</p>
        </div>
      </div>
    </div>
  )
}
