import { asset } from '../utils/asset'

// 학위증 양식을 따른 증서: 흰 종이, 가운데 위 문장, 왼쪽 위 번호, 오른쪽 아래 학교 이름과 붉은 직인
const W = 1080
const H = 1520
const FONT = "'Pretendard Variable', Pretendard, sans-serif"
const NAVY = '#1c3f94'

const kst = (iso) => {
  const d = iso ? new Date(iso) : new Date()
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Seoul', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(d)
  const g = (t) => p.find((x) => x.type === t)?.value
  return `${g('year')}년 ${Number(g('month'))}월 ${Number(g('day'))}일`
}

async function loadImage(url) {
  const img = new Image()
  img.src = url
  await img.decode()
  return img
}

async function loadLogo() {
  const txt = await (await fetch(asset('/brand/uia-logo-official.svg'))).text()
  const sized = txt.replace('<svg ', '<svg width="864" height="396" ')
  return loadImage(URL.createObjectURL(new Blob([sized], { type: 'image/svg+xml' })))
}

// 로고를 한 가지 색으로 칠한 복사본
function tint(img, color) {
  const c = document.createElement('canvas')
  c.width = img.naturalWidth || 864
  c.height = img.naturalHeight || 396
  const g = c.getContext('2d')
  g.drawImage(img, 0, 0, c.width, c.height)
  g.globalCompositeOperation = 'source-in'
  g.fillStyle = color
  g.fillRect(0, 0, c.width, c.height)
  return c
}

const spaced = (s) => String(s).split('').join(' ')

function wrapKo(ctx, text, maxW) {
  const words = String(text).split(/\s+/).filter(Boolean)
  const lines = []
  let line = ''
  for (const w of words) {
    const t = line ? line + ' ' + w : w
    if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w } else line = t
  }
  if (line) lines.push(line)
  return lines
}

// 위쪽 호: 왼쪽에서 오른쪽으로 읽힘
function arcTop(ctx, text, cx, cy, r, span) {
  const chars = [...text]
  const step = span / (chars.length - 1)
  chars.forEach((ch, i) => {
    const a = -Math.PI / 2 - span / 2 + step * i
    ctx.save()
    ctx.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
    ctx.rotate(a + Math.PI / 2)
    ctx.fillText(ch, 0, 0)
    ctx.restore()
  })
}

// 아래쪽 호: 글자가 서 있도록 왼쪽에서 오른쪽으로 읽힘
function arcBottom(ctx, text, cx, cy, r, span) {
  const chars = [...text]
  const step = span / (chars.length - 1)
  chars.forEach((ch, i) => {
    const a = Math.PI / 2 + span / 2 - step * i
    ctx.save()
    ctx.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
    ctx.rotate(a - Math.PI / 2)
    ctx.fillText(ch, 0, 0)
    ctx.restore()
  })
}

function star(ctx, x, y, R) {
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const r = i % 2 === 0 ? R : R * 0.42
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r)
  }
  ctx.closePath()
  ctx.fill()
}

// 한림대 디지털인문예술전공 운영위원회 로고(LUCID) 양식: 검은 원, 겹줄 테두리, 위아래 둘레 영문, 가운데 굵은 로고
function crest(ctx, logoWhite, cx, cy, R) {
  ctx.save()
  ctx.fillStyle = '#0b0b0b'
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = R * 0.03
  ctx.beginPath(); ctx.arc(cx, cy, R * 0.955, 0, Math.PI * 2); ctx.stroke()
  ctx.lineWidth = R * 0.011
  ctx.beginPath(); ctx.arc(cx, cy, R * 0.905, 0, Math.PI * 2); ctx.stroke()
  // 글자 안쪽의 얇은 겹호
  ctx.lineWidth = R * 0.01
  for (const rr of [0.6, 0.575]) {
    ctx.beginPath(); ctx.arc(cx, cy, R * rr, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke()
    ctx.beginPath(); ctx.arc(cx, cy, R * rr, Math.PI * 0.1, Math.PI * 0.9); ctx.stroke()
  }
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.font = `800 ${R * 0.15}px ${FONT}`
  arcTop(ctx, 'UNIVERSITY IMPACT', cx, cy, R * 0.755, Math.PI * 0.86)
  arcBottom(ctx, 'ALLIANCE EST 2026', cx, cy, R * 0.765, Math.PI * 0.84)
  const lw = R * 0.92
  const lh = (lw * 396) / 864
  ctx.drawImage(logoWhite, cx - lw / 2, cy - lh / 2, lw, lh)
  ctx.restore()
}

// kind: 'admission' | 'graduation'
export async function drawCertificate(kind, d) {
  const grad = kind === 'graduation'
  const title = grad ? '졸 업 증 서' : '입 학 증 서'
  const total = d.quiz_total || 5
  const numLabel = grad ? `제 ${d.cert_no}호` : `제 ${d.code}호`
  const date = kst(grad ? d.graduated_at : d.entered_at)
  const bodyText = grad
    ? `위 사람은 UIA 대학교 소정의 전 과정을 이수하고 퀴즈 평가에서 ${d.quiz_score}/${total}점을 얻었으므로 이를 인정하여 졸업증서를 수여함.`
    : '위 사람은 UIA 대학교의 입학 자격을 얻었으므로 이를 인정하여 입학증서를 수여함.'

  const rows = grad
    ? [['과 정 명', '4C 과정'], ['입 학 일', kst(d.entered_at)], ['퀴즈점수', `${d.quiz_score}/${total}`], ['증서번호', d.cert_no]]
    : [['입 학 일', kst(d.entered_at)], ['입학코드', d.code]]
  const rowsUse = rows.filter((r) => r[1])

  const sample = [title, d.name, numLabel, date, bodyText, d.wish || '', ...rowsUse.flat(), 'UIA 대학교', 'UIA UNIVERSITY', 'IMPACT ALLIANCE', '0123456789가나다라마바사'].join('')
  await Promise.all([
    document.fonts.load(`800 60px ${FONT}`, sample),
    document.fonts.load(`700 30px ${FONT}`, sample),
    document.fonts.load(`600 30px ${FONT}`, sample),
  ])
  const [logo, seal] = await Promise.all([loadLogo(), loadImage(asset('/nfc/seal.jpg'))])
  const logoWhite = tint(logo, '#ffffff')

  const c = document.createElement('canvas')
  c.width = W; c.height = H
  const ctx = c.getContext('2d')

  // 종이
  const paper = ctx.createLinearGradient(0, 0, W, H)
  paper.addColorStop(0, '#f6f2f0'); paper.addColorStop(0.5, '#fbf9f8'); paper.addColorStop(1, '#efe9e6')
  ctx.fillStyle = paper; ctx.fillRect(0, 0, W, H)

  // 가운데 배경 문장(희미하게)
  ctx.save(); ctx.globalAlpha = 0.07
  crest(ctx, logoWhite, W / 2, 800, 330)
  ctx.restore()

  const ink = '#1b1b1b'
  ctx.fillStyle = ink
  ctx.textBaseline = 'alphabetic'

  // 왼쪽 위 번호, 가운데 위 학교 문장
  ctx.textAlign = 'left'
  ctx.font = `600 26px ${FONT}`
  ctx.fillText(numLabel, 120, 150)
  crest(ctx, logoWhite, W / 2, 200, 112)

  // 제목
  ctx.textAlign = 'center'
  ctx.font = `800 64px ${FONT}`
  ctx.fillText(title, W / 2, 470)

  // 이름과 날짜
  ctx.textAlign = 'left'
  const X = 150
  let size = 48
  ctx.font = `800 ${size}px ${FONT}`
  while (ctx.measureText(d.name).width > W - 2 * X && size > 28) { size -= 2; ctx.font = `800 ${size}px ${FONT}` }
  ctx.fillText(d.name, X, 560)
  ctx.font = `600 32px ${FONT}`
  ctx.fillText([d.affiliation, d.major].filter(Boolean).join('  ') || `입학일 ${kst(d.entered_at)}`, X, 612)

  // 본문
  ctx.font = `700 38px ${FONT}`
  let y = 722
  for (const line of wrapKo(ctx, bodyText, W - 2 * X - 20)) { ctx.fillText(line, X + 10, y); y += 60 }

  // 세부 항목
  y += 40
  ctx.font = `600 30px ${FONT}`
  for (const [k, v] of rowsUse) {
    ctx.fillText(`${k} : ${v}`, X + 50, y); y += 48
  }
  if (d.wish) {
    const lab = '다    짐 : '
    ctx.fillText(lab, X + 50, y)
    const off = ctx.measureText(lab).width
    const lines = wrapKo(ctx, d.wish, W - 2 * X - 50 - off)
    lines.forEach((ln, i) => ctx.fillText(ln, X + 50 + off, y + i * 44))
    y += lines.length * 44 + 4
  }

  // 날짜
  y += 40
  ctx.font = `600 32px ${FONT}`
  ctx.fillText(date, X + 90, y)

  // 오른쪽 아래 학교 이름과 직인
  ctx.textAlign = 'right'
  ctx.font = `800 64px ${FONT}`
  ctx.fillText('UIA 대학교', 810, 1330)
  ctx.font = `600 24px ${FONT}`
  ctx.fillStyle = '#3c3c3c'
  ctx.fillText('UIA UNIVERSITY  |  IMPACT ALLIANCE', 810, 1376)
  ctx.save()
  ctx.globalCompositeOperation = 'multiply'
  ctx.translate(890, 1285); ctx.rotate(-0.04)
  ctx.drawImage(seal, -86, -86, 172, 172)
  ctx.restore()

  return c.toDataURL('image/png')
}
