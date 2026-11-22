import { useCallback, useEffect, useState } from 'react'
import { Screen, Card, Btn, Ko, useToast } from './ui'
import { adminStats, adminWords, adminHide, adminSetPass, adminFind, adminDraw } from './db'
import { QUESTIONS } from './survey'

const KEY = 'uia-nfc-admin'
const hhmm = (iso) => new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(iso))

// 운영자 화면. 비밀번호를 아는 사람만 현황을 보고 부적절한 단어를 가린다.
export default function NfcAdmin() {
  const [pass, setPass] = useState(() => { try { return sessionStorage.getItem(KEY) || '' } catch { return '' } })
  const [input, setInput] = useState('')
  const [stats, setStats] = useState(null)
  const [words, setWords] = useState([])
  const [err, setErr] = useState('')
  const [np, setNp] = useState('')
  const [find, setFind] = useState('')
  const [found, setFound] = useState(null)
  const [toast, show] = useToast()

  const load = useCallback(async (p) => {
    try {
      const s = await adminStats(p)
      if (!s) { setErr('비밀번호가 맞지 않거나 잠시 잠겼어요.'); setStats(null); try { sessionStorage.removeItem(KEY) } catch { /* 무시 */ } setPass(''); return false }
      setStats(s); setWords((await adminWords(p)) || []); setErr('')
      return true
    } catch { setErr('연결이 원활하지 않아요.'); return false }
  }, [])

  useEffect(() => {
    if (!pass) return undefined
    load(pass)
    const t = setInterval(() => { if (!document.hidden) load(pass) }, 5000)
    return () => clearInterval(t)
  }, [pass, load])

  const login = async () => {
    if (await load(input)) { try { sessionStorage.setItem(KEY, input) } catch { /* 무시 */ } setPass(input); setInput('') }
  }
  const search = async () => { try { setFound(await adminFind(pass, find)) } catch { show('연결이 원활하지 않아요') } }
  const mark = async (r) => { await adminDraw(pass, r.id, !r.draw_at); setFound(await adminFind(pass, find)); load(pass) }
  const toggle = async (w) => { await adminHide(pass, w.word, !w.hidden); load(pass) }
  const change = async () => {
    if (np.length < 4) { show('4자 이상으로 적어 주세요'); return }
    if (await adminSetPass(pass, np)) { try { sessionStorage.setItem(KEY, np) } catch { /* 무시 */ } setPass(np); setNp(''); show('비밀번호를 바꿨어요') } else show('바꾸지 못했어요')
  }

  if (!pass || !stats) {
    return (
      <Screen title="운영자" dock={<Btn disabled={!input} onClick={login}>들어가기</Btn>}>
        <Card>
          <h1 className="vg-q" style={{ marginTop: 0 }}><Ko>운영자 화면</Ko></h1>
          <label className="vg-field"><span>비밀번호</span><input className="vg-input" type="password" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') login() }} autoComplete="current-password" /></label>
          {err ? <p className="vg-err">{err}</p> : null}
        </Card>
      </Screen>
    )
  }

  return (
    <Screen title="운영자" wide>
      <Card>
        <h1 className="vg-q" style={{ marginTop: 0 }}>현황</h1>
        <div className="vg-stats">
          <div className="vg-stat"><b>{stats.enrolled}</b><span>입학</span></div>
          <div className="vg-stat"><b>{stats.surveyed}</b><span>설문</span></div>
          <div className="vg-stat"><b>{stats.graduated}</b><span>졸업</span></div>
          <div className="vg-stat"><b>{stats.drawn}</b><span>럭키드로우</span></div>
        </div>
        <ul className="vg-list">
          {stats.recent.map((r, i) => (
            <li key={i} className="vg-row"><span>{r.name}{r.affiliation ? `, ${r.affiliation}` : ''}</span><small>{r.graduated ? '졸업' : r.surveyed ? '설문 완료' : '입학'} {hhmm(r.at)}</small></li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="vg-q" style={{ marginTop: 0 }}>럭키드로우 확인</h2>
        <p className="vg-body"><Ko>이름이나 입학 코드, 증서 번호 끝자리로 찾아서 추첨을 마친 사람에게 표시해요.</Ko></p>
        <label className="vg-field"><span>이름, 코드, 번호</span><input className="vg-input" value={find} onChange={(e) => setFind(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') search() }} /></label>
        <div style={{ marginTop: 14 }}><Btn disabled={find.trim().length < 2} onClick={search}>찾기</Btn></div>
        {found ? (
          <ul className="vg-list">
            {found.length === 0 ? <li className="vg-row">찾지 못했어요.</li> : found.map((r) => (
              <li key={r.id} className="vg-row"><span>{r.name}{r.affiliation ? `, ${r.affiliation}` : ''}<br /><small>{r.graduated ? r.cert_no : '졸업 전'}</small></span><button type="button" className={'vg-mini' + (r.draw_at ? ' off' : '')} onClick={() => mark(r)}>{r.draw_at ? '표시 취소' : '추첨 완료'}</button></li>
            ))}
          </ul>
        ) : null}
      </Card>
      <Card>
        <h2 className="vg-q" style={{ marginTop: 0 }}>단어 관리</h2>
        <p className="vg-body"><Ko>가린 단어는 워드클라우드에서 바로 빠지고, 같은 단어는 앞으로도 받지 않아요.</Ko></p>
        <ul className="vg-list">
          {words.length === 0 ? <li className="vg-row">아직 단어가 없어요.</li> : words.map((w) => (
            <li key={w.q + w.word} className="vg-row"><span>{w.word} <small>{w.count}, {QUESTIONS[w.q] ? QUESTIONS[w.q].label : ''}</small></span><button type="button" className={'vg-mini' + (w.hidden ? ' off' : '')} onClick={() => toggle(w)}>{w.hidden ? '다시 보이기' : '가리기'}</button></li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="vg-q" style={{ marginTop: 0 }}>비밀번호 바꾸기</h2>
        <label className="vg-field"><span>새 비밀번호 (4자 이상)</span><input className="vg-input" type="password" value={np} onChange={(e) => setNp(e.target.value)} autoComplete="new-password" /></label>
        <div style={{ marginTop: 14 }}><Btn disabled={np.length < 4} onClick={change}>바꾸기</Btn></div>
      </Card>
      {toast}
    </Screen>
  )
}
