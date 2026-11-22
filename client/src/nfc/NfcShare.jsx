import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Screen, Card, Btn, BtnLink, Ko, useToast } from './ui'
import { getShare } from './db'
import { drawCertificate } from './certificate'
import { saveImage, shareImage, siteUrl } from './share'

// 친구가 공유 링크로 열어 보는 졸업증서
export default function NfcShare() {
  const { token } = useParams()
  const [state, setState] = useState('loading')
  const [data, setData] = useState(null)
  const [cert, setCert] = useState('')
  const [toast, show] = useToast()

  useEffect(() => {
    let off = false
    ;(async () => {
      try {
        const d = await getShare(token)
        if (off) return
        if (!d) { setState('none'); return }
        setData(d)
        setCert(await drawCertificate('graduation', d))
        setState('ready')
      } catch { if (!off) setState('error') }
    })()
    return () => { off = true }
  }, [token])

  if (state === 'loading') return <Screen title="졸업증서"><Card><p className="vg-body" style={{ marginTop: 0 }}>불러오는 중이에요.</p></Card></Screen>
  if (state !== 'ready') {
    return (
      <Screen title="졸업증서" dock={<BtnLink to="/" prominent>UIA 특별관 둘러보기</BtnLink>}>
        <Card>
          <h1 className="vg-q" style={{ marginTop: 0 }}><Ko>{state === 'none' ? '증서를 찾지 못했어요' : '연결이 원활하지 않아요'}</Ko></h1>
          <p className="vg-body"><Ko>{state === 'none' ? '링크가 올바른지 확인해 주세요.' : '잠시 뒤 다시 열어 주세요.'}</Ko></p>
        </Card>
      </Screen>
    )
  }
  const file = `UIA_졸업증서_${data.name}.png`
  return (
    <Screen
      title={`${data.name} 졸업증서`}
      dock={<><Btn onClick={async () => { const r = await saveImage(cert, file); if (r === 'downloaded') show('이미지를 저장했어요') }}>이미지 저장하기</Btn><BtnLink to="/">UIA 특별관 둘러보기</BtnLink></>}
    >
      <Card>
        <h1 className="vg-q" style={{ marginTop: 0 }}><Ko>{`${data.name}님이 UIA 대학교를 졸업했어요`}</Ko></h1>
        <img className="vg-cert" src={cert} alt={`${data.name} 졸업증서`} />
        <p className="vg-note"><button type="button" onClick={async () => { const r = await shareImage(cert, file, `${data.name}님의 UIA 졸업증서`, siteUrl('/nfc/s/' + token)); if (r === 'copied') show('주소를 복사했어요') }} className="vg-link">공유하기</button></p>
      </Card>
      {toast}
    </Screen>
  )
}
