import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Screen, Card, Ko, useToast } from './ui'
import { siteUrl } from './share'

const ROWS = [
  ['1번 입학', '영상 모니터에 붙입니다. 이름과 소속을 적으면 입학증서가 나옵니다.', '/nfc/1'],
  ['2번 질문', '스탠바이미 옆 판넬에 붙입니다. 질문 두 개에 단어로 답하면 워드클라우드에 바로 나타납니다.', '/nfc/2'],
  ['3번 졸업', '2팀 럭키드로우 자리에 붙입니다. 질문에 답한 사람에게 졸업증서가 나오고 담당자가 이 화면을 확인합니다.', '/nfc/3'],
  ['워드클라우드', '스탠바이미 한 대에 띄웁니다. 질문별 단어가 실시간으로 모입니다.', '/words'],
  ['운영자', '현황 확인, 부적절한 단어 가리기, 럭키드로우 확인에 씁니다.', '/nfc/admin'],
]

// 1팀 대본(운영 대본 폴더)과 11월 20일 회의의 시간 기준
const FLOW = [
  ['영상존', '영상 관람 뒤 20초 동안 1번 NFC 등록과 동선을 안내합니다. 이름과 소속을 적으면 입학합니다.'],
  ['판넬 세 개', '춘천, 사가페, 경주 판넬을 각 30초로 설명합니다.'],
  ['웹사이트', 'Activities, Projects, Students 화면을 45초로 설명합니다.'],
  ['2번 NFC', '질문 두 개에 답하면 워드클라우드에 단어가 바로 나타납니다. 30초 안에 마칩니다.'],
  ['2팀 체험', '토큰 4개를 관심 분야에 나눠 투자하고 해결 아이디어를 남깁니다.'],
  ['3번 NFC와 럭키드로우', '졸업증서를 확인하고 에어볼 추첨기로 굿즈를 받습니다.'],
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
      <Card>
        <h2 className="vg-q" style={{ marginTop: 0 }}>방문객 동선</h2>
        <p className="vg-body"><Ko>1팀 구간은 방문객 질문과 이동 시간을 포함해 3분 30초에서 4분이 걸려요. 이어서 2팀 체험으로 넘어갑니다.</Ko></p>
        <ol className="vg-steps">
          {FLOW.map(([t, d], n) => (<li key={t}><b>{n + 1}</b><span><b style={{ fontWeight: 700 }}>{t}</b><br /><Ko>{d}</Ko></span></li>))}
        </ol>
      </Card>
      {toast}
    </Screen>
  )
}
