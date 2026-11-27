import { asset } from '../utils/asset'

// 실제 학위기와 졸업증서의 구성을 따른 증서.
// 왼쪽 위 번호, 가운데 위 로고, 큰 제목, 이름, 본문, 날짜, 오른쪽 아래 직인과 총장 표기,
// 위조 방지용 보안 무늬 테두리와 가운데 배경 로고. UIA 로고는 원본 그대로(색과 비율을 바꾸지 않고) 쓴다.
const W = 1080
const H = 1520
const S = 1.5 // 출력 배율. 1620 x 2280 픽셀로 저장한다.
const NAVY = '#1d2f86'
const INK = '#17181c'
const SERIF = "'Noto Serif KR', 'Noto Serif CJK KR', 'Nanum Myeongjo', AppleMyungjo, 'Apple SD Gothic Neo', serif"
const CAPS = "'Cinzel', 'Cormorant Garamond', 'Times New Roman', serif"

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

// 원본 SVG를 있는 그대로 불러온다(색, 모양, 비율 변경 없음).
async function loadLogo() {
  const txt = await (await fetch(asset('/brand/uia-logo-official.svg'))).text()
  const sized = txt.replace('<svg ', '<svg width="1296" height="594" ')
  return loadImage(URL.createObjectURL(new Blob([sized], { type: 'image/svg+xml' })))
}
const LOGO_RATIO = 594 / 1296

// 구글 글꼴에서 증서에 쓰는 글자만 받아 온다. 입학증서와 졸업증서가 같은 글자 묶음을 쓰도록 고정 문구를 한데 모아
// 한 사람당 한 번만 받는다. 입학하기를 누르는 순간 미리 받기 시작하고, 막히면 3.5초 뒤 기기 기본 명조로 그린다.
const FIXED = '입학증서졸업증서위 사람은 UIA 대학교에 입학하여모든 과정을 마쳤으므로 이 증서를 수여함.입학하였으므로 총 장대학임팩트얼라이언스총장인성명소속제호년월일0123456789,.-/·ABCDEFGHIJKLMNOPQRSTUVWXYZ'
function certChars(name = '', aff = '', major = '') {
  return [...new Set(FIXED + String(name).trim() + String(aff || '').trim() + String(major || '').trim())].sort().join('')
}
export function preloadCertFonts(name, aff) {
  const chars = certChars(name, aff)
  const url = 'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500;700;900&family=Cinzel:wght@500;700&display=block&text=' + encodeURIComponent(chars)
  if (!document.querySelector(`link[data-cert-font="${CSS.escape(chars)}"]`)) {
    const l = document.createElement('link')
    l.rel = 'stylesheet'; l.href = url; l.dataset.certFont = chars
    document.head.appendChild(l)
  }
  return chars
}
async function loadFonts(d) {
  const chars = preloadCertFonts(d.name, d.affiliation)
  const specs = ['900 60px "Noto Serif KR"', '700 40px "Noto Serif KR"', '500 30px "Noto Serif KR"', '700 24px "Cinzel"', '500 24px "Cinzel"']
  await Promise.race([
    new Promise((r) => setTimeout(r, 300)).then(() => Promise.all(specs.map((sp) => document.fonts.load(sp, chars)))).catch(() => {}),
    new Promise((r) => setTimeout(r, 3500)),
  ])
}

function drawSpaced(ctx, text, cx, y, gap) {
  const chars = [...text]
  const widths = chars.map((c) => ctx.measureText(c).width)
  const total = widths.reduce((a, b) => a + b, 0) + gap * (chars.length - 1)
  let x = cx - total / 2
  const prev = ctx.textAlign
  ctx.textAlign = 'left'
  chars.forEach((c, i) => { ctx.fillText(c, x, y); x += widths[i] + gap })
  ctx.textAlign = prev
}

function wrapRaw(ctx, text, maxW) {
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
// 줄 수는 그대로 두고 위아래 길이가 비슷해지게 나눈다(마지막 줄에 한 단어만 남지 않게).
function wrapKo(ctx, text, maxW) {
  const base = wrapRaw(ctx, text, maxW)
  if (base.length < 2) return base
  let lo = maxW * 0.4, hi = maxW, best = base
  for (let i = 0; i < 14; i++) {
    const mid = (lo + hi) / 2
    const t = wrapRaw(ctx, text, mid)
    if (t.length <= base.length) { best = t; hi = mid } else lo = mid
  }
  return best
}

// 종이 질감: 은은한 섬유 무늬와 가장자리 어둡기
function paper(ctx) {
  const g = ctx.createLinearGradient(0, 0, W, H)
  g.addColorStop(0, '#fbf7ef'); g.addColorStop(0.5, '#fffdf8'); g.addColorStop(1, '#f6f0e5')
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
  const t = document.createElement('canvas'); t.width = 256; t.height = 256
  const tg = t.getContext('2d'); const id = tg.createImageData(256, 256)
  let seed = 7
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
  for (let i = 0; i < id.data.length; i += 4) { const v = 200 + rnd() * 55; id.data[i] = v; id.data[i + 1] = v - 6; id.data[i + 2] = v - 18; id.data[i + 3] = 255 }
  tg.putImageData(id, 0, 0)
  ctx.save(); ctx.globalAlpha = 0.07; ctx.globalCompositeOperation = 'multiply'
  ctx.fillStyle = ctx.createPattern(t, 'repeat'); ctx.fillRect(0, 0, W, H); ctx.restore()
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.78)
  v.addColorStop(0, 'rgba(120,90,40,0)'); v.addColorStop(1, 'rgba(120,90,40,0.10)')
  ctx.fillStyle = v; ctx.fillRect(0, 0, W, H)
}

// 보안 무늬 로제트: 파형 고리를 겹쳐 그린 기요셰 무늬
function rosette(ctx, cx, cy, R, { rings = 26, petals = 12, amp = 0.16, color = NAVY, alpha = 0.55, lw = 0.7 } = {}) {
  ctx.save(); ctx.strokeStyle = color; ctx.globalAlpha = alpha; ctx.lineWidth = lw
  for (let j = 0; j < rings; j++) {
    const base = R * (0.5 + 0.5 * (j / (rings - 1)))
    ctx.beginPath()
    for (let i = 0; i <= 720; i++) {
      const a = (i / 720) * Math.PI * 2
      const r = base + R * amp * Math.sin(petals * a + (j * Math.PI * 2) / rings * 2) * (0.35 + 0.65 * (j / rings))
      const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a)
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.closePath(); ctx.stroke()
  }
  ctx.restore()
}

// 변을 따라 엮인 파형 띠
function weave(ctx, x0, y0, x1, y1, bandW, { lines = 14, wave = 46, color = NAVY, alpha = 0.5 } = {}) {
  const len = Math.hypot(x1 - x0, y1 - y0)
  const ang = Math.atan2(y1 - y0, x1 - x0)
  ctx.save(); ctx.translate(x0, y0); ctx.rotate(ang)
  ctx.strokeStyle = color; ctx.globalAlpha = alpha; ctx.lineWidth = 0.7
  for (let j = 0; j < lines; j++) {
    ctx.beginPath()
    for (let x = 0; x <= len; x += 2) {
      const y = bandW / 2 + (bandW / 2 - 1.5) * Math.sin((x / wave) * Math.PI * 2 + (j * Math.PI * 2) / lines)
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  ctx.restore()
}

function border(ctx) {
  const m = 36, band = 26
  // 바깥 선
  ctx.save(); ctx.strokeStyle = NAVY; ctx.lineWidth = 2.2; ctx.globalAlpha = 0.9
  ctx.strokeRect(m, m, W - 2 * m, H - 2 * m)
  ctx.lineWidth = 0.9
  ctx.strokeRect(m + band + 6, m + band + 6, W - 2 * (m + band + 6), H - 2 * (m + band + 6))
  ctx.restore()
  // 변마다 파형 띠
  const a = m + 3, b = m + band + 3
  weave(ctx, a + 60, a, W - a - 60, a, band - 6)
  weave(ctx, a + 60, H - b + 3, W - a - 60, H - b + 3, band - 6)
  weave(ctx, a, a + 60, a, H - a - 60, band - 6)
  weave(ctx, W - b + 3, a + 60, W - b + 3, H - a - 60, band - 6)
  // 모서리 로제트
  const c = m + band / 2 + 24
  for (const [x, y] of [[c, c], [W - c, c], [c, H - c], [W - c, H - c]]) {
    ctx.save(); ctx.fillStyle = '#fffdf8'; ctx.beginPath(); ctx.arc(x, y, 56, 0, Math.PI * 2); ctx.fill(); ctx.restore()
    rosette(ctx, x, y, 54, { rings: 22, petals: 10, amp: 0.15, alpha: 0.6 })
    ctx.save(); ctx.strokeStyle = NAVY; ctx.lineWidth = 1.4; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(x, y, 56, 0, Math.PI * 2); ctx.stroke(); ctx.restore()
  }
}

// 가운데 배경: 로제트와 원본 로고를 아주 옅게 깐다
function watermark(ctx, logo) {
  rosette(ctx, W / 2, 800, 330, { rings: 40, petals: 16, amp: 0.1, alpha: 0.085, lw: 0.8 })
  const lw = 560, lh = lw * LOGO_RATIO
  ctx.save(); ctx.globalAlpha = 0.1; ctx.drawImage(logo, W / 2 - lw / 2, 800 - lh / 2, lw, lh); ctx.restore()
}

function arcText(ctx, text, cx, cy, r, centerAngle, top, size) {
  const chars = [...text]
  ctx.font = `700 ${size}px ${CAPS}`
  const ws = chars.map((c) => ctx.measureText(c).width + size * 0.28)
  const total = ws.reduce((a, b) => a + b, 0)
  let ang = centerAngle - (top ? 1 : -1) * 0 - (total / r) / 2 * (top ? 1 : -1) * (top ? 1 : -1)
  ang = top ? centerAngle - total / r / 2 : centerAngle + total / r / 2
  chars.forEach((c, i) => {
    const step = ws[i] / r
    const mid = top ? ang + step / 2 : ang - step / 2
    ctx.save(); ctx.translate(cx + r * Math.cos(mid), cy + r * Math.sin(mid))
    ctx.rotate(top ? mid + Math.PI / 2 : mid - Math.PI / 2)
    ctx.fillText(c, 0, 0); ctx.restore()
    ang += top ? step : -step
  })
}

// 학교 인장: 톱니 가장자리 고리, 둘레 글자, 가운데 원본 로고
function emblem(ctx, cx, cy, R, logo) {
  ctx.save()
  // 톱니 가장자리
  ctx.fillStyle = NAVY; ctx.beginPath()
  const n = 72
  for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2; const r = i % 2 ? R : R * 0.955; i ? ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)) : ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a)) }
  ctx.closePath(); ctx.fill()
  ctx.fillStyle = '#fffdf8'; ctx.beginPath(); ctx.arc(cx, cy, R * 0.9, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = NAVY; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(cx, cy, R * 0.9, 0, Math.PI * 2); ctx.stroke()
  ctx.lineWidth = 0.9; ctx.beginPath(); ctx.arc(cx, cy, R * 0.52, 0, Math.PI * 2); ctx.stroke()
  rosette(ctx, cx, cy, R * 0.5, { rings: 12, petals: 8, amp: 0.1, alpha: 0.35, lw: 0.6 })
  ctx.fillStyle = NAVY; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  arcText(ctx, 'UNIVERSITY IMPACT', cx, cy, R * 0.71, -Math.PI / 2, true, R * 0.13)
  arcText(ctx, 'ALLIANCE  2026', cx, cy, R * 0.74, Math.PI / 2, false, R * 0.13)
  ctx.beginPath(); ctx.arc(cx - R * 0.78, cy, R * 0.035, 0, Math.PI * 2); ctx.arc(cx + R * 0.78, cy, R * 0.035, 0, Math.PI * 2); ctx.fill()
  const lw = R * 0.66, lh = lw * LOGO_RATIO
  ctx.drawImage(logo, cx - lw / 2, cy - lh / 2, lw, lh)
  ctx.restore()
}


// 직인: 굵은 테두리와 가는 안쪽 테두리, 칸에 맞춰 앉힌 굵은 글자, 인주가 살짝 고르지 않은 질감.
// 오른쪽 열부터 세로로 읽는다(대학임팩트 / 얼라이언스 / 총장인).
function drawSeal(ctx, cx, cy, size, angle) {
  const N = 640
  const c = document.createElement('canvas'); c.width = N; c.height = N
  const g = c.getContext('2d')
  let seed = 91
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
  const RED = '#c2171d'
  g.fillStyle = RED; g.strokeStyle = RED

  // 테두리: 굵은 바깥 선과 가는 안쪽 선. 모서리는 둥글게, 선은 거의 곧게.
  const frame = (x0, y0, x1, y1, lw, r) => {
    g.lineWidth = lw; g.lineJoin = 'round'
    g.beginPath()
    g.moveTo(x0 + r, y0); g.lineTo(x1 - r, y0); g.quadraticCurveTo(x1, y0, x1, y0 + r)
    g.lineTo(x1, y1 - r); g.quadraticCurveTo(x1, y1, x1 - r, y1)
    g.lineTo(x0 + r, y1); g.quadraticCurveTo(x0, y1, x0, y1 - r)
    g.lineTo(x0, y0 + r); g.quadraticCurveTo(x0, y0, x0 + r, y0)
    g.closePath(); g.stroke()
  }
  frame(30, 30, N - 30, N - 30, 28, 14)
  frame(74, 74, N - 74, N - 74, 6, 6)

  // 글자: 3열. 오른쪽부터 대학임팩트, 얼라이언스, 총장인(가운데 정렬).
  const cols = [['대', '학', '임', '팩', '트'], ['얼', '라', '이', '언', '스'], ['총', '장', '인']]
  const x0 = 100, x1 = N - 100, y0 = 100, y1 = N - 100
  const colW = (x1 - x0) / 3
  const rowH = (y1 - y0) / 5
  cols.forEach((chars, ci) => {
    const x = x1 - colW * (ci + 0.5)
    const start = (5 - chars.length) / 2
    chars.forEach((ch, ri) => {
      const y = y0 + rowH * (start + ri + 0.5)
      g.save(); g.translate(x, y)
      g.font = `900 ${rowH * 1.0}px 'Noto Serif KR', 'Noto Serif CJK KR', AppleMyungjo, serif`
      g.textAlign = 'center'; g.textBaseline = 'middle'
      g.scale(1.12, 0.97)
      g.lineWidth = 5; g.lineJoin = 'round'
      g.strokeText(ch, 0, 4); g.fillText(ch, 0, 4)
      g.restore()
    })
  })

  // 인주 질감은 가볍게: 작은 점 몇 개와 한쪽이 살짝 옅어지는 눌림
  g.globalCompositeOperation = 'destination-out'
  for (let i = 0; i < 900; i++) {
    const x = rnd() * N, y = rnd() * N, r = 0.5 + rnd() * 1.5
    g.globalAlpha = 0.25 + rnd() * 0.45
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill()
  }
  const wear = g.createLinearGradient(N * 0.05, N, N * 0.95, 0)
  wear.addColorStop(0, 'rgba(0,0,0,0.22)'); wear.addColorStop(0.4, 'rgba(0,0,0,0)'); wear.addColorStop(1, 'rgba(0,0,0,0.08)')
  g.globalAlpha = 1; g.fillStyle = wear; g.fillRect(0, 0, N, N)
  g.globalCompositeOperation = 'source-over'

  ctx.save()
  ctx.translate(cx, cy); ctx.rotate(angle)
  ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.95
  ctx.filter = 'blur(0.3px)'
  ctx.drawImage(c, -size / 2, -size / 2, size, size)
  ctx.restore()
}

// kind: 'admission' | 'graduation'
export async function drawCertificate(kind, d) {
  const grad = kind === 'graduation'
  const title = grad ? '졸업증서' : '입학증서'
  const sub = grad ? 'CERTIFICATE OF GRADUATION' : 'CERTIFICATE OF ADMISSION'
  const numLabel = grad ? `제 ${d.cert_no} 호` : `제 ${d.code} 호`
  const date = kst(grad ? d.graduated_at : d.entered_at)
  const bodyText = grad
    ? '위 사람은 UIA 대학교에 입학하여\n모든 과정을 마쳤으므로 이 증서를 수여함.'
    : '위 사람은 UIA 대학교에 입학하였으므로\n이 증서를 수여함.'
  await loadFonts(d)
  const logo = await loadLogo()

  const c = document.createElement('canvas')
  c.width = W * S; c.height = H * S
  const ctx = c.getContext('2d')
  ctx.scale(S, S)
  ctx.textBaseline = 'alphabetic'

  paper(ctx)
  watermark(ctx, logo)
  border(ctx)

  // 왼쪽 위 번호
  ctx.fillStyle = INK; ctx.textAlign = 'left'
  ctx.font = `500 21px ${SERIF}`
  ctx.fillText(numLabel, 118, 150)

  // 가운데 위 원본 로고와 영문 이름
  const lw = 250, lh = lw * LOGO_RATIO
  ctx.drawImage(logo, W / 2 - lw / 2, 118, lw, lh)
  ctx.textAlign = 'center'; ctx.fillStyle = NAVY
  ctx.font = `700 19px ${CAPS}`
  drawSpaced(ctx, 'UNIVERSITY IMPACT ALLIANCE', W / 2, 118 + lh + 36, 5)

  // 제목
  ctx.fillStyle = INK
  ctx.font = `900 92px ${SERIF}`
  drawSpaced(ctx, title, W / 2, 470, 46)
  ctx.fillStyle = NAVY; ctx.font = `500 19px ${CAPS}`
  drawSpaced(ctx, sub, W / 2, 520, 6)
  // 장식 선
  ctx.strokeStyle = NAVY; ctx.lineWidth = 1; ctx.globalAlpha = 0.8
  ctx.beginPath(); ctx.moveTo(W / 2 - 250, 548); ctx.lineTo(W / 2 - 14, 548); ctx.moveTo(W / 2 + 14, 548); ctx.lineTo(W / 2 + 250, 548); ctx.stroke()
  ctx.globalAlpha = 1; ctx.fillStyle = NAVY
  ctx.beginPath(); ctx.moveTo(W / 2, 541); ctx.lineTo(W / 2 + 7, 548); ctx.lineTo(W / 2, 555); ctx.lineTo(W / 2 - 7, 548); ctx.closePath(); ctx.fill()

  // 이름과 소속
  ctx.fillStyle = INK; ctx.textAlign = 'center'
  let size = 80
  ctx.font = `700 ${size}px ${SERIF}`
  while (ctx.measureText(d.name).width > W - 300 && size > 34) { size -= 2; ctx.font = `700 ${size}px ${SERIF}` }
  const compact = [...d.name].length <= 5
  if (compact) drawSpaced(ctx, d.name, W / 2, 690, 14); else ctx.fillText(d.name, W / 2, 690)
  ctx.strokeStyle = INK; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.7
  ctx.beginPath(); ctx.moveTo(W / 2 - 250, 716); ctx.lineTo(W / 2 + 250, 716); ctx.stroke(); ctx.globalAlpha = 1
  const aff = [d.affiliation, d.major].filter(Boolean).join('  ')
  let yy = 770
  if (aff) {
    ctx.font = `500 32px ${SERIF}`; ctx.fillStyle = '#333'
    wrapKo(ctx, aff, W - 300).forEach((ln, i) => { ctx.fillText(ln, W / 2, 764 + i * 46); yy = 764 + i * 46 })
  }

  // 본문
  ctx.fillStyle = INK; ctx.font = `500 38px ${SERIF}`
  let y = Math.max(yy + 120, 900)
  for (const line of bodyText.split('\n')) { ctx.fillText(line, W / 2, y); y += 68 }

  // 날짜
  y += 54
  ctx.font = `500 36px ${SERIF}`
  ctx.fillText(date, W / 2, y)

  // 왼쪽 아래 학교 인장
  emblem(ctx, 196, 1290, 98, logo)

  // 오른쪽 아래 학교 이름, 총장 표기, 직인
  ctx.textAlign = 'right'; ctx.fillStyle = INK
  ctx.font = `900 50px ${SERIF}`
  ctx.fillText('UIA 대학교', 790, 1282)
  ctx.font = `700 40px ${SERIF}`
  drawSpacedRight(ctx, '총 장', 790, 1342, 18)
  ctx.fillStyle = NAVY; ctx.font = `500 15px ${CAPS}`
  ctx.fillText('UNIVERSITY IMPACT ALLIANCE', 760, 1392)
  drawSeal(ctx, 858, 1314, 184, -0.015)

  return c.toDataURL('image/jpeg', 0.92)
}

function drawSpacedRight(ctx, text, rightX, y, gap) {
  const chars = [...text]
  const widths = chars.map((ch) => ctx.measureText(ch).width)
  const total = widths.reduce((a, b) => a + b, 0) + gap * (chars.length - 1)
  let x = rightX - total
  const prev = ctx.textAlign
  ctx.textAlign = 'left'
  chars.forEach((ch, i) => { ctx.fillText(ch, x, y); x += widths[i] + gap })
  ctx.textAlign = prev
}
