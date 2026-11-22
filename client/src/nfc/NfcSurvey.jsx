import { useState } from 'react'
import { Screen, Card, Btn, BtnLink, Radio, Ko, vibrate } from './ui'
import CodeEntry from './CodeEntry'
import { CHOICES, WORD_Q, WORD_MAX } from './survey'
import { saveSurvey } from './db'
import { useVisitor } from './useVisitor'

const TOTAL = CHOICES.length + 1

export default function NfcSurvey() {
  const { status, visitor, id, attach, reload } = useVisitor()
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState([])
  const [words, setWords] = useState([''])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [saved, setSaved] = useState(null)
  const [again, setAgain] = useState(false)

  if (status === 'loading') return <Screen title="설문"><Card><p className="vg-body" style={{ marginTop: 0 }}>불러오는 중이에요.</p></Card></Screen>
  if (status === 'error') return <Screen title="설문"><Card><h1 className="vg-q" style={{ marginTop: 0 }}>연결이 원활하지 않아요</h1><p className="vg-body">인터넷 연결을 확인하고 휴대폰을 NFC에 다시 대 주세요.</p></Card></Screen>
  if (status === 'none') return <Screen title="설문"><CodeEntry onAttach={attach} /></Screen>

  const finished = saved || (visitor.quiz_at && !again)

  if (finished) {
    return (
      <Screen
        title="설문 완료"
        dock={<><BtnLink to="/words" prominent>워드클라우드 보기</BtnLink><Btn prominent={false} onClick={() => { setAgain(true); setSaved(null); setI(0); setAnswers([]); setWords(['']) }}>답변 다시 남기기</Btn></>}
      >
        <Card>
          <p className="vg-cap">{TOTAL} / {TOTAL}</p>
          <h1 className="vg-q"><Ko>{`${visitor.name}님, 답변이 전달됐어요`}</Ko></h1>
          <p className="vg-body"><Ko>남겨 주신 단어는 특별관 화면의 워드클라우드에 나타나요. 체험을 모두 마친 뒤 3번 NFC에 휴대폰을 대면 졸업증서를 받아요.</Ko></p>
          {saved && saved.length ? <div className="vg-chips">{saved.map((w) => <span key={w} className="vg-chip">{w}</span>)}</div> : null}
        </Card>
      </Screen>
    )
  }

  if (i < CHOICES.length) {
    const q = CHOICES[i]
    const picked = answers[i]
    const pick = (k) => { vibrate(8); setAnswers((a) => { const n = [...a]; n[i] = k; return n }) }
    return (
      <Screen
        title="설문"
        dock={<>
          <Btn disabled={picked === undefined} onClick={() => { vibrate(8); setI(i + 1) }}>다음</Btn>
          {i > 0 ? <Btn prominent={false} onClick={() => setI(i - 1)}>이전</Btn> : null}
        </>}
      >
        <Card key={i}>
          <p className="vg-cap">{i + 1} / {TOTAL}</p>
          <h1 className="vg-q"><Ko>{q.q}</Ko></h1>
          <ul className="vg-opts">
            {q.options.map((o, k) => (
              <li key={k}>
                <button type="button" className={'vg-opt' + (picked === k ? ' on' : '')} aria-pressed={picked === k} onClick={() => pick(k)}>
                  <Radio on={picked === k} />
                  <span><Ko>{o}</Ko></span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </Screen>
    )
  }

  const filled = words.map((w) => w.trim()).filter(Boolean)
  const setWord = (n) => (e) => setWords((w) => w.map((x, m) => (m === n ? e.target.value.slice(0, 12) : x)))
  const submit = async () => {
    if (!filled.length || busy) return
    setBusy(true); setErr('')
    try {
      const out = await saveSurvey(id, answers, filled)
      vibrate([12, 40, 12])
      setSaved(out)
      reload()
    } catch {
      setErr('답변을 저장하지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.')
    } finally { setBusy(false) }
  }

  return (
    <Screen
      title="설문"
      dock={<>
        <Btn disabled={!filled.length || busy} onClick={submit}>{busy ? '보내는 중' : '보내기'}</Btn>
        <Btn prominent={false} onClick={() => setI(i - 1)}>이전</Btn>
      </>}
    >
      <Card key="words">
        <p className="vg-cap">{TOTAL} / {TOTAL}</p>
        <h1 className="vg-q"><Ko>{WORD_Q}</Ko></h1>
        <p className="vg-body"><Ko>한 단어로 적어 주세요. 최대 3개까지 남길 수 있어요.</Ko></p>
        <div style={{ marginTop: 20, display: 'grid', gap: 12 }}>
          {words.map((w, n) => (
            <div key={n}>
              <input className="vg-input" value={w} onChange={setWord(n)} maxLength={12} placeholder={n === 0 ? '한 단어로' : '다른 단어'} aria-label={`단어 ${n + 1}`} />
              <p className="vg-count">{w.length} / 12</p>
            </div>
          ))}
        </div>
        {words.length < WORD_MAX ? (
          <p className="vg-note"><button type="button" onClick={() => setWords((w) => [...w, ''])} className="vg-link">단어 더 적기</button></p>
        ) : null}
        {err ? <p className="vg-err">{err}</p> : null}
        <p className="vg-note">이름은 단어와 함께 표시되지 않아요.</p>
      </Card>
    </Screen>
  )
}
