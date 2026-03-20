import { jsPDF } from 'jspdf'

const BRAND = '#b5622a'
const NAVY  = '#0d1b2a'
const GREEN = '#2e6b55'
const RED   = '#b03040'

function line(doc, y) {
  doc.setDrawColor(233, 229, 216)
  doc.setLineWidth(0.3)
  doc.line(20, y, 190, y)
}

function label(doc, x, y, text) {
  doc.setFontSize(7.5)
  doc.setTextColor(138, 154, 170)
  doc.setFont('helvetica', 'bold')
  doc.text(text.toUpperCase(), x, y)
}

function value(doc, x, y, text, color = NAVY) {
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const [r, g, b] = hexToRgb(color)
  doc.setTextColor(r, g, b)
  doc.text(String(text), x, y)
}

function bigValue(doc, x, y, text, color = NAVY) {
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  const [r, g, b] = hexToRgb(color)
  doc.setTextColor(r, g, b)
  doc.text(String(text), x, y)
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

function pill(doc, x, y, text, bg, textColor) {
  const w = doc.getTextWidth(text) + 8
  const [br, bg2, bb] = hexToRgb(bg)
  doc.setFillColor(br, bg2, bb)
  doc.roundedRect(x, y - 4, w, 6, 1.5, 1.5, 'F')
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  const [tr, tg, tb] = hexToRgb(textColor)
  doc.setTextColor(tr, tg, tb)
  doc.text(text, x + 4, y)
}

export function generateMoneyTrailPDF(user = {}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210, M = 20

  /* ── Header bar ── */
  doc.setFillColor(...hexToRgb(NAVY))
  doc.rect(0, 0, W, 28, 'F')

  // Logo circle
  doc.setFillColor(...hexToRgb(BRAND))
  doc.circle(M + 6, 14, 6, 'F')
  doc.setFontSize(8)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text('MT', M + 3.2, 16.5)

  // Title
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('MoneyTrail', M + 16, 12)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(150, 175, 200)
  doc.text('Forensic Finance Report · March 2026', M + 16, 19)

  // Date on right
  doc.setFontSize(8)
  doc.setTextColor(150, 175, 200)
  doc.text('Generated: ' + new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), 148, 12)
  doc.text('For: ' + (user.name || 'Arun Kumar'), 148, 19)

  let y = 38

  /* ── Section: KPI Summary ── */
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...hexToRgb(BRAND))
  doc.text('MONTHLY SUMMARY', M, y)
  y += 2
  line(doc, y); y += 6

  // 4 KPI boxes
  const kpis = [
    { label: 'Salary',       value: '₹45,000',  color: NAVY  },
    { label: 'Leaked',       value: '₹13,950',  color: RED   },
    { label: 'Invested',     value: '₹5,000',   color: GREEN },
    { label: 'Shortfall Date', value: 'Mar 27', color: RED   },
  ]
  const boxW = 40, boxH = 20
  kpis.forEach((k, i) => {
    const bx = M + i * (boxW + 3)
    doc.setFillColor(250, 248, 243)
    doc.roundedRect(bx, y, boxW, boxH, 2, 2, 'F')
    doc.setDrawColor(233, 229, 216)
    doc.roundedRect(bx, y, boxW, boxH, 2, 2, 'S')
    label(doc, bx + 3, y + 5.5, k.label)
    bigValue(doc, bx + 3, y + 14, k.value, k.color)
  })
  y += boxH + 8

  /* ── Section: Rupee Trail ── */
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...hexToRgb(BRAND))
  doc.text('RUPEE TRAIL — WHERE YOUR ₹45,000 WENT', M, y)
  y += 2; line(doc, y); y += 6

  const trail = [
    { name: 'Essentials (Rent, Bills, Transport)', amount: '₹23,850', pct: '53%', color: '#3a5878' },
    { name: 'Wasted (Dead Subs, Idle Money)',      amount: '₹13,950', pct: '31%', color: RED   },
    { name: 'Invested (SIP)',                      amount: '₹5,000',  pct: '11%', color: GREEN },
    { name: 'Unaccounted',                         amount: '₹2,200',  pct: '5%',  color: '#8a9aaa' },
  ]

  trail.forEach(t => {
    const [r, g, b] = hexToRgb(t.color)
    // Bar
    doc.setFillColor(r, g, b)
    const barW = parseFloat(t.pct) * 1.3
    doc.roundedRect(M, y, barW, 4.5, 1, 1, 'F')
    // Labels
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...hexToRgb(NAVY))
    doc.text(t.name, M + barW + 3, y + 3.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(r, g, b)
    doc.text(`${t.amount} (${t.pct})`, 158, y + 3.5)
    y += 8
  })
  y += 4

  /* ── Section: Subscription Graveyard ── */
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...hexToRgb(BRAND))
  doc.text('SUBSCRIPTION GRAVEYARD', M, y)
  y += 2; line(doc, y); y += 6

  const subs = [
    { name: 'LinkedIn Premium', status: 'Graveyard', days: 112, amount: '₹1,600/mo', dead: true },
    { name: 'Hotstar Premium',  status: 'Dead',      days: 73,  amount: '₹299/mo',   dead: true },
    { name: 'Spotify Premium',  status: 'Dead',      days: 48,  amount: '₹119/mo',   dead: true },
    { name: 'Zee5',             status: 'Dormant',   days: 22,  amount: '₹99/mo',    dead: false },
    { name: 'Netflix',          status: 'Active',    days: 2,   amount: '₹649/mo',   dead: false },
  ]

  // Table header
  doc.setFillColor(245, 242, 235)
  doc.rect(M, y, 170, 7, 'F')
  label(doc, M + 2,   y + 5, 'Service')
  label(doc, 90,      y + 5, 'Status')
  label(doc, 120,     y + 5, 'Last Used')
  label(doc, 155,     y + 5, 'Cost')
  y += 8

  subs.forEach((s, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(252, 251, 248)
      doc.rect(M, y - 1, 170, 7, 'F')
    }
    doc.setFontSize(9)
    doc.setFont('helvetica', s.dead ? 'bold' : 'normal')
    doc.setTextColor(...hexToRgb(s.dead ? RED : NAVY))
    doc.text(s.name, M + 2, y + 4)
    pill(doc, 88, y + 4.5,
      s.status,
      s.status === 'Active' ? '#e6f2ec' : s.status === 'Dormant' ? '#fdf6e3' : '#fdecea',
      s.status === 'Active' ? GREEN : s.status === 'Dormant' ? '#8a6520' : RED
    )
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...hexToRgb('#8a9aaa'))
    doc.text(`${s.days} days ago`, 120, y + 4)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...hexToRgb(s.dead ? RED : NAVY))
    doc.text(s.amount, 155, y + 4)
    y += 7
  })

  // Total waste row
  doc.setFillColor(...hexToRgb('#fdecea'))
  doc.rect(M, y, 170, 8, 'F')
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...hexToRgb(RED))
  doc.text('Total Monthly Waste (4 dead subs)', M + 2, y + 5.5)
  doc.text('₹3,218/mo → ₹38,616/yr', 136, y + 5.5)
  y += 14

  /* ── Section: Spending Health ── */
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...hexToRgb(BRAND))
  doc.text('SPENDING HEALTH', M, y)
  y += 2; line(doc, y); y += 6

  const health = [
    { cat: 'Essentials',     budget: 22000, spent: 23850, status: 'Over'    },
    { cat: 'Food & Dining',  budget: 9000,  spent: 11000, status: 'Over'    },
    { cat: 'Subscriptions',  budget: 1500,  spent: 3218,  status: 'Critical' },
    { cat: 'Investments',    budget: 5000,  spent: 5000,  status: 'Healthy'  },
    { cat: 'Shopping',       budget: 3000,  spent: 1850,  status: 'Healthy'  },
    { cat: 'Leisure',        budget: 2000,  spent: 1100,  status: 'Healthy'  },
  ]

  health.forEach(h => {
    const pct = Math.min(100, Math.round((h.spent / h.budget) * 100))
    const ok  = h.status === 'Healthy'
    const barColor = ok ? GREEN : h.status === 'Critical' ? RED : BRAND
    const [r, g, b] = hexToRgb(barColor)
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...hexToRgb(NAVY))
    doc.text(h.cat, M, y + 3)
    // Track
    doc.setFillColor(240, 237, 228)
    doc.roundedRect(65, y, 80, 4, 1, 1, 'F')
    // Fill
    doc.setFillColor(r, g, b)
    doc.roundedRect(65, y, 80 * (pct / 100), 4, 1, 1, 'F')
    // Amounts
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(r, g, b)
    doc.text(`₹${h.spent.toLocaleString('en-IN')} / ₹${h.budget.toLocaleString('en-IN')}`, 150, y + 3.5)
    y += 7
  })

  y += 4

  /* ── Section: Goals ── */
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...hexToRgb(BRAND))
  doc.text('FINANCIAL GOALS', M, y)
  y += 2; line(doc, y); y += 6

  const goals = [
    { name: 'Emergency Fund', current: 22000, target: 100000, pct: 22, months: 18 },
    { name: 'Goa Trip',       current: 8500,  target: 25000,  pct: 34, months: 4  },
    { name: 'iPhone 17',      current: 3000,  target: 90000,  pct: 3,  months: 30 },
  ]

  goals.forEach(g => {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...hexToRgb(NAVY))
    doc.text(g.name, M, y + 3)
    // Track
    doc.setFillColor(240, 237, 228)
    doc.roundedRect(70, y, 70, 5, 1.5, 1.5, 'F')
    // Fill
    doc.setFillColor(...hexToRgb('#3a5878'))
    doc.roundedRect(70, y, 70 * (g.pct / 100), 5, 1.5, 1.5, 'F')
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...hexToRgb('#8a9aaa'))
    doc.text(`₹${g.current.toLocaleString('en-IN')} of ₹${g.target.toLocaleString('en-IN')}`, 145, y + 3.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...hexToRgb('#3a5878'))
    doc.text(`${g.pct}%`, 149 + doc.getTextWidth(`₹${g.current.toLocaleString('en-IN')} of ₹${g.target.toLocaleString('en-IN')}`), y + 3.5)
    y += 8
  })

  y += 4

  /* ── Action Recommendations ── */
  if (y < 240) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...hexToRgb(BRAND))
    doc.text('AI RECOMMENDATIONS', M, y)
    y += 2; line(doc, y); y += 6

    const actions = [
      { icon: '1.', text: 'Cancel LinkedIn, Hotstar, Spotify, Zee5 → Save ₹3,218/mo (₹38,616/yr)' },
      { icon: '2.', text: 'Move ₹45,000 idle savings to a liquid fund → Earn ₹1,800–2,200/yr extra' },
      { icon: '3.', text: 'Set a food budget alert at ₹9,000/mo → Save ₹1,800/mo' },
      { icon: '4.', text: 'Auto-redirect cancelled sub savings to Emergency Fund → Hit goal 9 months sooner' },
    ]

    actions.forEach(a => {
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...hexToRgb(GREEN))
      doc.text(a.icon, M, y + 3)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...hexToRgb(NAVY))
      doc.text(a.text, M + 6, y + 3)
      y += 7
    })
  }

  /* ── Footer ── */
  doc.setFillColor(...hexToRgb(NAVY))
  doc.rect(0, 285, W, 12, 'F')
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 130, 160)
  doc.text('MoneyTrail · Forensic Finance · Confidential · For personal use only', M, 292)
  doc.text('Page 1 of 1', 182, 292)

  /* ── Save ── */
  const fileName = `MoneyTrail_March2026_${(user.name || 'Arun_Kumar').replace(/\s+/g, '_')}.pdf`
  doc.save(fileName)
  return fileName
}
