import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NfcShell from './NfcShell'
import CodeEntry from './CodeEntry'
import { graduate } from './db'
import { drawCertificate } from './certificate'
import { useVisitor } from './useVisitor'

export default function NfcGraduate() {
  const { status, visitor, id, attach } = useVisitor()
  const [grad, setGrad] = useState(null)
  const [cert, setCert] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    if (status !== 'ready' || !visitor || !visitor.quiz_at) return
    let off = false
    ;(async () => {
      try {
        const g = await graduate(id)
        if (off || !g || !g.cert_no) return
        setGrad(g)
        setCert(await drawCertificate('graduation', g))
      } catch { if (!off) setErr('졸업증서를 만들지 못했습니다. 인터넷 연결을 확인하고 다시 대 주세요.') }
    })()
    return () => { off = true }
  }, [status, visitor, id])

  if (status === 'loading') return <NfcShell step={3} title="졸업"><p className="nfc-lead">불러오는 중입니다.</p></NfcShell>
  if (status === 'error') return <NfcShell step={3} title="졸업"><h1>연결이 원활하지 않습니다</h1><p className="nfc-lead">인터넷 연결을 확인하고 휴대폰을 NFC에 다시 대 주세요.</p></NfcShell>
  if (status === 'none') return <NfcShell step={3} title="졸업"><CodeEntry onAttach={attach} /></NfcShell>

  if (!visitor.quiz_at) {
    return (
      <NfcShell step={3} title="졸업">
        <h1>{visitor.name}님, 퀴즈가 남아 있습니다</h1>
        <p className="nfc-lead">졸업증서는 퀴즈를 마친 뒤 발급됩니다. 2번 NFC에서 퀴즈를 풀고 다시 오세요.</p>
        <div className="nfc-actions"><Link to="/nfc/2" className="nfc-btn" style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}>퀴즈 풀러 가기</Link></div>
      </NfcShell>
    )
  }

  return (
    <NfcShell step={3} title="졸업증서">
      <h1>{visitor.name}님, 졸업을 축하합니다</h1>
      <p className="nfc-lead">UIA 대학교 과정을 모두 마쳤습니다. 졸업증서 이미지를 길게 눌러 저장해 주세요.</p>
      {err && <p className="nfc-err" style={{ marginTop: '1rem' }}>{err}</p>}
      {cert && <img className="nfc-cert" src={cert} alt={visitor.name + ' 졸업증서'} />}
      {cert && grad && (
        <div className="nfc-actions">
          <a className="nfc-btn" style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }} href={cert} download={`UIA_졸업증서_${visitor.name}.png`}>졸업증서 저장</a>
        </div>
      )}
    </NfcShell>
  )
}
