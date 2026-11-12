import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Ph from '../ui/Ph'
import { stats, events, notices, programs } from '../../data/events'
import { works } from '../../data/works'
import { faces } from '../../data/faces'

const SECTION = { paddingBlock: 'clamp(3rem, 6vw, 8rem)' }

export function SectionHead({ en, ko, body, bodyKo, to, toLabel }) {
  return (
    <div className="two" style={{ marginBottom: 'clamp(2rem, 3.4vw, 4.4rem)', alignItems: 'end' }}>
      <div>
        <h2 className="t-h1">{en}</h2>
        {ko && <p className="t-ko-lg" style={{ marginTop: '.6rem' }}>{ko}</p>}
      </div>
      <div style={{ maxWidth: '44rem' }}>
        {body && <p className="t-lead" style={{ color: 'var(--ink-2)' }}>{body}</p>}
        {bodyKo && <p className="t-ko" style={{ marginTop: '.5rem' }}>{bodyKo}</p>}
        {to && (
          <Link to={to} className="more-link t-label" style={{ marginTop: '1.2rem' }}>{toLabel}<ArrowUpRight size={20} /></Link>
        )}
      </div>
    </div>
  )
}

// 숫자 네 개
export function StatsBand() {
  return (
    <section className="wrap" style={{ paddingBlock: 'clamp(1rem, 2vw, 3rem) clamp(3rem, 6vw, 8rem)' }}>
      <ul className="stats">
        {stats.map((s) => (
          <li key={s.en}>
            <p className="stat-n">{s.n}</p>
            <p className="t-label" style={{ color: 'var(--ink)', marginTop: '.5rem' }}>{s.en}</p>
            <p className="t-ko" style={{ fontSize: '.95rem' }}>{s.ko}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

// 2026년 활동 네 줄
export function TimelineRows() {
  return (
    <section className="wrap" style={SECTION}>
      <SectionHead en="2026 Activities" ko="2026년 활동" body="Four places where students worked, from Chuncheon to Goyang." bodyKo="춘천에서 고양까지, 학생들이 일한 네 곳입니다." to="/activities" toLabel="All activities 활동 전체 보기" />
      <ul>
        {events.map((e) => (
          <li key={e.id}>
            <Link to={'/activities/' + e.id} className="tl-row two">
              <span>
                <span className="t-h2" style={{ display: 'block' }}>{e.dateEn}</span>
                <span className="t-ko" style={{ display: 'block' }}>{e.dateKo}</span>
              </span>
              <span className="tl-main">
                <span>
                  <span className="t-h2" style={{ display: 'block' }}>{e.en}</span>
                  <span className="t-ko" style={{ display: 'block' }}>{e.ko}, {e.placeKo}</span>
                </span>
                <ArrowUpRight size={28} className="tl-arrow" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

// 수상작 네 점
export function FeaturedProjects() {
  const picks = ['cc-soyang', 'cc-bomnaerun', 'cc-volumeup', 'cc-salon'].map((id) => works.find((w) => w.id === id)).filter(Boolean)
  return (
    <section className="wrap" style={SECTION}>
      <SectionHead en="Impactthon results" ko="임팩톤 수상작" body="Ideas that ten teams made in Chuncheon in three days. These four were chosen as the best." bodyKo="10개 조가 사흘 동안 춘천에서 만든 제안 가운데 수상한 네 점입니다." to="/projects?subject=chuncheon" toLabel="All projects 활동 포스터 전체 보기" />
      <ul className="poster-row">
        {picks.map((w) => (
          <li key={w.id}>
            <Link to={'/projects/' + w.id} className="poster-link">
              <span className="poster-img"><img src={w.pages[0]} alt={w.title} loading="lazy" decoding="async" /></span>
              <span className="t-h3" style={{ display: 'block', marginTop: '1rem' }}>{w.awardLabel}</span>
              <span className="t-ko" style={{ display: 'block' }}>{w.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

// 학생 목소리
function firstLines(text = '', max = 130) {
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  const end = Math.max(cut.lastIndexOf('다.'), cut.lastIndexOf('요.'), cut.lastIndexOf('. '))
  return end > 40 ? cut.slice(0, end + 1) : cut
}

export function Voices() {
  const picks = faces.map((f, i) => ({ f, i })).filter(({ f }) => f.uia).slice(0, 3)
  return (
    <section className="wrap" style={SECTION}>
      <SectionHead en="In their words" ko="참여 학생의 말" body="What UIA means to the students who were there." bodyKo="현장에 있었던 학생들이 생각하는 UIA입니다." to="/people" toLabel="All students 참여 학생 보기" />
      <ul className="voices">
        {picks.map(({ f, i }) => (
          <li key={f.name}>
            <Link to={'/people/' + (i + 1)} className="voice">
              <span className="voice-q">{firstLines(f.uia)}</span>
              <span className="t-label" style={{ color: 'var(--ink)', display: 'block', marginTop: '1.4rem' }}>{f.name}</span>
              <span className="t-ko" style={{ display: 'block', fontSize: '.95rem' }}>{f.univ} {f.major}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

// UIA 활동 영역
export function Programs() {
  return (
    <section className="wrap" style={SECTION}>
      <SectionHead en="What UIA does" ko="UIA가 하는 일" body="Activities follow the 4C strategy: connect universities, learn together at the site, create together, and spread the result." bodyKo="활동은 4C 전략 위에서 설계됩니다. 대학을 잇고, 현장에서 함께 배우고, 함께 만들고, 그 결과를 확산합니다." />
      <ul className="programs">
        {programs.map((p) => (
          <li key={p.en}>
            <h3 className="t-h3">{p.en}</h3>
            <p className="t-ko-lg" style={{ fontSize: 'clamp(1.1rem, 1.4vw, 2rem)', marginBottom: '.8rem' }}>{p.ko}</p>
            <p className="t-body" style={{ color: 'var(--ink)' }}>{p.bodyEn}</p>
            <p className="t-ko" style={{ marginTop: '.3rem', fontSize: '1rem' }}>{p.bodyKo}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

// 공지
export function Notices() {
  return (
    <section className="wrap" style={SECTION}>
      <SectionHead en="UIA news" ko="UIA 공지사항" body="Notices from the official UIA website." bodyKo="UIA 공식 사이트에 올라온 공지입니다." />
      <ul>
        {notices.map((n) => (
          <li key={n.url}>
            <a href={n.url} target="_blank" rel="noreferrer" className="tl-row two">
              <span className="t-ko-lg">{n.date}</span>
              <span className="tl-main">
                <span className="t-h3">{n.title}</span>
                <ArrowUpRight size={26} className="tl-arrow" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

// 특별관 안내 띠
export function VisitBand() {
  return (
    <section className="wrap" style={{ paddingBlock: 'clamp(2rem, 4vw, 5rem) clamp(5rem, 10vw, 12rem)' }}>
      <Link to="/visit" className="visit-band">
        <span>
          <span className="t-display" style={{ display: 'block', fontSize: 'clamp(2.4rem, 5vw, 7.4rem)' }}><Ph text="Visit the/Special Hall" /></span>
          <span className="t-ko-lg" style={{ display: 'block', marginTop: '.8rem', color: 'rgba(33,33,32,.72)' }}>특별관 찾아오기</span>
        </span>
        <span className="visit-info">
          <span className="t-h2" style={{ display: 'block' }}><Ph text="November 27 to 29,/KINTEX, Goyang" /></span>
          <span className="t-ko" style={{ display: 'block', color: 'rgba(33,33,32,.72)' }}>11월 27일부터 29일까지, 고양 킨텍스</span>
          <ArrowUpRight size={40} className="visit-arrow" />
        </span>
      </Link>
    </section>
  )
}
