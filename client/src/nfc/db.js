import { neon } from '@neondatabase/serverless'
import { NFC_DB_URL } from './dbConfig'

let sql
const client = () => (sql ||= neon(NFC_DB_URL))

// 행사장 와이파이가 흔들려도 한 번은 다시 시도한다.
async function call(text, params) {
  let last
  for (let i = 0; i < 2; i++) {
    try {
      return await client().query(text, params)
    } catch (e) {
      last = e
      await new Promise((r) => setTimeout(r, 600))
    }
  }
  const err = new Error('network')
  err.cause = last
  throw err
}

export async function enroll({ name, affiliation }) {
  const rows = await call('select * from nfc_enroll($1,$2,$3,$4)', [name, affiliation || null, null, null])
  return rows[0]
}

export async function findByCode(code) {
  const rows = await call('select nfc_find($1) as id', [String(code || '').trim()])
  return rows[0] && rows[0].id
}

export async function getVisitor(id) {
  const rows = await call('select * from nfc_get($1::uuid)', [id])
  return rows[0] || null
}

// words 예: { 0: ['연결'], 1: ['청년', '일자리'] }
export async function saveSurvey(id, words) {
  const rows = await call('select nfc_survey2($1::uuid,$2::jsonb) as r', [id, JSON.stringify(words)])
  const r = rows[0] && rows[0].r
  if (!r || !r.ok) throw new Error('rejected')
  return r.words || {}
}

export async function graduate(id) {
  const rows = await call('select * from nfc_graduate($1::uuid)', [id])
  return rows[0] || null
}

export async function getShare(token) {
  const rows = await call('select * from nfc_share($1)', [token])
  return rows[0] || null
}

export async function getWords() {
  const rows = await call('select nfc_words2() as r', [])
  return rows[0].r
}

export async function getChoices() {
  const rows = await call('select nfc_choices() as r', [])
  return rows[0].r
}

export async function adminStats(pass) {
  const rows = await call('select nfc_admin_stats($1) as r', [pass])
  return rows[0].r
}
export async function adminWords(pass) {
  const rows = await call('select nfc_admin_words($1) as r', [pass])
  return rows[0].r
}
export async function adminHide(pass, word, hide) {
  const rows = await call('select nfc_admin_hide($1,$2,$3) as ok', [pass, word, hide])
  return !!rows[0].ok
}
export async function adminSetPass(oldPass, newPass) {
  const rows = await call('select nfc_admin_setpass($1,$2) as ok', [oldPass, newPass])
  return !!rows[0].ok
}
export async function adminFind(pass, q) {
  const rows = await call('select nfc_admin_find($1,$2) as r', [pass, q])
  return rows[0].r
}
export async function adminDraw(pass, id, done) {
  const rows = await call('select nfc_admin_draw($1,$2::uuid,$3) as ok', [pass, id, done])
  return !!rows[0].ok
}
