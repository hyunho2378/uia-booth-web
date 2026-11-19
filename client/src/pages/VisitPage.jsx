import { useEffect, useState } from 'react'
import PageHeader from '../components/ui/PageHeader'
import { asset } from '../utils/asset'

const TABS = [
  { id: 'way', label: '오시는 길' },
  { id: 'plan', label: '행사장 배치도' },
]

const ROUTES = [
  { t: '지하철 3호선', d: '대화역 1번 또는 2번 출구로 나와 킨텍스 제1전시장까지 걸어갑니다. 대화역 2번 출구 정류장에서 마을버스 058번도 탈 수 있습니다.' },
  { t: 'GTX-A', d: '킨텍스역 1번 출구로 나오면 제1전시장이 바로 보입니다.' },
  { t: '버스', d: '대화역 5번 출구 정류장에서 마을버스 039번, 082번, 089번을 탑니다. 서울역과 광화문, 신촌에서는 1000번, 2000번, M7106번이 있습니다.' },
]

export default function VisitPage() {
  const [tab, setTab] = useState('way')
  useEffect(() => { document.title = 'Visit | UIA' }, [])

  return (
    <div className="visit" style={{ paddingBottom: 'clamp(3rem, 6vw, 7rem)' }}>
      <PageHeader title="Visit" />

      <p className="t-lead visit-lead">2026년 11월 27일 금요일부터 29일 일요일까지, 킨텍스 제1전시장 5홀</p>

      <div className="visit-tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className="t-h3" data-on={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {tab === 'way' && (
        <section className="visit-pane">
          <div className="visit-map">
            <iframe
              title="킨텍스 제1전시장 지도"
              src="https://www.openstreetmap.org/export/embed.html?bbox=126.7339%2C37.6659%2C126.7579%2C37.6729&layer=mapnik&marker=37.6694%2C126.7459"
              loading="lazy"
            />
          </div>
          <div className="visit-info">
            <p className="t-lead">경기도 고양시 일산서구 킨텍스로 217-60</p>
            <div className="link-pair">
              <a href="https://map.naver.com/p/search/%ED%82%A8%ED%85%8D%EC%8A%A4%20%EC%A0%9C1%EC%A0%84%EC%8B%9C%EC%9E%A5" target="_blank" rel="noreferrer" className="t-label">네이버 지도에서 열기</a>
              <a href="https://www.google.com/maps/search/?api=1&query=KINTEX%201%20Goyang" target="_blank" rel="noreferrer" className="t-label">구글 지도에서 열기</a>
            </div>
            <dl className="visit-routes">
              {ROUTES.map((r) => (
                <div key={r.t}>
                  <dt className="t-h3">{r.t}</dt>
                  <dd className="t-ko">{r.d}</dd>
                </div>
              ))}
            </dl>
            <p className="t-ko">관람 시간은 오전 10시부터 오후 6시까지이고 입장은 무료입니다. 온라인 사전등록 뒤 당일 QR 코드로 입장하며 현장 등록도 가능합니다.</p>
          </div>
        </section>
      )}

      {tab === 'plan' && (
        <section className="visit-pane">
          <div className="visit-plan">
            <img src={asset('/brand/expo-floor.webp')} alt="박람회장 전체 배치도. UIA 특별관은 소셜플레이존 안, 출구 바로 왼쪽에 있습니다." decoding="async" />
            <span className="visit-plan-mark" aria-hidden="true" />
          </div>
          <p className="t-lead visit-plan-note">UIA 특별관은 소셜플레이존 안, 출구 바로 왼쪽에 있습니다.</p>
        </section>
      )}
    </div>
  )
}
