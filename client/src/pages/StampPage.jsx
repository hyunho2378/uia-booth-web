import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader'
import PageTransition from '../components/ui/PageTransition'

// NFC 스티커에는 https://사이트주소/stamp/<id> 를 넣는다. 찍으면 도장이 쌓인다.
export const stations = [
  { id: 'chuncheon', name: '춘천 임팩톤', to: '/projects?subject=chuncheon' },
  { id: 'sagape', name: '사회적가치 페스타', to: '/projects?subject=sagape' },
  { id: 'gyeongju', name: '경주 포럼', to: '/projects?subject=gyeongju' },
  { id: 'faces', name: 'UIA의 얼굴들', to: '/faces' },
  { id: 'annual', name: '애뉴얼 리포트', to: '/annual-report' },
  { id: 'videos', name: '활동 영상', to: '/videos' },
]

const KEY = 'uia-stamps'
const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] } }

export default function StampPage() {
  const { id } = useParams()
  const [got, setGot] = useState(read)

  useEffect(() => {
    document.title = 'Stamp — UIA 특별관'
    if (id && stations.some(s => s.id === id) && !read().includes(id)) {
      const next = [...read(), id]
      localStorage.setItem(KEY, JSON.stringify(next))
      setGot(next)
    }
  }, [id])

  const done = stations.every(s => got.includes(s.id))

  return (
    <PageTransition className="pt-10 pb-24">
      <PageHeader title="Stamp" subtitle={`${got.length} / ${stations.length}`} />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stations.map(s => {
          const on = got.includes(s.id)
          return (
            <Link
              key={s.id}
              to={s.to}
              className="flex items-center justify-center text-center p-6 font-body font-bold"
              style={{ aspectRatio: '1 / 1', borderRadius: '4px', background: on ? '#F5C518' : '#141414', color: on ? '#0a0a0a' : '#BABABA' }}
            >
              {s.name}
            </Link>
          )
        })}
      </div>
      {done && <p className="mt-10 text-xl font-bold text-accent font-body">모든 도장을 모았습니다</p>}
    </PageTransition>
  )
}
