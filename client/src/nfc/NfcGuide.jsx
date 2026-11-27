import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Card, useToast } from './ui'
import { siteUrl } from './share'

const ROWS = [
  ['입학 QR', '입학부터 질문과 졸업까지 이 QR 하나로 끝납니다', '/nfc/1'],
  ['워드클라우드', '스탠바이미 화면', '/words'],
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
        <h2 className="vg-q" style={{ marginTop: 0 }}>QR</h2>
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
      {toast}
    </>
  )
}
