import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Card, Ko, useToast } from './ui'
import { siteUrl } from './share'

const ROWS = [
  ['1번 입학', '입구 영상 모니터', '/nfc/1'],
  ['2번 질문', '스탠바이미 옆 판넬', '/nfc/2'],
  ['3번 졸업', '2팀 럭키드로우 자리', '/nfc/3'],
  ['워드클라우드', '스탠바이미 화면', '/words?screen=1'],
]

// 현장에서 자주 생기는 일과 해결 방법
const HELP = [
  ['NFC가 안 읽혀요', '스티커 옆 QR을 찍게 해 주세요. 휴대폰의 NFC가 꺼져 있는지도 확인해 주세요.'],
  ['휴대폰을 바꿨어요', '입학 코드를 입력하면 이어집니다. 코드를 모르면 위에서 이름으로 찾아 알려 주세요.'],
  ['한 휴대폰을 둘이 써요', '화면 아래 "이름님이 아니면 눌러 주세요"를 누르면 새로 입학합니다.'],
  ['질문을 건너뛰었어요', '럭키드로우에서 이름을 찾아 "질문 없이 졸업"을 눌러 주세요.'],
  ['같은 이름이 여러 명이에요', '졸업 화면의 증서 번호와 검색 결과의 번호를 맞춰 보세요.'],
  ['이상한 단어가 올라왔어요', '단어 가리기에서 가리기를 누르면 바로 사라지고 다시 올라오지 않습니다.'],
  ['접속이 느려요', '화면의 다시 시도를 눌러도 기록이 두 번 생기지 않습니다.'],
]

// 운영자 화면 안에서만 보인다(비밀번호가 필요함).
export default function NfcGuide() {
  const [qr, setQr] = useState({})
  const [toast, show] = useToast()
  useEffect(() => {
    ROWS.forEach(([, , p]) => QRCode.toDataURL(siteUrl(p), { margin: 1, width: 264 }).then((u) => setQr((q) => ({ ...q, [p]: u }))))
  }, [])
  const copy = async (u) => { try { await navigator.clipboard.writeText(u); show('복사했어요') } catch { show('복사하지 못했어요') } }
  return (
    <>
      <Card>
        <h2 className="vg-q" style={{ marginTop: 0 }}>태그와 QR</h2>
        {ROWS.map(([t, d, p]) => (
          <div key={p} className="vg-tag">
            <div>
              <b style={{ fontSize: 17, lineHeight: '24px' }}>{t}</b>
              <p className="vg-body" style={{ marginTop: 2 }}>{d}</p>
              <p className="vg-url">{siteUrl(p)}</p>
              <button type="button" className="vg-mini" style={{ marginTop: 8 }} onClick={() => copy(siteUrl(p))}>주소 복사</button>
            </div>
            {qr[p] ? <img className="vg-qr" src={qr[p]} alt={`${t} QR`} /> : null}
          </div>
        ))}
      </Card>
      <Card>
        <h2 className="vg-q" style={{ marginTop: 0 }}>이럴 땐</h2>
        <ol className="vg-steps">
          {HELP.map(([t, d], n) => (<li key={t}><b>{n + 1}</b><span><b style={{ fontWeight: 700 }}>{t}</b><br /><Ko>{d}</Ko></span></li>))}
        </ol>
      </Card>
      {toast}
    </>
  )
}
