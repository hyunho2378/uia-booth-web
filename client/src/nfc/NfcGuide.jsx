import NfcShell from './NfcShell'

// 운영자용 안내: NFC 태그에 쓸 주소 세 개
export default function NfcGuide() {
  const base = window.location.origin + (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  const rows = [
    ['1번 입학', '이름과 소속을 입력하면 입학증서가 나옵니다. 1팀 운영.', base + '/nfc/1'],
    ['2번 설문', '객관식 두 문항에 답하고 UIA 하면 떠오르는 단어를 남깁니다. 단어는 사이트 Words 화면에 실시간으로 나타납니다. 1팀 운영.', base + '/nfc/2'],
    ['3번 졸업', '2팀 체험이 끝난 뒤 대면 입학 정보와 설문 완료 기록으로 졸업증서가 나옵니다.', base + '/nfc/3'],
  ]
  return (
    <NfcShell title="NFC 주소">
      <h1>NFC 태그 주소</h1>
      <p className="nfc-lead">태그마다 아래 주소를 URL 레코드로 씁니다.</p>
      <ul className="nfc-list" style={{ padding: 0 }}>
        {rows.map(([t, d, u]) => (
          <li key={u}><b>{t}</b><br />{d}<code>{u}</code></li>
        ))}
      </ul>
    </NfcShell>
  )
}
