import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Screen, Card, Ko, useToast } from './ui'
import { siteUrl } from './share'

const ROWS = [
  ['1번 입학', '모니터에 붙입니다. 이름과 소속을 적으면 입학증서가 나옵니다.', '/nfc/1'],
  ['2번 설문', '판넬에 붙입니다. 객관식 두 문항에 답하고 단어를 남깁니다.', '/nfc/2'],
  ['3번 졸업', '체험을 마친 자리에 붙입니다. 설문을 마친 사람에게 졸업증서가 나옵니다.', '/nfc/3'],
  ['워드클라우드', '스탠바이미와 모니터에 띄웁니다. 단어가 실시간으로 모입니다.', '/words'],
  ['운영자', '현황을 보고 부적절한 단어를 가립니다.', '/nfc/admin'],
]

// 운영자용 주소 목록. 태그에 쓰거나 팀에 공유할 때 QR과 주소를 그대로 쓴다.
export default function NfcGuide() {
  const [qr, setQr] = useState({})
  const [toast, show] = useToast()
  useEffect(() => {
    ROWS.forEach(([, , p]) => QRCode.toDataURL(siteUrl(p), { margin: 1, width: 264 }).then((u) => setQr((q) => ({ ...q, [p]: u }))))
  }, [])
  const copy = async (u) => { try { await navigator.clipboard.writeText(u); show('주소를 복사했어요') } catch { show('복사하지 못했어요') } }
  return (
    <Screen title="NFC 주소" wide>
      <Card>
        <h1 className="vg-q" style={{ marginTop: 0 }}>NFC 태그 주소</h1>
        <p className="vg-body"><Ko>태그마다 아래 주소를 URL 레코드로 씁니다. 주소를 누르면 복사돼요.</Ko></p>
        {ROWS.map(([t, d, p]) => (
          <div key={p} className="vg-tag">
            <div>
              <b style={{ fontSize: 17, lineHeight: '24px' }}>{t}</b>
              <p className="vg-body" style={{ marginTop: 2 }}><Ko>{d}</Ko></p>
              <p className="vg-url"><button type="button" onClick={() => copy(siteUrl(p))} className="vg-link">{siteUrl(p)}</button></p>
            </div>
            {qr[p] ? <img className="vg-qr" src={qr[p]} alt={`${t} QR`} /> : null}
          </div>
        ))}
      </Card>
      {toast}
    </Screen>
  )
}
