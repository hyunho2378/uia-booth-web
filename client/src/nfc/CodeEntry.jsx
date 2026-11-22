import { useState } from 'react'
import { Card, Btn, BtnLink, Ko } from './ui'

// 휴대폰이 달라 입학 기록이 없을 때 입학 코드로 이어간다.
export default function CodeEntry({ onAttach }) {
  const [code, setCode] = useState('')
  const [bad, setBad] = useState(false)
  const [busy, setBusy] = useState(false)
  const submit = async () => {
    if (busy) return
    setBad(false); setBusy(true)
    const ok = await onAttach(code)
    setBusy(false)
    if (!ok) setBad(true)
  }
  return (
    <>
      <Card>
        <h1 className="vg-q" style={{ marginTop: 0 }}><Ko>입학 확인이 필요해요</Ko></h1>
        <p className="vg-body"><Ko>이 휴대폰에서 입학 기록을 찾지 못했어요. 입학증서에 적힌 코드를 입력하거나 1번 NFC에서 입학해 주세요.</Ko></p>
        <label className="vg-field">
          <span>입학 코드</span>
          <input className="vg-input" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={6} autoCapitalize="characters" autoComplete="off" placeholder="예: AB3K9X" />
        </label>
        {bad ? <p className="vg-err">코드를 찾지 못했어요. 다시 확인해 주세요.</p> : null}
      </Card>
      <div className="vg-dock" style={{ position: 'static' }}>
        <Btn disabled={code.length < 6 || busy} onClick={submit}>{busy ? '확인하는 중' : '코드로 이어가기'}</Btn>
        <BtnLink to="/nfc/1">입학하러 가기</BtnLink>
      </div>
    </>
  )
}
