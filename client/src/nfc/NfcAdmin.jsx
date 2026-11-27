import { useCallback, useEffect, useState } from 'react'
import { Screen, Card, Btn, useToast } from './ui'
import { adminStats, adminWords, adminHide, adminSetPass, adminFind, adminForce } from './db'
import { QUESTIONS } from './survey'
import NfcGuide from './NfcGuide'

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
    } catch { setErr('연결이 끊겼어요.'); return false }
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
  const search = async () => { try { setFound(await adminFind(pass, find)) } catch { show('연결이 끊겼어요') } }
  const force = async (r) => { await adminForce(pass, r.id); setFound(await adminFind(pass, find)); load(pass) }
  const toggle = async (w) => { await adminHide(pass, w.word, !w.hidden); load(pass) }
  const change = async () => {
    if (np.length < 4) { show('4자 이상으로 적어 주세요'); return }
    if (await adminSetPass(pass, np)) { try { sessionStorage.setItem(KEY, np) } catch { /* 무시 */ } setPass(np); setNp(''); show('바꿨어요') } else show('바꾸지 못했어요')
  }

  if (!pass) {
    return (
      <Screen title="운영자" dock={<Btn disabled={!input} onClick={login}>들어가기</Btn>}>
        <Card logo>
          <h1 className="vg-q" style={{ marginTop: 0 }}>운영자</h1>
          <label className="vg-field"><span>비밀번호</span><input className="vg-input" type="password" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') login() }} autoComplete="current-password" /></label>
          {err ? <p className="vg-err">{err}</p> : null}
        </Card>
      </Screen>
    )
  }
  if (!stats) return <Screen title="운영자"><Card><p className="vg-body" style={{ marginTop: 0 }}>{err || '불러오는 중이에요.'}</p></Card></Screen>

  const status = (r) => (r.graduated ? '졸업' : r.surveyed ? '질문 완료' : '입학') + ' ' + hhmm(r.at)
  const grouped = QUESTIONS.map((q, n) => ({ q, n, rows: words.filter((w) => w.q === n) }))

  return (
    <Screen title="운영자" wide>
      <Card logo>
        <h2 className="vg-q" style={{ marginTop: 0 }}>현황</h2>
        <div className="vg-stats">
          <div className="vg-stat"><b>{stats.enrolled}</b><span>입학</span></div>
          <div className="vg-stat"><b>{stats.surveyed}</b><span>질문</span></div>
          <div className="vg-stat"><b>{stats.graduated}</b><span>졸업</span></div>
        </div>
        <ul className="vg-list">
          {(stats.recent || []).slice(0, 5).map((r, n) => (
            <li key={n} className="vg-row"><span>{r.name}{r.affiliation ? <><br /><small>{r.affiliation}</small></> : null}</span><small>{status(r)}</small></li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="vg-q" style={{ marginTop: 0 }}>방문객 찾기</h2>
        <label className="vg-field"><span>이름 또는 입학 코드</span><input className="vg-input" value={find} onChange={(e) => setFind(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') search() }} /></label>
        <div style={{ marginTop: 14 }}><Btn disabled={find.trim().length < 2} onClick={search}>찾기</Btn></div>
        {found ? (
          <ul className="vg-list">
            {found.length === 0 ? <li className="vg-row">찾지 못했어요.</li> : found.map((r) => (
              <li key={r.id} className="vg-row">
                <span>{r.name}{r.affiliation ? <><br /><small>{r.affiliation}</small></> : null}<br /><small>{r.graduated ? r.cert_no : r.surveyed ? '졸업 전' : '질문 전'}</small></span>
                {r.graduated ? null : <button type="button" className="vg-mini" onClick={() => force(r)}>졸업 처리</button>}
              </li>
            ))}
          </ul>
        ) : null}
      </Card>
      <NfcGuide />
      {toast}
    </Screen>
  )
}
