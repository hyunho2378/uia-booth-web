import { neon } from '@neondatabase/serverless'
import { NFC_DB_URL } from './dbConfig'

let sql
const client = () => (sql ||= neon(NFC_DB_URL))

async function call(text, params) {
  try {
    return await client().query(text, params)
  } catch (e) {
    const err = new Error('network')
    err.cause = e
    throw err
  }
}

export async function enroll({ name, affiliation, major, wish }) {
  const rows = await call('select * from nfc_enroll($1,$2,$3,$4)', [name, affiliation || null, major || null, wish || null])
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

export async function saveSurvey(id, answers, words) {
  const rows = await call('select nfc_survey($1::uuid,$2::jsonb,$3::text[]) as r', [id, JSON.stringify(answers), words])
  const r = rows[0] && rows[0].r
  if (!r || !r.ok) throw new Error('rejected')
  return r.words || []
}

export async function graduate(id) {
  const rows = await call('select * from nfc_graduate($1::uuid)', [id])
  return rows[0] || null
}

export async function getWords() {
  const rows = await call('select nfc_words() as r', [])
  return rows[0].r
}

export async function getChoices() {
  const rows = await call('select nfc_choices() as r', [])
  return rows[0].r
}
