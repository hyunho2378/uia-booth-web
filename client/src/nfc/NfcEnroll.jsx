import { useEffect, useMemo, useState } from 'react'
import { Screen, Card, Btn, Ko, useToast } from './ui'
import { enroll } from './db'
import { saveVisitor } from './storage'
import { useVisitor } from './useVisitor'
import { drawCertificate } from './certificate'
import { saveImage, shareImage, siteUrl } from './share'

export default function NfcEnroll() {
  const { status, visitor, reset, adopt } = useVisitor()
  const [form, setForm] = useState({ name: '', affiliation: '' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [cert, setCert] = useState('')
  const [toast, show] = useToast()

  useEffect(() => {
    if (status !== 'ready' || !visitor) return undefined
    let off = false
    drawCertificate('admission', visitor).then((u) => { if (!off) setCert(u) }).catch(() => {})
    return () => { off = true }
  }, [status, visitor])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const canSubmit = form.name.trim().length > 0 && !busy

  const submit = async () => {
    if (!canSubmit) return
    setBusy(true); setErr('')
    try {
      const row = await enroll(form)
      saveVisitor({ id: row.id })
      await adopt(row.id)
    } catch {
      setErr('입학 정보를 저장하지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.')
    } finally { setBusy(false) }
  }

  const fileName = useMemo(() => (visitor ? `UIA_입학증서_${visitor.name}.png` : ''), [visitor])
  const onSave = async () => { const r = await saveImage(cert, fileName); if (r === 'downloaded') show('이미지를 저장했어요') }
  const onShare = async () => {
    const r = await shareImage(cert, fileName, `${visitor.name}님이 UIA 대학교에 입학했어요`, siteUrl('/'))
    if (r === 'copied') show('주소를 복사했어요')
  }

  if (status === 'loading') return <Screen title="입학"><Card><p className="vg-body" style={{ marginTop: 0 }}>불러오는 중이에요.</p></Card></Screen>

  if (status === 'ready' && visitor) {
    return (
      <Screen
        title="입학증서"
        dock={cert ? (<><Btn onClick={onSave}>입학증서 저장하기</Btn><Btn prominent={false} onClick={onShare}>공유하기</Btn></>) : null}
      >
        <Card>
          <p className="vg-cap">1 / 3</p>
          <h1 className="vg-q"><Ko>{`${visitor.name}님, 입학을 축하해요`}</Ko></h1>
          <p className="vg-body"><Ko>입학증서가 발급되었어요. 아래 순서로 진행돼요.</Ko></p>
          <ol className="vg-steps">
            <li><b>1</b><span>입학증서를 저장해 두세요.</span></li>
            <li><b>2</b><span><Ko>2번 NFC에 휴대폰을 대고 설문에 답해요.</Ko></span></li>
            <li><b>3</b><span><Ko>체험을 마친 뒤 3번 NFC에서 졸업증서를 받아요.</Ko></span></li>
          </ol>
          <p className="vg-cap" style={{ marginTop: 18 }}>입학 코드</p>
          <b className="vg-code">{visitor.code}</b>
          {cert ? <img className="vg-cert" src={cert} alt={`${visitor.name} 입학증서`} /> : null}
          <p className="vg-note"><button type="button" onClick={reset} className="vg-link">다른 사람으로 입학하기</button></p>
        </Card>
        {toast}
      </Screen>
    )
  }

  return (
    <Screen title="입학" dock={<Btn disabled={!canSubmit} onClick={submit}>{busy ? '입학 처리 중' : '입학하기'}</Btn>}>
      <Card>
        <p className="vg-cap">1 / 3</p>
        <h1 className="vg-q"><Ko>UIA 대학교에 입학하세요</Ko></h1>
        <p className="vg-body"><Ko>입학증서에 들어갈 이름과 소속을 적어 주세요.</Ko></p>
        <label className="vg-field">
          <span>이름</span>
          <input className="vg-input" value={form.name} onChange={set('name')} maxLength={10} autoComplete="name" placeholder="홍길동" />
        </label>
        <label className="vg-field">
          <span>소속 (선택)</span>
          <input className="vg-input" value={form.affiliation} onChange={set('affiliation')} maxLength={30} placeholder="한림대학교" />
        </label>
        {err ? <p className="vg-err">{err}</p> : null}
        <p className="vg-note">입력한 정보는 증서 발급과 행사 운영에만 사용해요.</p>
      </Card>
    </Screen>
  )
}
