import { useEffect, useState } from 'react'
import NfcShell from './NfcShell'
import { enroll, getVisitor } from './db'
import { saveVisitor } from './storage'
import { useVisitor } from './useVisitor'
import { drawCertificate } from './certificate'

export default function NfcEnroll() {
  const { status, visitor, reset, adopt } = useVisitor()
  const [form, setForm] = useState({ name: '', affiliation: '' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [cert, setCert] = useState('')

  useEffect(() => {
    if (status !== 'ready' || !visitor) return
    let off = false
    drawCertificate('admission', visitor).then((u) => { if (!off) setCert(u) }).catch(() => {})
    return () => { off = true }
  }, [status, visitor])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setBusy(true); setErr('')
    try {
      const row = await enroll(form)
      saveVisitor({ id: row.id })
      await adopt(row.id)
    } catch {
      setErr('입학 정보를 저장하지 못했습니다. 인터넷 연결을 확인하고 다시 눌러 주세요.')
    } finally { setBusy(false) }
  }

  if (status === 'loading') return <NfcShell step={1} title="입학"><p className="nfc-lead">불러오는 중입니다.</p></NfcShell>

  if (status === 'ready' && visitor) {
    return (
      <NfcShell step={1} title="입학증서">
        <h1>{visitor.name}님, 입학을 축하합니다</h1>
        <p className="nfc-lead">입학증서가 발급되었습니다. 이미지를 길게 눌러 저장할 수 있습니다. 아래 순서로 진행됩니다.</p>
        <ol className="nfc-steps">
          <li><b>1</b>입학증서를 저장합니다.</li>
          <li><b>2</b>2번 NFC에 휴대폰을 대고 설문에 답합니다.</li>
          <li><b>3</b>체험 프로그램을 마친 뒤 3번 NFC에서 졸업증서를 받습니다.</li>
        </ol>
        <div className="nfc-note" style={{ marginTop: '1.2rem' }}>입학 코드<br /><span className="nfc-code">{visitor.code}</span></div>
        {cert && <img className="nfc-cert" src={cert} alt={visitor.name + ' 입학증서'} />}
        <div className="nfc-actions">
          {cert && <a className="nfc-btn" style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }} href={cert} download={`UIA_입학증서_${visitor.name}.png`}>입학증서 저장</a>}
          <button className="nfc-btn soft" type="button" onClick={reset}>다른 사람으로 입학하기</button>
        </div>
      </NfcShell>
    )
  }

  return (
    <NfcShell step={1} title="입학">
      <h1>UIA 대학교에<br />입학하세요</h1>
      <p className="nfc-lead">입학증서에 들어갈 이름과 소속을 적어 주세요.</p>
      <form className="nfc-form" onSubmit={submit}>
        <div className="nfc-field">
          <label htmlFor="name">이름</label>
          <input id="name" className="nfc-input" value={form.name} onChange={set('name')} maxLength={10} autoComplete="name" placeholder="홍길동" required />
        </div>
        <div className="nfc-field">
          <label htmlFor="aff">소속<span>선택</span></label>
          <input id="aff" className="nfc-input" value={form.affiliation} onChange={set('affiliation')} maxLength={30} placeholder="한림대학교" />
        </div>
        <p className="nfc-note">입력한 정보는 입학증서와 졸업증서 발급, 행사 운영에만 사용합니다.</p>
        {err && <p className="nfc-err">{err}</p>}
        <button className="nfc-btn" type="submit" disabled={busy || !form.name.trim()}>{busy ? '입학 처리 중' : '입학하기'}</button>
      </form>
    </NfcShell>
  )
}
