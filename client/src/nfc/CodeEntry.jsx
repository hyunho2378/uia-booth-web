import { useState } from 'react'
import { Link } from 'react-router-dom'

// 휴대폰이 달라져 입학 정보를 찾지 못했을 때 입학 코드로 이어간다.
export default function CodeEntry({ onAttach, message }) {
  const [code, setCode] = useState('')
  const [bad, setBad] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    setBad(false)
    const ok = await onAttach(code)
    if (!ok) setBad(true)
  }
  return (
    <div>
      <h1>입학 확인이 필요합니다</h1>
      <p className="nfc-lead">{message || '이 휴대폰에서 입학 기록을 찾지 못했습니다. 입학증에 적힌 코드를 입력하거나 1번 NFC에서 입학해 주세요.'}</p>
      <form className="nfc-form" onSubmit={submit}>
        <div className="nfc-field">
          <label htmlFor="code">입학 코드</label>
          <input id="code" className="nfc-input" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={6} autoCapitalize="characters" autoComplete="off" placeholder="예: AB3K9X" />
        </div>
        {bad && <p className="nfc-err">코드를 찾지 못했습니다. 다시 확인해 주세요.</p>}
        <button className="nfc-btn" type="submit" disabled={code.length < 6}>코드로 이어가기</button>
      </form>
      <div className="nfc-actions">
        <Link to="/nfc/1" className="nfc-btn soft" style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}>입학하러 가기</Link>
      </div>
    </div>
  )
}
