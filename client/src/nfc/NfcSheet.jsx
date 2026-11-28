import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { adminList } from './db'
import { QUESTIONS } from './survey'

const KEY = 'uia-nfc-admin'
const fmt = (iso, withDate) => {
  if (!iso) return ''
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(iso)).map((x) => [x.type, x.value]))
  return (withDate ? `${+p.month}. ${+p.day}. ` : '') + `${p.hour}:${p.minute}`
}
const dayOf = (iso) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date(iso))
const DAYS = [['all', '전체'], ['2026-11-27', '11. 27.'], ['2026-11-28', '11. 28.'], ['2026-11-29', '11. 29.']]

// 열 정의: 머리글, 값, 너비(px)
const COLS = [
  { h: '입학 시각', v: (r) => fmt(r.in, true), w: 110, sort: (r) => r.in },
  { h: '이름', v: (r) => r.name, w: 96 },
  { h: '소속', v: (r) => r.aff, w: 200 },
  { h: '질문', v: (r) => (r.quiz ? '완료' : ''), w: 56 },
  { h: '졸업', v: (r) => (r.grad ? fmt(r.grad) : ''), w: 64, sort: (r) => r.grad || '' },
  { h: '증서 번호', v: (r) => r.cert, w: 140 },
  { h: QUESTIONS[0].label, v: (r) => r.w1, w: 220 },
  { h: QUESTIONS[1].label, v: (r) => r.w2, w: 220 },
  { h: '입학 코드', v: (r) => r.code, w: 84 },
]
const letter = (i) => String.fromCharCode(65 + i)

// 운영자 전체 명단. 구글 시트처럼 행 번호와 열 문자, 격자 칸으로 보여 준다.
export default function NfcSheet() {
  const pass = (() => { try { return sessionStorage.getItem(KEY) || '' } catch { return '' } })()
  const [rows, setRows] = useState(null)
  const [err, setErr] = useState('')
  const [day, setDay] = useState('all')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState({ c: 0, dir: 1 })
  const [sel, setSel] = useState(null)

  const load = useCallback(async () => {
    try { const r = await adminList(pass); if (r) { setRows(r); setErr('') } else setErr('비밀번호를 다시 넣어 주세요.') } catch { setErr('연결이 끊겼어요. 잠시 뒤 다시 불러옵니다.') }
  }, [pass])

  useEffect(() => {
    document.title = '방문객 명단 | UIA 대학교'
    if (!pass) return undefined
    load()
    const t = setInterval(() => { if (!document.hidden) load() }, 15000)
    return () => clearInterval(t)
  }, [pass, load])

  const view = useMemo(() => {
    if (!rows) return []
    const k = q.trim().toLowerCase()
    const col = COLS[sort.c]
    const key = col.sort || col.v
    return rows
      .filter((r) => day === 'all' || dayOf(r.in) === day)
      .filter((r) => !k || COLS.some((c) => String(c.v(r)).toLowerCase().includes(k)))
      .slice()
      .sort((a, b) => { const x = key(a), y = key(b); return (x > y ? 1 : x < y ? -1 : 0) * sort.dir })
  }, [rows, day, q, sort])

  const csv = () => {
    const esc = (s) => '"' + String(s).replace(/"/g, '""') + '"'
    const text = '\uFEFF' + COLS.map((c) => esc(c.h)).join(',') + '\n' + view.map((r) => COLS.map((c) => esc(c.v(r))).join(',')).join('\n') + '\n'
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }))
    a.download = 'UIA_방문객명단_' + (day === 'all' ? '전체' : day.slice(5).replace('-', '')) + '.csv'
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000)
  }

  if (!pass) return <Navigate to="/nfc/admin" replace />

  const done = view.filter((r) => r.grad).length
  const selVal = sel ? COLS[sel.c].v(view[sel.r] || {}) : ''

  return (
    <div className="sh-root">
      <header className="sh-top">
        <Link to="/nfc/admin" className="sh-back" aria-label="운영자 화면으로">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </Link>
        <h1 className="sh-title">방문객 명단</h1>
        <input className="sh-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="이름, 소속, 단어 찾기" />
        <button type="button" className="sh-btn" onClick={csv} disabled={!view.length}>CSV 받기</button>
      </header>
      <div className="sh-bar">
        <span className="sh-cellname">{sel ? letter(sel.c) + (sel.r + 2) : ''}</span>
        <span className="sh-fx">fx</span>
        <span className="sh-val">{selVal}</span>
      </div>
      {err ? <p className="sh-err">{err}</p> : null}
      <div className="sh-scroll">
        <table className="sh-grid">
          <colgroup><col style={{ width: 46 }} />{COLS.map((c, i) => <col key={i} style={{ width: c.w }} />)}</colgroup>
          <thead>
            <tr className="sh-letters"><th className="sh-corner" />{COLS.map((c, i) => <th key={i} className={sel && sel.c === i ? 'is-sel' : ''}>{letter(i)}</th>)}</tr>
            <tr className="sh-head">
              <th className="sh-num">1</th>
              {COLS.map((c, i) => (
                <th key={i} onClick={() => setSort((s) => ({ c: i, dir: s.c === i ? -s.dir : 1 }))}>
                  {c.h}{sort.c === i ? <span className="sh-sort">{sort.dir > 0 ? '▲' : '▼'}</span> : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {view.map((r, ri) => (
              <tr key={r.id}>
                <th className={'sh-num' + (sel && sel.r === ri ? ' is-sel' : '')}>{ri + 2}</th>
                {COLS.map((c, ci) => (
                  <td key={ci} className={sel && sel.r === ri && sel.c === ci ? 'is-sel' : ''} onClick={() => setSel({ r: ri, c: ci })}>{c.v(r)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {rows && !view.length ? <p className="sh-empty">맞는 행이 없어요.</p> : null}
        {!rows && !err ? <p className="sh-empty">불러오는 중이에요.</p> : null}
      </div>
      <footer className="sh-tabs">
        {DAYS.map(([id, label]) => <button key={id} type="button" className={'sh-tab' + (day === id ? ' is-on' : '')} onClick={() => { setDay(id); setSel(null) }}>{label}</button>)}
        <span className="sh-count">{view.length}명  졸업 {done}명</span>
      </footer>
    </div>
  )
}
