import { useRef, useState } from 'react'
import { Screen, Card, Btn, Ko, vibrate } from './ui'
import CodeEntry from './CodeEntry'
import { QUESTIONS, WORD_MAX, WORD_LEN } from './survey'
import { saveSurvey } from './db'
import { useVisitor } from './useVisitor'

const TOTAL = QUESTIONS.length
const empty = () => QUESTIONS.map(() => [''])

export default function NfcSurvey({ onDone, onReset } = {}) {
  const { status, visitor, id, attach, reload, reset } = useVisitor()
  const [i, setI] = useState(0)
  const [words, setWords] = useState(empty)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [saved, setSaved] = useState(null)
  const lastRef = useRef(null)

  if (status === 'loading') return <Screen title="질문"><Card logo><p className="vg-body" style={{ marginTop: 0 }}>불러오는 중이에요.</p></Card></Screen>
  if (status === 'error') return <Screen title="질문" dock={<Btn onClick={() => window.location.reload()}>다시 시도</Btn>}><Card logo><h1 className="vg-q" style={{ marginTop: 0 }}>연결이 끊겼어요</h1><p className="vg-body">인터넷 연결을 확인한 뒤 다시 시도해 주세요.</p></Card></Screen>
  if (status === 'none') return <Screen title="질문"><CodeEntry onAttach={attach} /></Screen>

  if (saved || visitor.quiz_at) {
    const shown = saved ? Object.keys(saved).sort().flatMap((k) => saved[k]) : []
    return (
      <Screen title="질문 완료">
        <Card logo>
          <h1 className="vg-q" style={{ marginTop: 0 }}><Ko>{`${visitor.name}님 답변이 전달됐어요`}</Ko></h1>
          {shown.length ? <div className="vg-chips">{shown.map((w, n) => <span key={w + n} className="vg-chip">{w}</span>)}</div> : null}
          <p className="vg-note" style={{ marginTop: 6 }}><button type="button" onClick={() => { reset(); onReset && onReset() }} className="vg-link">{visitor.name}님이 아니면 눌러 주세요</button></p>
        </Card>
      </Screen>
    )
  }

  const q = QUESTIONS[i]
  const cur = words[i]
  const filled = cur.map((w) => w.trim()).filter(Boolean)
  const lastFilled = cur[cur.length - 1].trim().length > 0
  const setWord = (n) => (e) => setWords((all) => all.map((arr, k) => (k !== i ? arr : arr.map((x, m) => (m === n ? e.target.value.slice(0, WORD_LEN) : x)))))
  const addWord = () => {
    if (cur.length >= WORD_MAX || !lastFilled) return
    setWords((all) => all.map((arr, k) => (k === i ? [...arr, ''] : arr)))
    setTimeout(() => lastRef.current && lastRef.current.focus(), 60)
  }
  const last = i === TOTAL - 1

  const submit = async () => {
    if (busy) return
    setBusy(true); setErr('')
    try {
      const payload = {}
      words.forEach((arr, k) => { payload[k] = arr.map((w) => w.trim()).filter(Boolean) })
      const out = await saveSurvey(id, payload)
      vibrate([12, 40, 12])
      if (onDone) { onDone(); return }
      setSaved(out)
      reload()
    } catch {
      setErr('답변을 보내지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.')
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
      <Card key={i} logo>
        <h1 className="vg-q" style={{ marginTop: 0 }}><Ko>{q.q}</Ko></h1>
        <div style={{ marginTop: 18, display: 'grid', gap: 10 }}>
          {cur.map((w, n) => (
            <input
              key={n}
              ref={n === cur.length - 1 ? lastRef : null}
              className="vg-input" value={w} onChange={setWord(n)} maxLength={WORD_LEN}
              placeholder={n === 0 ? '단어 입력' : `단어 ${n + 1}`} aria-label={`단어 ${n + 1}`}
              enterKeyHint="done" autoCorrect="off" spellCheck={false}
              onKeyDown={(ev) => { if (ev.key === 'Enter') { ev.preventDefault(); ev.target.blur() } }}
            />
          ))}
        </div>
        {cur.length < WORD_MAX ? (
          <button type="button" className="vg-add" onClick={addWord} disabled={!lastFilled}>
            <span aria-hidden="true">+</span> 단어 추가
          </button>
        ) : null}
        {err ? <p className="vg-err">{err}</p> : null}
      </Card>
    </Screen>
  )
}
