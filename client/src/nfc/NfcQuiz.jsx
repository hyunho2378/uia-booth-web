import { useState } from 'react'
import NfcShell from './NfcShell'
import CodeEntry from './CodeEntry'
import { QUIZ } from './quiz'
import { saveQuiz } from './db'
import { useVisitor } from './useVisitor'

export default function NfcQuiz() {
  const { status, visitor, id, attach, reload } = useVisitor()
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState(null)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  const [retry, setRetry] = useState(false)
  const [err, setErr] = useState('')

  if (status === 'loading') return <NfcShell step={2} title="퀴즈"><p className="nfc-lead">불러오는 중입니다.</p></NfcShell>
  if (status === 'error') return <NfcShell step={2} title="퀴즈"><h1>연결이 원활하지 않습니다</h1><p className="nfc-lead">인터넷 연결을 확인하고 휴대폰을 NFC에 다시 대 주세요.</p></NfcShell>
  if (status === 'none') return <NfcShell step={2} title="퀴즈"><CodeEntry onAttach={attach} /></NfcShell>

  const total = QUIZ.length
  const done = result || (visitor.quiz_at && !retry ? { score: visitor.quiz_score, total: visitor.quiz_total } : null)

  const pick = (k) => { if (picked === null) setPicked(k) }
  const next = async () => {
    const nextAnswers = [...answers, picked]
    if (i + 1 < total) { setAnswers(nextAnswers); setI(i + 1); setPicked(null); return }
    const score = nextAnswers.filter((a, n) => a === QUIZ[n].answer).length
    setErr('')
    try {
      await saveQuiz(id, score, total, nextAnswers)
      setResult({ score, total })
      reload()
    } catch {
      setErr('결과를 저장하지 못했습니다. 인터넷 연결을 확인하고 다시 눌러 주세요.')
    }
  }

  if (done) {
    return (
      <NfcShell step={2} title="퀴즈 결과">
        <h1>{visitor.name}님의 퀴즈 결과</h1>
        <div className="nfc-big">{done.score} / {done.total}</div>
        <p className="nfc-lead">체험 프로그램을 모두 마친 뒤 3번 NFC에 휴대폰을 대면 졸업증서가 발급됩니다.</p>
        <div className="nfc-actions">
          <button className="nfc-btn soft" type="button" onClick={() => { setRetry(true); setResult(null); setI(0); setPicked(null); setAnswers([]) }}>퀴즈 다시 풀기</button>
        </div>
      </NfcShell>
    )
  }

  const q = QUIZ[i]
  return (
    <NfcShell step={2} title="퀴즈">
      <div className="nfc-prog"><i style={{ width: `${((i + (picked !== null ? 1 : 0)) / total) * 100}%` }} /></div>
      <p className="nfc-step" style={{ margin: '0 0 .6rem' }}>{i + 1} / {total}</p>
      <h2 className="nfc-q">{q.q}</h2>
      <div className="nfc-opts">
        {q.options.map((o, k) => (
          <button key={k} type="button" className={'nfc-opt' + (picked !== null ? (k === q.answer ? ' ok' : k === picked ? ' no' : '') : '')} onClick={() => pick(k)} disabled={picked !== null}>{o}</button>
        ))}
      </div>
      {picked !== null && (
        <>
          <div className="nfc-explain"><b>{picked === q.answer ? '정답입니다' : '아쉽습니다'}</b>{q.note}</div>
          {err && <p className="nfc-err" style={{ marginTop: '1rem' }}>{err}</p>}
          <div className="nfc-actions"><button className="nfc-btn" type="button" onClick={next}>{i + 1 < total ? '다음 문제' : '결과 보기'}</button></div>
        </>
      )}
    </NfcShell>
  )
}
