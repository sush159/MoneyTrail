import { useState } from 'react'
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis } from 'recharts'
import { Toast } from '../components/Overlays'

const SERIF = { fontFamily: "'Playfair Display', Georgia, serif" }
const MONO  = { fontFamily: "'DM Mono', 'Courier New', monospace" }

/* ── Category data — all personal budgets, zero peer numbers ──── */
const CATEGORIES = [
  {
    id: 'essentials',
    label: 'Essentials',
    emoji: '🏠',
    budget: 22000,
    spent: 23850,
    desc: 'Rent, utilities, transport',
    tip: 'Over budget by ₹1,850. Review transport costs — Ola/Uber trips spiked this month.',
    tipType: 'warn',
  },
  {
    id: 'food',
    label: 'Food & Dining',
    emoji: '🍔',
    budget: 9000,
    spent: 11000,
    desc: 'Groceries, restaurants, delivery',
    tip: 'Over budget by ₹2,000. Weekend delivery orders account for ₹3,200 of this.',
    tipType: 'bad',
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions',
    emoji: '📺',
    budget: 1500,
    spent: 3218,
    desc: 'Streaming, SaaS, memberships',
    tip: '4 subscriptions unused. Cancel them to bring this under budget.',
    tipType: 'bad',
  },
  {
    id: 'investment',
    label: 'Investments',
    emoji: '📈',
    budget: 5000,
    spent: 5000,
    desc: 'SIP, mutual funds, savings',
    tip: 'Exactly on target. Keep this up — consistency beats timing.',
    tipType: 'good',
  },
  {
    id: 'shopping',
    label: 'Shopping',
    emoji: '🛍️',
    budget: 3000,
    spent: 1850,
    desc: 'Clothing, gadgets, personal care',
    tip: 'Well within budget — ₹1,150 headroom remaining.',
    tipType: 'good',
  },
  {
    id: 'leisure',
    label: 'Leisure',
    emoji: '🎉',
    budget: 2000,
    spent: 1100,
    desc: 'Movies, outings, hobbies',
    tip: 'Healthy balance — you are not over-restricting leisure.',
    tipType: 'good',
  },
]

/* Derived health score — personal only */
function scoreCategory(c) {
  const ratio = c.spent / c.budget
  if (c.id === 'investment') return ratio >= 1 ? 100 : ratio * 100
  if (ratio <= 0.85) return 100
  if (ratio <= 1.0)  return 75
  if (ratio <= 1.2)  return 40
  return 10
}

const CAT_SCORES  = CATEGORIES.map(c => ({ ...c, score: scoreCategory(c) }))
const AVG_SCORE   = Math.round(CAT_SCORES.reduce((s, c) => s + c.score, 0) / CAT_SCORES.length)

const SCORE_LABEL = AVG_SCORE >= 80 ? 'Excellent' : AVG_SCORE >= 60 ? 'Good' : AVG_SCORE >= 40 ? 'Fair' : 'Needs Work'
const SCORE_COLOR = AVG_SCORE >= 80 ? '#2e6b55' : AVG_SCORE >= 60 ? '#b5622a' : AVG_SCORE >= 40 ? '#8a6520' : '#b03040'

const STATUS = (ratio) =>
  ratio <= 0.85 ? { label: 'Healthy',   color: '#2e6b55', bg: '#e8f3ee' } :
  ratio <= 1.0  ? { label: 'On Track',  color: '#8a6520', bg: '#fdf6e3' } :
  ratio <= 1.2  ? { label: 'Over',      color: '#b5622a', bg: '#fef3ea' } :
                  { label: 'Critical',  color: '#b03040', bg: '#fdecea' }

/* Weekly trend — personal spend over 4 weeks */
const TREND = [
  { week: 'W1', spend: 9200,  budget: 10500 },
  { week: 'W2', spend: 10800, budget: 10500 },
  { week: 'W3', spend: 13400, budget: 10500 },
  { week: 'W4', spend: 12600, budget: 10500 },
]

/* ── Health Score Gauge ──────────────────────────────────────────── */
function ScoreGauge({ score, color, label }) {
  // SVG arc gauge — 0 to 180 degrees
  const r = 70
  const cx = 90, cy = 90
  const startAngle = Math.PI         // 180° = left
  const endAngle   = 0               // 0°   = right
  const totalAngle = Math.PI         // half circle

  const pct = score / 100
  const sweep = totalAngle * pct

  const startX = cx + r * Math.cos(startAngle)
  const startY = cy + r * Math.sin(startAngle)
  const endX   = cx + r * Math.cos(startAngle + sweep)
  const endY   = cy + r * Math.sin(startAngle + sweep)
  const large  = sweep > Math.PI ? 1 : 0

  // Track arc (full half)
  const trackEndX = cx + r * Math.cos(endAngle)
  const trackEndY = cy + r * Math.sin(endAngle)

  // Needle
  const needleAngle = startAngle + sweep
  const needleLen = 54
  const needleX = cx + needleLen * Math.cos(needleAngle)
  const needleY = cy + needleLen * Math.sin(needleAngle)

  return (
    <svg viewBox="0 0 180 100" className="w-full" style={{ maxWidth: 220 }}>
      {/* Track */}
      <path
        d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${trackEndX} ${trackEndY}`}
        fill="none" stroke="#f0ede4" strokeWidth="12" strokeLinecap="round"
      />
      {/* Filled arc */}
      {score > 0 && (
        <path
          d={`M ${startX} ${startY} A ${r} ${r} 0 ${large} 1 ${endX} ${endY}`}
          fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
          style={{ transition: 'all 0.8s ease' }}
        />
      )}
      {/* Needle */}
      <line x1={cx} y1={cy} x2={needleX} y2={needleY}
        stroke="#0d1b2a" strokeWidth="2" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="5" fill="#0d1b2a" />
      {/* Score text */}
      <text x={cx} y={cy - 12} textAnchor="middle" fontSize="22" fontWeight="700"
        fill={color} style={SERIF}>{score}</text>
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="9"
        fill="#8a9aaa">out of 100</text>
      {/* Label */}
      <text x={cx} y={cy + 18} textAnchor="middle" fontSize="11" fontWeight="600"
        fill={color}>{label}</text>
      {/* Min / Max labels */}
      <text x="18" y="98" fontSize="8" fill="#c0bbb0">0</text>
      <text x="156" y="98" fontSize="8" fill="#c0bbb0">100</text>
    </svg>
  )
}

/* ── Category Health Card ──────────────────────────────────────── */
function CategoryCard({ c, expanded, onToggle }) {
  const ratio  = c.spent / c.budget
  const pct    = Math.min(100, Math.round(ratio * 100))
  const status = STATUS(ratio)
  const over   = c.spent > c.budget
  const diff   = Math.abs(c.spent - c.budget)

  return (
    <div
      onClick={onToggle}
      className="rounded-[14px] cursor-pointer transition-all duration-200"
      style={{
        background: '#fff',
        border: `1.5px solid ${expanded ? status.color + '50' : '#ede9df'}`,
        boxShadow: expanded ? `0 4px 20px ${status.color}18` : 'none',
      }}>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: status.bg }}>
            {c.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[13px] font-semibold text-[#0d1b2a]">{c.label}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: status.bg, color: status.color }}>
                {status.label}
              </span>
            </div>
            <div className="text-[10.5px] text-[#a0a8b0]">{c.desc}</div>
          </div>
        </div>

        {/* Budget bar */}
        <div className="mb-2">
          <div className="h-2 rounded-full overflow-hidden" style={{ background: '#f3f0e8' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{
                width: pct + '%',
                background: over
                  ? `linear-gradient(90deg, ${status.color}88, ${status.color})`
                  : `linear-gradient(90deg, #2e6b5560, #2e6b55)`,
              }} />
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span style={{ ...MONO, color: '#0d1b2a', fontWeight: 600 }}>
            ₹{c.spent.toLocaleString('en-IN')}
            <span style={{ color: '#a0a8b0', fontWeight: 400 }}> / ₹{c.budget.toLocaleString('en-IN')}</span>
          </span>
          <span style={{
            ...MONO, fontWeight: 700,
            color: over ? status.color : '#2e6b55',
          }}>
            {over ? `+₹${diff.toLocaleString('en-IN')} over` : `-₹${diff.toLocaleString('en-IN')} left`}
          </span>
        </div>
      </div>

      {/* Expanded tip */}
      {expanded && (
        <div className="px-4 pb-4 pt-0">
          <div className="rounded-[10px] p-3 text-[12px] leading-relaxed"
            style={{ background: status.bg, color: status.color }}>
            💡 {c.tip}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Custom tooltip for the area chart ────────────────────────── */
function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const over = payload[0].value > payload[1]?.value
  return (
    <div style={{
      background: '#fff', border: '1px solid #ede9df',
      borderRadius: 8, padding: '8px 12px', fontSize: 12,
    }}>
      <p style={{ color: '#8a9aaa', fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, fontWeight: 500 }}>
          {p.name}: ₹{p.value.toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function SpendHealth() {
  const [expanded, setExpanded] = useState(null)
  const [toast,    setToast]    = useState(null)

  const totalBudget = CATEGORIES.reduce((s, c) => s + c.budget, 0)
  const totalSpent  = CATEGORIES.reduce((s, c) => s + c.spent, 0)
  const overBudget  = CATEGORIES.filter(c => c.spent > c.budget).length
  const onTrack     = CATEGORIES.length - overBudget

  const radialData = [{ name: 'Health', value: AVG_SCORE, fill: SCORE_COLOR }]

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h2 className="text-[22px] text-[#0d1b2a] font-normal mb-1" style={SERIF}>Spending Health</h2>
        <p className="text-[12.5px] text-[#a0a8b0]">
          How your personal budgets are tracking this month — March 2026
        </p>
      </div>

      {/* Top row: Score + Summary chips + Trend */}
      <div className="grid gap-3.5" style={{ gridTemplateColumns: '200px 1fr' }}>

        {/* Score card */}
        <div className="rounded-[16px] p-5 flex flex-col items-center justify-center"
          style={{ background: '#fff', border: '1px solid #ede9df' }}>
          <div className="text-[10px] font-semibold uppercase tracking-[0.7px] text-[#a0a8b0] mb-3">
            Health Score
          </div>
          <ScoreGauge score={AVG_SCORE} color={SCORE_COLOR} label={SCORE_LABEL} />
          <div className="mt-3 text-center">
            <div className="text-[11px] text-[#a0a8b0]">
              {onTrack} of {CATEGORIES.length} categories on track
            </div>
          </div>
        </div>

        {/* Right column: summary + trend */}
        <div className="space-y-3">

          {/* Summary chips */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total Budget',  value: `₹${(totalBudget/1000).toFixed(0)}K`, color: '#3a5878',  bg: '#eef3f8'  },
              { label: 'Total Spent',   value: `₹${(totalSpent/1000).toFixed(1)}K`, color: '#b5622a',  bg: '#fef3ea'  },
              { label: 'Over Budget',   value: `${overBudget} of ${CATEGORIES.length}`, color: '#b03040', bg: '#fdecea' },
            ].map(chip => (
              <div key={chip.label} className="rounded-[12px] p-3.5"
                style={{ background: chip.bg, border: `1px solid ${chip.color}20` }}>
                <div className="text-[10px] font-semibold uppercase tracking-[0.5px] mb-1.5"
                  style={{ color: chip.color + 'aa' }}>
                  {chip.label}
                </div>
                <div className="text-[20px] leading-none font-bold" style={{ ...SERIF, color: chip.color }}>
                  {chip.value}
                </div>
              </div>
            ))}
          </div>

          {/* Spend trend chart */}
          <div className="rounded-[16px] p-4" style={{ background: '#fff', border: '1px solid #ede9df' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-semibold text-[#0d1b2a]">Weekly Spend vs Budget</span>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
                style={{ background: '#fef3ea', color: '#b5622a' }}>
                W3 spike +₹2,900
              </span>
            </div>
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart data={TREND} margin={{ top: 2, right: 0, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="budgetGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3a5878" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3a5878" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#b5622a" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#b5622a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#a0a8b0' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<TrendTooltip />} />
                <Area type="monotone" dataKey="budget" name="Budget"
                  stroke="#3a5878" strokeWidth={1.5} strokeDasharray="4 2"
                  fill="url(#budgetGrad)" dot={false} />
                <Area type="monotone" dataKey="spend" name="Spent"
                  stroke="#b5622a" strokeWidth={2}
                  fill="url(#spendGrad)" dot={{ r: 3, fill: '#b5622a', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category health grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-semibold text-[#0d1b2a]">Category Breakdown</span>
          <span className="text-[11px] text-[#a0a8b0]">Click any category for details</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {CAT_SCORES.map(c => (
            <CategoryCard
              key={c.id}
              c={c}
              expanded={expanded === c.id}
              onToggle={() => setExpanded(expanded === c.id ? null : c.id)}
            />
          ))}
        </div>
      </div>

      {/* Month-end projection */}
      <div className="rounded-[16px] p-5" style={{ background: '#0d1b2a' }}>
        <div className="text-[10px] uppercase tracking-[0.7px] font-semibold text-[#5a7a9a] mb-3">
          Month-End Projection
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Projected Spend', value: '₹48,200', sub: '11 days left', color: '#f0c57a' },
            { label: 'Projected Surplus', value: '-₹3,200', sub: 'Shortfall risk', color: '#b03040' },
            { label: 'If Leaks Fixed', value: '+₹18', sub: 'Small surplus', color: '#4aab7a' },
          ].map(p => (
            <div key={p.label}>
              <div className="text-[10px] font-semibold text-[#5a7a9a] mb-1">{p.label}</div>
              <div className="text-[22px] font-bold leading-tight" style={{ ...SERIF, color: p.color }}>
                {p.value}
              </div>
              <div className="text-[11px]" style={{ color: p.sub === 'Shortfall risk' ? '#b03040' : '#4a6a5a' }}>
                {p.sub}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 text-[12px] text-[#4a7a6a] leading-relaxed"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          💡 Fixing your 3 over-budget categories (Food, Subscriptions, Essentials)
          turns a <span style={{ color: '#b03040', fontWeight: 600 }}>₹3,200 shortfall</span> into
          a <span style={{ color: '#4aab7a', fontWeight: 600 }}>₹4,968 surplus</span> by month-end.
        </div>
      </div>

      {/* Health checklist */}
      <div className="rounded-[16px] p-5" style={{ background: '#fff', border: '1px solid #ede9df' }}>
        <div className="text-[12px] font-semibold text-[#0d1b2a] mb-3">Your Spending Habits This Month</div>
        <div className="space-y-2.5">
          {[
            { ok: true,  text: 'Investments on target at ₹5,000 (11.1% of income)' },
            { ok: true,  text: 'Shopping and Leisure well within budget' },
            { ok: false, text: 'Food spend ₹2,000 over — weekend delivery the main cause' },
            { ok: false, text: '4 subscriptions unused — ₹1,718/mo over sub budget' },
            { ok: false, text: 'Essentials slightly over — Ola/Uber spikes detected' },
            { ok: true,  text: 'No impulse shopping detected this month' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5"
                style={{
                  background: item.ok ? '#e8f3ee' : '#fdecea',
                  color: item.ok ? '#2e6b55' : '#b03040',
                }}>
                {item.ok ? '✓' : '!'}
              </div>
              <span className="text-[12.5px] leading-relaxed"
                style={{ color: item.ok ? '#2a3f52' : '#5a3030' }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </div>
  )
}
