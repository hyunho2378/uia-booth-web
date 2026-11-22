import { useEffect, useMemo, useState } from 'react'
import { Screen, Card, Btn, BtnLink, Ko, useToast } from './ui'
import CodeEntry from './CodeEntry'
import { graduate } from './db'
import { drawCertificate } from './certificate'
import { useVisitor } from './useVisitor'
import { saveImage, shareImage, shareLink, siteUrl } from './share'

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
      } catch { if (!off) setErr('졸업증서를 만들지 못했어요. 인터넷 연결을 확인하고 다시 대 주세요.') }
    })()
    return () => { off = true }
  }, [status, visitor, id])

  const fileName = useMemo(() => (grad ? `UIA_졸업증서_${grad.name}.png` : ''), [grad])
  const link = grad && grad.share_token ? siteUrl('/nfc/s/' + grad.share_token) : siteUrl('/')

  if (status === 'loading') return <Screen title="졸업"><Card><p className="vg-body" style={{ marginTop: 0 }}>불러오는 중이에요.</p></Card></Screen>
  if (status === 'error') return <Screen title="졸업" dock={<Btn onClick={() => window.location.reload()}>다시 시도</Btn>}><Card><h1 className="vg-q" style={{ marginTop: 0 }}>연결이 원활하지 않아요</h1><p className="vg-body">인터넷 연결을 확인한 뒤 다시 시도해 주세요.</p></Card></Screen>
  if (status === 'none') return <Screen title="졸업"><CodeEntry onAttach={attach} /></Screen>

  if (!visitor.quiz_at) {
    return (
      <Screen title="졸업" dock={<BtnLink to="/nfc/2" prominent>질문에 답하러 가기</BtnLink>}>
        <Card>
          <p className="vg-cap">3 / 3</p>
          <h1 className="vg-q"><Ko>{`${visitor.name}님, 질문이 남아 있어요`}</Ko></h1>
          <p className="vg-body"><Ko>졸업증서는 질문에 답한 뒤 발급돼요. 2번 NFC에서 질문에 답하고 다시 와 주세요.</Ko></p>
          <p className="vg-note"><button type="button" onClick={reset} className="vg-link">{visitor.name}님이 아니에요</button></p>
        </Card>
      </Screen>
    )
  }

  const onSave = async () => { const r = await saveImage(cert, fileName); if (r === 'downloaded') show('이미지를 저장했어요') }
  const onShare = async () => {
    const r = await shareImage(cert, fileName, `${grad.name}님이 UIA 대학교를 졸업했어요`, link)
    if (r === 'copied') show('주소를 복사했어요')
  }
  const onCopy = async () => { const r = await shareLink('UIA 졸업증서', link); if (r === 'copied') show('링크를 복사했어요') }

  return (
    <Screen title="졸업증서" dock={cert ? (<><Btn onClick={onSave}>졸업증서 저장하기</Btn><Btn prominent={false} onClick={onShare}>공유하기</Btn></>) : null}>
      <Card>
        <p className="vg-cap">3 / 3</p>
        <h1 className="vg-q"><Ko>{`${visitor.name}님, 졸업을 축하해요`}</Ko></h1>
        <p className="vg-body"><Ko>{grad && grad.draw_at ? 'UIA 대학교 과정을 모두 마쳤고 럭키드로우에도 참여했어요. 졸업증서를 저장하고 친구에게 공유해 보세요.' : 'UIA 대학교 과정을 모두 마쳤어요. 럭키드로우 자리에서 이 화면을 보여 주세요. 졸업증서는 저장하고 친구에게 공유할 수 있어요.'}</Ko></p>
        {err ? <p className="vg-err">{err}</p> : null}
        {cert ? <img className="vg-cert" src={cert} alt={`${visitor.name} 졸업증서`} /> : <p className="vg-body">증서를 만드는 중이에요.</p>}
        {grad && grad.cert_no ? <p className="vg-cap" style={{ marginTop: 12 }}>증서 번호 {grad.cert_no}</p> : null}
        {cert ? <p className="vg-note">저장 버튼이 열리지 않으면 증서 이미지를 길게 눌러 저장해 주세요.</p> : null}
        {cert ? <p className="vg-note"><button type="button" onClick={onCopy} className="vg-link">증서 링크 복사하기</button></p> : null}
        <p className="vg-note"><button type="button" onClick={reset} className="vg-link">{visitor.name}님이 아니에요</button></p>
      </Card>
      {toast}
    </Screen>
  )
}
