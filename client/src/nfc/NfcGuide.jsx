import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Screen, Card, Ko, useToast } from './ui'
import { siteUrl } from './share'

const ROWS = [
  ['1번 입학', '영상 모니터에 붙입니다. 이름과 소속을 적으면 입학증서가 나옵니다.', '/nfc/1'],
  ['2번 질문', '스탠바이미 옆 판넬에 붙입니다. 질문 두 개에 단어로 답하면 워드클라우드에 바로 나타납니다.', '/nfc/2'],
  ['3번 졸업', '2팀 럭키드로우 자리에 붙입니다. 질문에 답한 사람에게 졸업증서가 나오고 담당자가 이 화면을 확인합니다.', '/nfc/3'],
  ['워드클라우드', '스탠바이미 한 대에 전체 화면으로 띄웁니다. 질문별 단어가 실시간으로 모입니다.', '/words?screen=1'],
]

// 1팀 대본(운영 대본 폴더)과 11월 20일 회의의 시간 기준
// 현장에서 자주 생길 상황과 대응
const HELP = [
  ['휴대폰이 NFC를 읽지 못함', '스티커 옆 QR을 찍으면 같은 화면이 열립니다. 휴대폰 NFC 설정이 꺼져 있는지도 확인합니다.'],
  ['휴대폰을 바꿔서 입학 기록이 없음', '입학증서 아래 6자리 코드를 입력하면 이어집니다. 코드를 모르면 운영자 화면에서 이름으로 찾아 알려 줍니다.'],
  ['한 휴대폰을 두 사람이 사용', '화면 아래 "이름님이 아니에요"를 누르면 새로 입학할 수 있습니다.'],
  ['질문을 건너뛰고 졸업증서를 원함', '운영자 화면에서 이름을 찾아 "질문 없이 졸업"을 누르면 졸업증서가 발급됩니다.'],
  ['같은 이름의 방문객이 여러 명', '졸업 화면의 증서 번호와 운영자 화면의 번호를 맞춰 보고 럭키드로우를 표시합니다.'],
  ['부적절한 단어가 올라옴', '운영자 화면의 단어 관리에서 "가리기"를 누르면 워드클라우드에서 바로 빠지고 같은 단어는 다시 받지 않습니다.'],
  ['방문객이 몰려 접속이 느림', '입학과 질문은 같은 요청을 다시 보내도 중복되지 않으니, 화면의 "다시 시도"를 눌러도 됩니다.'],
]

const FLOW = [
  ['영상존', '영상 관람 뒤 20초 동안 1번 NFC 등록과 동선을 안내합니다. 이름과 소속을 적으면 입학합니다.'],
  ['판넬 세 개', '춘천, 사가페, 경주 판넬을 각 30초로 설명합니다.'],
  ['웹사이트', 'Activities, Projects, Students 화면을 45초로 설명합니다.'],
  ['2번 NFC', '질문 두 개에 답하면 워드클라우드에 단어가 바로 나타납니다. 30초 안에 마칩니다.'],
  ['2팀 체험', '토큰 4개를 관심 분야에 나눠 투자하고 해결 아이디어를 남깁니다.'],
  ['3번 NFC와 럭키드로우', '졸업증서를 확인하고 에어볼 추첨기로 굿즈를 받습니다.'],
]

// 운영자용 주소 목록. 태그에 쓰거나 팀에 공유할 때 QR과 주소를 그대로 쓴다.
// 운영자 화면 안에서만 보인다(비밀번호가 필요함).
export default function NfcGuide() {
  const [qr, setQr] = useState({})
  const [toast, show] = useToast()
  useEffect(() => {
    ROWS.forEach(([, , p]) => QRCode.toDataURL(siteUrl(p), { margin: 1, width: 264 }).then((u) => setQr((q) => ({ ...q, [p]: u }))))
  }, [])
  const copy = async (u) => { try { await navigator.clipboard.writeText(u); show('주소를 복사했어요') } catch { show('복사하지 못했어요') } }
  return (
    <>
      <Card>
        <h2 className="vg-q" style={{ marginTop: 0 }}>NFC 태그 주소</h2>
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
      <Card>
        <h2 className="vg-q" style={{ marginTop: 0 }}>상황별 대응</h2>
        <ol className="vg-steps">
          {HELP.map(([t, d], n) => (<li key={t}><b>{n + 1}</b><span><b style={{ fontWeight: 700 }}>{t}</b><br /><Ko>{d}</Ko></span></li>))}
        </ol>
      </Card>
      {toast}
    </>
  )
}
