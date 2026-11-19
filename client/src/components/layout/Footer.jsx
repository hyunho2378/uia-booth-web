import { Link } from 'react-router-dom'
import { asset } from '../../utils/asset'
import { events } from '../../data/events'

const COLS = [
  { title: 'About', links: [{ to: '/', label: 'UIA 소개' }, { to: '/visit', label: '방문 안내' }] },
  { title: 'Activities', links: events.map((e) => ({ to: '/activities/' + e.id, label: e.ko })) },
  { title: 'Archive', links: [{ to: '/projects', label: '프로젝트' }, { to: '/photos', label: 'Photo' }, { to: '/people', label: '참여 학생' }] },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="sf-top">
          <div>
            <img src={asset('/brand/uia-logo-official.svg')} alt="UIA" className="sf-logo" />
            <p className="sf-caps">University Impact Alliance</p>
          </div>
          <a href="https://www.uia-impact.org" target="_blank" rel="noreferrer" className="t-label sf-official">uia-impact.org</a>
        </div>

        <div className="sf-cols">
          {COLS.map((c) => (
            <div key={c.title}>
              <p className="t-label sf-title">{c.title}</p>
              <ul>
                {c.links.map((l) => (
                  <li key={l.to}><Link to={l.to} className="sf-link">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="t-label sf-title">Expo</p>
            <ul>
              <li className="sf-text">제8회 대한민국 사회연대경제박람회</li>
              <li className="sf-text">2026년 11월 27일부터 29일까지</li>
              <li className="sf-text">고양 킨텍스</li>
            </ul>
          </div>
        </div>

        <div className="sf-info">
          <p><span>명칭</span> <b>대학 임팩트 얼라이언스 (UIA)</b> <span className="sf-sep">준비위원장</span> <b>신현상 (한양대학교 글로벌사회혁신단장)</b></p>
          <p><span>백본 조직</span> <b>루트임팩트</b> <span className="sf-sep">일반문의</span> <a href="mailto:contact@uia.or.kr"><b>contact@uia.or.kr</b></a></p>
          <p><span>웹사이트 제작</span> <b>주현호</b> <a href="mailto:h20222583@glab.hallym.ac.kr">h20222583@glab.hallym.ac.kr</a></p>
        </div>
        <p className="sf-copy">Copyright © University Impact Alliance. All rights reserved.</p>
      </div>
    </footer>
  )
}
