import { useEffect, useRef, useState } from 'react'
import { Screen, Card, Btn, Ko } from './ui'
import { enroll } from './db'
import { saveVisitor } from './storage'
import { useVisitor } from './useVisitor'
import { drawCertificate, preloadCertFonts } from './certificate'

export default function NfcEnroll({ onNext, onReset } = {}) {
  const { status, visitor, reset, adopt } = useVisitor()
  const [form, setForm] = useState({ name: '', affiliation: '' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [cert, setCert] = useState('')
  const lock = useRef(false)
  const keyRef = useRef('')
  const affRef = useRef(null)

  useEffect(() => {
    if (status !== 'ready' || !visitor) return undefined
    let off = false
    drawCertificate('admission', visitor).then((u) => { if (!off) setCert(u) }).catch(() => {})
    return () => { off = true }
  }, [status, visitor])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const canSubmit = form.name.trim().length > 0 && !busy

  const submit = async () => {
    if (!canSubmit || lock.current) return
    lock.current = true
    setBusy(true); setErr('')
    try { preloadCertFonts(form.name, form.affiliation) } catch { /* 무시 */ }
    // 같은 입학 시도는 같은 키를 쓴다. 응답이 늦어 다시 눌러도 입학증서가 두 장 만들어지지 않는다.
    if (!keyRef.current) keyRef.current = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(36).slice(2))
    try {
      const row = await enroll({ ...form, key: keyRef.current })
      saveVisitor({ id: row.id })
      keyRef.current = ''
      await adopt(row.id)
    } catch (e) {
      const m = String((e && e.message) || '')
      if (/rejected/.test(m)) { keyRef.current = ''; setErr('이름을 다시 확인해 주세요.') }
      else if (/too long/.test(m)) setErr('이름은 20자 이내로 적어 주세요.')
      else if (/busy/.test(m)) setErr('지금 입학하는 분이 많아요. 잠시 뒤에 다시 눌러 주세요.')
      else setErr('입학 정보를 저장하지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.')
    } finally { setBusy(false); lock.current = false }
  }

  if (status === 'loading') return <Screen title="입학"><Card logo><p className="vg-body" style={{ marginTop: 0 }}>불러오는 중이에요.</p></Card></Screen>

  if (status === 'ready' && visitor) {
    return (
      <Screen title="입학증서" dock={onNext ? <Btn onClick={onNext}>질문 답하러 가기</Btn> : null}>
        <Card logo>
          <h1 className="vg-q" style={{ marginTop: 0 }}><Ko>{`${visitor.name}님 입학을 축하해요`}</Ko></h1>
          {cert ? <img className="vg-cert fit" src={cert} alt={`${visitor.name} 입학증서`} /> : <div className="vg-cert-wait">증서를 만드는 중이에요</div>}
          <p className="vg-body">입학 코드 <b className="vg-code-inline">{visitor.code}</b></p>
          <p className="vg-note" style={{ marginTop: 0 }}><button type="button" onClick={() => { reset(); onReset && onReset() }} className="vg-link">{visitor.name}님이 아니면 눌러 주세요</button></p>
        </Card>
      </Screen>
    )
  }

  return (
    <Screen title="입학" dock={<Btn disabled={!canSubmit} onClick={submit}>{busy ? '입학 처리 중' : '입학하기'}</Btn>}>
      <Card logo>
        <h1 className="vg-q"><Ko>UIA 대학교에 입학하세요</Ko></h1>
        <p className="vg-body"><Ko>증서에 들어갈 이름과 소속을 적어 주세요.</Ko></p>
        <label className="vg-field">
          <span>이름</span>
          <input className="vg-input" value={form.name} onChange={set('name')} maxLength={20} autoComplete="name" autoCorrect="off" spellCheck={false} enterKeyHint="next" onKeyDown={(ev) => { if (ev.key === 'Enter') { ev.preventDefault(); affRef.current && affRef.current.focus() } }} placeholder="홍길동" />
        </label>
        <label className="vg-field">
          <span>소속 (선택)</span>
          <input className="vg-input" value={form.affiliation} ref={affRef} onChange={set('affiliation')} maxLength={40} autoCorrect="off" spellCheck={false} enterKeyHint="done" onKeyDown={(ev) => { if (ev.key === 'Enter') { ev.preventDefault(); ev.target.blur(); submit() } }} placeholder="한림대학교" />
        </label>
        {err ? <p className="vg-err">{err}</p> : null}
        <p className="vg-note">입력한 정보는 증서 발급에만 써요.</p>
      </Card>
    </Screen>
  )
}
