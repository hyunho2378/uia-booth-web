import { useState } from 'react'
import { Screen, Card, Btn, BtnLink, Ko, vibrate } from './ui'
import CodeEntry from './CodeEntry'
import { QUESTIONS, WORD_MAX, WORD_LEN } from './survey'
import { saveSurvey } from './db'
import { useVisitor } from './useVisitor'

const TOTAL = QUESTIONS.length
const empty = () => QUESTIONS.map(() => [''])

export default function NfcSurvey() {
  const { status, visitor, id, attach, reload, reset } = useVisitor()
  const [i, setI] = useState(0)
  const [words, setWords] = useState(empty)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [saved, setSaved] = useState(null)
  const [again, setAgain] = useState(false)

  if (status === 'loading') return <Screen title="질문"><Card><p className="vg-body" style={{ marginTop: 0 }}>불러오는 중이에요.</p></Card></Screen>
  if (status === 'error') return <Screen title="질문" dock={<Btn onClick={() => window.location.reload()}>다시 시도</Btn>}><Card><h1 className="vg-q" style={{ marginTop: 0 }}>연결이 원활하지 않아요</h1><p className="vg-body">인터넷 연결을 확인한 뒤 다시 시도해 주세요.</p></Card></Screen>
  if (status === 'none') return <Screen title="질문"><CodeEntry onAttach={attach} /></Screen>

  const finished = saved || (visitor.quiz_at && !again)

  if (finished) {
    const shown = saved ? Object.keys(saved).sort().flatMap((k) => saved[k]) : []
    return (
      <Screen
        title="질문 완료"
        dock={<><BtnLink to="/words" prominent>워드클라우드 보기</BtnLink><Btn prominent={false} onClick={() => { setAgain(true); setSaved(null); setI(0); setWords(empty()) }}>답변 다시 남기기</Btn></>}
      >
        <Card>
          <p className="vg-cap">{TOTAL} / {TOTAL}</p>
          <h1 className="vg-q"><Ko>{`${visitor.name}님, 답변이 전달됐어요`}</Ko></h1>
          <p className="vg-body"><Ko>남겨 주신 단어는 이 화면에 실시간으로 나타나요. 이제 2팀 체험으로 이동해 주세요. 체험을 마친 뒤 3번 NFC에 휴대폰을 대면 졸업증서를 받아요.</Ko></p>
          {shown.length ? <div className="vg-chips">{shown.map((w, n) => <span key={w + n} className="vg-chip">{w}</span>)}</div> : null}
        </Card>
      </Screen>
    )
  }

  const q = QUESTIONS[i]
  const cur = words[i]
  const filled = cur.map((w) => w.trim()).filter(Boolean)
  const setWord = (n) => (e) => setWords((all) => all.map((arr, k) => (k !== i ? arr : arr.map((x, m) => (m === n ? e.target.value.slice(0, WORD_LEN) : x)))))
  const addWord = () => setWords((all) => all.map((arr, k) => (k === i && arr.length < WORD_MAX ? [...arr, ''] : arr)))
  const last = i === TOTAL - 1

  const submit = async () => {
    if (busy) return
    setBusy(true); setErr('')
    try {
      const payload = {}
      words.forEach((arr, k) => { payload[k] = arr.map((w) => w.trim()).filter(Boolean) })
      const out = await saveSurvey(id, payload)
      vibrate([12, 40, 12])
      setSaved(out)
      reload()
    } catch {
      setErr('답변을 저장하지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.')
    } finally { setBusy(false) }
  }

  return (
    <Screen
      title="질문"
      dock={<>
        {last
          ? <Btn disabled={busy || words.some((arr) => !arr.some((w) => w.trim()))} onClick={submit}>{busy ? '보내는 중' : '보내기'}</Btn>
          : <Btn disabled={!filled.length} onClick={() => { vibrate(8); setI(i + 1) }}>다음</Btn>}
        {i > 0 ? <Btn prominent={false} onClick={() => setI(i - 1)}>이전</Btn> : null}
      </>}
    >
      <Card key={i}>
        <p className="vg-cap">{i + 1} / {TOTAL}</p>
        <h1 className="vg-q"><Ko>{q.q}</Ko></h1>
        <p className="vg-body"><Ko>{`${q.hint} 최대 ${WORD_MAX}개까지 남길 수 있어요.`}</Ko></p>
        <div style={{ marginTop: 20, display: 'grid', gap: 12 }}>
          {cur.map((w, n) => (
            <div key={n}>
              <input className="vg-input" value={w} onChange={setWord(n)} maxLength={WORD_LEN} placeholder={n === 0 ? '한 단어로' : '다른 단어'} aria-label={`단어 ${n + 1}`} enterKeyHint="done" autoCorrect="off" spellCheck={false} onKeyDown={(ev) => { if (ev.key === 'Enter') { ev.preventDefault(); ev.target.blur() } }} />
              <p className="vg-count">{w.length} / {WORD_LEN}</p>
            </div>
          ))}
        </div>
        {cur.length < WORD_MAX ? <p className="vg-note"><button type="button" onClick={addWord} className="vg-link">단어 더 적기</button></p> : null}
        {err ? <p className="vg-err">{err}</p> : null}
        <p className="vg-note">이름은 단어와 함께 표시되지 않아요.</p>
        <p className="vg-note"><button type="button" onClick={reset} className="vg-link">{visitor.name}님이 아니에요</button></p>
      </Card>
    </Screen>
  )
}
