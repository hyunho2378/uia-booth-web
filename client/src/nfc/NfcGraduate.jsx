import { useEffect, useMemo, useState } from 'react'
import { Screen, Card, Btn, BtnLink, Ko, useToast } from './ui'
import CodeEntry from './CodeEntry'
import { graduate } from './db'
import { drawCertificate } from './certificate'
import { useVisitor } from './useVisitor'
import { saveImage, shareImage, siteUrl } from './share'

export default function NfcGraduate() {
  const { status, visitor, id, attach, reset } = useVisitor()
  const [grad, setGrad] = useState(null)
  const [cert, setCert] = useState('')
  const [err, setErr] = useState('')
  const [toast, show] = useToast()

  useEffect(() => {
    if (status !== 'ready' || !visitor || !visitor.quiz_at) return undefined
    let off = false
    ;(async () => {
      try {
        const g = await graduate(id)
        if (off || !g || !g.cert_no) return
        setGrad(g)
        setCert(await drawCertificate('graduation', g))
      } catch { if (!off) setErr('증서를 만들지 못했어요. 인터넷 연결을 확인하고 다시 열어 주세요.') }
    })()
    return () => { off = true }
  }, [status, visitor, id])

  const fileName = useMemo(() => (grad ? `UIA_졸업증서_${grad.name}.jpg` : ''), [grad])
  const link = grad && grad.share_token ? siteUrl('/nfc/s/' + grad.share_token) : siteUrl('/')

  if (status === 'loading') return <Screen title="졸업"><Card logo><p className="vg-body" style={{ marginTop: 0 }}>불러오는 중이에요.</p></Card></Screen>
  if (status === 'error') return <Screen title="졸업" dock={<Btn onClick={() => window.location.reload()}>다시 시도</Btn>}><Card logo><h1 className="vg-q" style={{ marginTop: 0 }}>연결이 끊겼어요</h1><p className="vg-body">인터넷 연결을 확인한 뒤 다시 시도해 주세요.</p></Card></Screen>
  if (status === 'none') return <Screen title="졸업"><CodeEntry onAttach={attach} /></Screen>

  if (!visitor.quiz_at) {
    return (
      <Screen title="졸업" dock={<BtnLink to="/nfc/2" prominent>2번 질문 답하기</BtnLink>}>
        <Card logo>
          <h1 className="vg-q" style={{ marginTop: 0 }}><Ko>{`${visitor.name}님 질문이 남아 있어요`}</Ko></h1>
          <p className="vg-body"><Ko>졸업증서는 질문에 답하면 받을 수 있어요.</Ko></p>
          <p className="vg-note" style={{ marginTop: 2 }}><button type="button" onClick={reset} className="vg-link">{visitor.name}님이 아니면 눌러 주세요</button></p>
        </Card>
      </Screen>
    )
  }

  const onSave = async () => { const r = await saveImage(cert, fileName); if (r === 'downloaded') show('저장했어요. 안 보이면 증서를 길게 눌러 저장해 주세요') }
  const onShare = async () => {
    const r = await shareImage(cert, fileName, `${grad.name}님이 UIA 대학교를 졸업했어요`, link)
    if (r === 'copied') show('주소를 복사했어요')
  }

  return (
    <Screen title="졸업증서" dock={cert ? (<><Btn onClick={onSave}>저장하기</Btn><Btn prominent={false} onClick={onShare}>공유하기</Btn></>) : null}>
      <Card logo>
        <h1 className="vg-q" style={{ marginTop: 0 }}><Ko>{`${visitor.name}님 졸업을 축하해요`}</Ko></h1>
        {err ? <p className="vg-err">{err}</p> : null}
        {cert ? <img className="vg-cert fit-g" src={cert} alt={`${visitor.name} 졸업증서`} /> : <div className="vg-cert-wait">증서를 만드는 중이에요</div>}
        <p className="vg-note" style={{ marginTop: 6 }}><button type="button" onClick={reset} className="vg-link">{visitor.name}님이 아니면 눌러 주세요</button></p>
      </Card>
      {toast}
    </Screen>
  )
}
