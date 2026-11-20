import { useState } from 'react'
import NfcShell from './NfcShell'
import CodeEntry from './CodeEntry'
import { CHOICES, WORD_Q, WORD_MAX } from './survey'
import { saveSurvey } from './db'
import { useVisitor } from './useVisitor'

export default function NfcSurvey() {
  const { status, visitor, id, attach, reload } = useVisitor()
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState([])
  const [words, setWords] = useState([''])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [saved, setSaved] = useState(null)
  const [again, setAgain] = useState(false)

  if (status === 'loading') return <NfcShell step={2} title="설문"><p className="nfc-lead">불러오는 중입니다.</p></NfcShell>
  if (status === 'error') return <NfcShell step={2} title="설문"><h1>연결이 원활하지 않습니다</h1><p className="nfc-lead">인터넷 연결을 확인하고 휴대폰을 NFC에 다시 대 주세요.</p></NfcShell>
  if (status === 'none') return <NfcShell step={2} title="설문"><CodeEntry onAttach={attach} /></NfcShell>

  const total = CHOICES.length
  const done = saved || (visitor.quiz_at && !again ? [] : null)

  const pick = (k) => {
    const next = [...answers, k]
    setAnswers(next)
    setI(i + 1)
  }
  const setWord = (n) => (e) => setWords((w) => w.map((x, m) => (m === n ? e.target.value : x)))
  const addWord = () => setWords((w) => (w.length < WORD_MAX ? [...w, ''] : w))
  const filled = words.map((w) => w.trim()).filter(Boolean)

  const submit = async (e) => {
    e.preventDefault()
    if (!filled.length) return
    setBusy(true); setErr('')
    try {
      const out = await saveSurvey(id, answers, filled)
      setSaved(out)
      reload()
    } catch {
      setErr('답변을 저장하지 못했습니다. 인터넷 연결을 확인하고 다시 눌러 주세요.')
    } finally { setBusy(false) }
  }

  if (done) {
    return (
      <NfcShell step={2} title="설문 완료">
        <h1>{visitor.name}님,<br />답변이 전달되었습니다</h1>
        <p className="nfc-lead">남겨 주신 단어는 특별관 화면의 워드클라우드에 나타납니다. 체험 프로그램을 모두 마친 뒤 3번 NFC에 휴대폰을 대면 졸업증서가 발급됩니다.</p>
        {saved && saved.length > 0 && (
          <div className="nfc-words">{saved.map((w) => <span key={w}>{w}</span>)}</div>
        )}
        <div className="nfc-actions">
          <button className="nfc-btn soft" type="button" onClick={() => { setAgain(true); setSaved(null); setI(0); setAnswers([]); setWords(['']) }}>답변 다시 남기기</button>
        </div>
      </NfcShell>
    )
  }

  if (i < total) {
    const q = CHOICES[i]
    return (
      <NfcShell step={2} title="설문">
        <div className="nfc-prog"><i style={{ width: `${(i / (total + 1)) * 100}%` }} /></div>
        <p className="nfc-step" style={{ margin: '0 0 .6rem' }}>{i + 1} / {total + 1}</p>
        <h2 className="nfc-q">{q.q}</h2>
        <div className="nfc-opts">
          {q.options.map((o, k) => (
            <button key={k} type="button" className="nfc-opt" onClick={() => pick(k)}>{o}</button>
          ))}
        </div>
      </NfcShell>
    )
  }

  return (
    <NfcShell step={2} title="설문">
      <div className="nfc-prog"><i style={{ width: `${(total / (total + 1)) * 100}%` }} /></div>
      <p className="nfc-step" style={{ margin: '0 0 .6rem' }}>{total + 1} / {total + 1}</p>
      <h2 className="nfc-q">{WORD_Q}</h2>
      <form className="nfc-form" style={{ marginTop: 0 }} onSubmit={submit}>
        {words.map((w, n) => (
          <input key={n} className="nfc-input" value={w} onChange={setWord(n)} maxLength={14} autoFocus={n === words.length - 1 && n > 0} placeholder={n === 0 ? '예: 연결' : '다른 단어'} aria-label={`단어 ${n + 1}`} />
        ))}
        {words.length < WORD_MAX && (
          <button className="nfc-btn soft" type="button" onClick={addWord}>단어 더 적기</button>
        )}
        <p className="nfc-note">단어는 최대 {WORD_MAX}개까지 남길 수 있고 이름과 함께 표시되지 않습니다.</p>
        {err && <p className="nfc-err">{err}</p>}
        <button className="nfc-btn" type="submit" disabled={busy || !filled.length}>{busy ? '보내는 중' : '답변 보내기'}</button>
      </form>
    </NfcShell>
  )
}
