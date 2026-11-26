// UIA 공식 사이트의 4C 전략. 영어 이름은 공식 표기, 영어 설명은 한국어 공식 문구를 옮긴 것이다.
const ITEMS = [
  {
    n: '01', name: 'Connecting', color: '#2d9ed9',
    en: 'We connect universities, students, professors and local communities.',
    ko: '대학과 대학 그리고 학생과 학생 교수와 지역사회를 연결합니다.',
  },
  {
    n: '02', name: 'Co-Learning', color: '#fdc51b',
    en: 'Members from different majors and campuses learn together at the site of a social problem.',
    ko: '다양한 전공과 대학의 구성원이 사회문제 현장에서 함께 배웁니다.',
  },
  {
    n: '03', name: 'Co-Creating', color: '#e94545',
    en: 'University knowledge and field expertise come together to create new solutions.',
    ko: '대학의 지식과 현장의 전문성으로 새로운 해결책을 함께 만듭니다.',
  },
  {
    n: '04', name: 'Collective Impact', color: '#c4c2c1',
    en: 'Knowledge and solutions spread to communities and society as collective impact.',
    ko: '지식과 해결책을 지역과 사회로 확산해 집합적 임팩트를 만듭니다.',
  },
]

export default function FourC() {
  return (
    <section className="wrap fourc" aria-labelledby="fourc-title" style={{ paddingBlock: 'clamp(2rem, 3.6vw, 4.6rem)' }}>
      <div className="two fourc-grid">
        <div className="fourc-stage" aria-hidden="true">
          {ITEMS.map((c) => (
            <div className="orb" key={c.name} style={{ '--c': c.color }}>
              <span>{c.name === 'Collective Impact' ? <>Collective<br />Impact</> : c.name}</span>
            </div>
          ))}
        </div>

        <div className="fourc-copy">
          <h2 id="fourc-title" className="t-h1">UIA's 4C Strategy</h2>
          <ol className="fourc-list">
            {ITEMS.map((c) => (
              <li key={c.name} className="fourc-row">
                <span className="fourc-n t-label">{c.n}</span>
                <span className="fourc-body">
                  <span className="fourc-name t-h2">{c.name}</span>
                  <span className="fourc-en t-lead">{c.en}</span>
                  <span className="fourc-ko t-ko">{c.ko}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
