import { asset } from '../utils/asset'

const W = 1080
const H = 1520
const FONT = "'Pretendard Variable', Pretendard, sans-serif"

const kst = (iso) => {
  const d = iso ? new Date(iso) : new Date()
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Seoul', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(d)
  const g = (t) => p.find((x) => x.type === t)?.value
  const hh = g('hour') === '24' ? '00' : g('hour')
  return { date: `${g('year')}년 ${Number(g('month'))}월 ${Number(g('day'))}일`, time: `${hh}시 ${g('minute')}분` }
}

async function loadLogo() {
  const txt = await (await fetch(asset('/brand/uia-logo-official.svg'))).text()
  const sized = txt.replace('<svg ', '<svg width="864" height="396" ')
  const url = URL.createObjectURL(new Blob([sized], { type: 'image/svg+xml' }))
  const img = new Image()
  img.src = url
  await img.decode()
  return img
}

function wrap(ctx, text, maxW) {
  const words = String(text).split(' ')
  const lines = []
  let line = ''
  for (const w of words) {
    const t = line ? line + ' ' + w : w
    if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w } else line = t
  }
  if (line) lines.push(line)
  return lines
}

function orb(ctx, x, y, r, c1, c2) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, c1)
  g.addColorStop(1, c2)
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}

// kind: 'admission' | 'graduation'
export async function drawCertificate(kind, d) {
  const grad = kind === 'graduation'
  const when = kst(grad ? d.graduated_at : d.entered_at)
  const title = grad ? '졸업증서' : '입학증서'
  const total = d.quiz_total || 5
  const body = grad
    ? [
        `위 사람은 UIA 대학교에서 입학하여 4C 과정을 마치고 퀴즈 ${d.quiz_score}/${total}점으로 과정을 수료하였으므로 이 증서를 수여합니다.`,
      ]
    : [
        'UIA 대학교에 입학을 허가합니다. 대학의 경계를 넘어 함께 배우고 함께 만드는 과정에 참여해 주셔서 감사합니다.',
      ]
  const meta = [d.affiliation, d.major].filter(Boolean).join('  ')
  const numLabel = grad ? `제 ${d.cert_no} 호` : `입학 코드 ${d.code}`

  const texts = [title, d.name, meta, numLabel, ...body, d.wish || '', when.date, when.time, 'UIA 대학교 총장', 'University Impact Alliance', '대학 임팩트 얼라이언스']
  const sample = texts.join('') + '0123456789UIA대학교총장성명소속전공다짐'
  await Promise.all([
    document.fonts.load(`800 60px ${FONT}`, sample),
    document.fonts.load(`500 30px ${FONT}`, sample),
    document.fonts.load(`700 30px ${FONT}`, sample),
  ])
  const logo = await loadLogo()

  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')

  // 종이와 번진 구체 장식
  ctx.fillStyle = '#f7f5ef'
  ctx.fillRect(0, 0, W, H)
  ctx.save()
  ctx.globalAlpha = 0.5
  orb(ctx, 90, 120, 360, 'rgba(45,158,217,.55)', 'rgba(45,158,217,0)')
  orb(ctx, 1010, 260, 320, 'rgba(233,69,69,.42)', 'rgba(233,69,69,0)')
  orb(ctx, 140, 1420, 380, 'rgba(253,197,27,.55)', 'rgba(253,197,27,0)')
  orb(ctx, 980, 1400, 300, 'rgba(45,158,217,.4)', 'rgba(45,158,217,0)')
  ctx.restore()

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#212120'

  // 로고
  const lw = 330
  const lh = (lw * 396) / 864
  ctx.drawImage(logo, (W - lw) / 2, 96, lw, lh)
  ctx.font = `600 26px ${FONT}`
  ctx.fillStyle = '#3c3c3c'
  ctx.fillText('UIA 대학교  |  University Impact Alliance', W / 2, 96 + lh + 52)

  // 제목
  ctx.fillStyle = '#212120'
  ctx.font = `800 138px ${FONT}`
  ctx.fillText(title, W / 2, 470)
  ctx.font = `500 30px ${FONT}`
  ctx.fillStyle = '#838384'
  ctx.fillText(numLabel, W / 2, 530)

  // 성명
  ctx.fillStyle = '#838384'
  ctx.font = `500 30px ${FONT}`
  ctx.fillText('성명', W / 2, 620)
  ctx.fillStyle = '#212120'
  let size = 136
  ctx.font = `800 ${size}px ${FONT}`
  while (ctx.measureText(d.name).width > W - 200 && size > 60) { size -= 6; ctx.font = `800 ${size}px ${FONT}` }
  ctx.fillText(d.name, W / 2, 620 + 36 + size * 0.86)
  let y = 620 + 36 + size * 0.86 + 58
  if (meta) {
    ctx.font = `500 34px ${FONT}`
    ctx.fillStyle = '#3c3c3c'
    ctx.fillText(meta, W / 2, y)
    y += 40
  }

  // 본문
  y += 44
  ctx.font = `500 32px ${FONT}`
  ctx.fillStyle = '#3c3c3c'
  for (const para of body) {
    for (const line of wrap(ctx, para, W - 260)) { ctx.fillText(line, W / 2, y); y += 52 }
  }
  if (d.wish) {
    y += 24
    ctx.font = `700 34px ${FONT}`
    ctx.fillStyle = '#212120'
    for (const line of wrap(ctx, `“${d.wish}”`, W - 300)) { ctx.fillText(line, W / 2, y); y += 52 }
  }

  // 날짜와 총장
  ctx.fillStyle = '#212120'
  ctx.font = `700 40px ${FONT}`
  ctx.fillText(when.date, W / 2, H - 262)
  ctx.font = `500 28px ${FONT}`
  ctx.fillStyle = '#838384'
  ctx.fillText(when.time, W / 2, H - 220)

  ctx.fillStyle = '#212120'
  ctx.font = `800 46px ${FONT}`
  ctx.fillText('UIA 대학교 총장', W / 2 - 60, H - 130)
  // 인장: 4C를 닮은 번진 구체
  const sx = W / 2 + 250
  const sy = H - 150
  const g = ctx.createLinearGradient(sx - 70, sy - 70, sx + 70, sy + 70)
  g.addColorStop(0, '#2d9ed9')
  g.addColorStop(0.5, '#e94545')
  g.addColorStop(1, '#fdc51b')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(sx, sy, 74, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.font = `800 40px ${FONT}`
  ctx.fillText('UIA', sx, sy + 14)

  ctx.fillStyle = '#838384'
  ctx.font = `500 24px ${FONT}`
  ctx.fillText('2026 대한민국 사회연대경제박람회 UIA 특별관', W / 2, H - 52)

  return c.toDataURL('image/png')
}
