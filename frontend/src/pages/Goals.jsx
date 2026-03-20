import { useState, useMemo } from 'react'
import { Toast, Modal, ModalBtn } from '../components/Overlays'

const SERIF = { fontFamily: "'Playfair Display', Georgia, serif" }
const MONO  = { fontFamily: "'DM Mono', 'Courier New', monospace" }

// ── Data ─────────────────────────────────────────────────────────────────────
const goals = [
  {
    id: 1,
    emoji: '🏦',
    name: 'Emergency Fund',
    tag: 'Priority',
    tagColor: '#3a5878',
    tagBg: 'rgba(58,88,120,0.1)',
    pct: 22,
    current: 22000,
    target: 100000,
    monthsNow: 18,
    monthsRedirected: 9,
    color: '#3a5878',
    ring: '#3a5878',
    milestones: [25, 50, 75, 100],
  },
  {
    id: 2,
    emoji: '✈️',
    name: 'Goa Trip',
    tag: 'On Track',
    tagColor: '#2e6b55',
    tagBg: 'rgba(46,107,85,0.1)',
    pct: 34,
    current: 8500,
    target: 25000,
    monthsNow: 4,
    monthsRedirected: 2,
    color: '#b5622a',
    ring: '#b5622a',
    milestones: [25, 50, 75, 100],
  },
  {
    id: 3,
    emoji: '📱',
    name: 'iPhone 17',
    tag: 'Needs Boost',
    tagColor: '#8a6a2a',
    tagBg: 'rgba(138,106,42,0.1)',
    pct: 3,
    current: 3000,
    target: 90000,
    monthsNow: 30,
    monthsRedirected: 12,
    color: '#8a9aaa',
    ring: '#8a9aaa',
    milestones: [25, 50, 75, 100],
  },
]

// ── Circular progress ring ────────────────────────────────────────────────────
function Ring({ pct, color, size = 80 }) {
  const r    = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#f0ede4" strokeWidth="8" />
      <circle cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        style={{ transition: 'stroke-dasharray 0.8s ease' }} />
    </svg>
  )
}

// ── Goal Row ──────────────────────────────────────────────────────────────────
function GoalRow({ g, index }) {
  const remaining     = g.target - g.current
  const saved_pct_width = Math.max(g.pct, 2)
  return (
    <div className="flex items-start gap-5 p-5 rounded-[16px] relative overflow-hidden"
      style={{ background: '#fff', border: '1px solid #ede9df' }}>
      <div className="absolute top-3 right-4 text-[42px] font-bold leading-none pointer-events-none select-none"
        style={{ ...SERIF, color: g.color, opacity: 0.05 }}>
        0{index + 1}
      </div>
      {/* Ring */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1">
        <div className="relative w-[80px] h-[80px]">
          <Ring pct={g.pct} color={g.ring} size={80} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[15px] font-bold leading-none" style={{ ...SERIF, color: g.color }}>{g.pct}%</span>
          </div>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: g.tagBg, color: g.tagColor }}>{g.tag}</span>
      </div>
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">{g.emoji}</span>
          <span className="text-[15px] font-semibold text-[#0d1b2a]" style={SERIF}>{g.name}</span>
        </div>
        <div className="relative mb-2">
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#f3f0e8' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: saved_pct_width + '%', background: `linear-gradient(90deg, ${g.color}99, ${g.color})` }} />
          </div>
          {g.milestones.map(m => (
            <div key={m} className="absolute top-0 w-px h-2.5 pointer-events-none"
              style={{ left: m + '%', background: m <= g.pct ? '#fff' : '#d4cfc4', opacity: 0.8 }} />
          ))}
        </div>
        <div className="relative mb-3" style={{ height: '12px' }}>
          {g.milestones.map(m => (
            <span key={m} className="absolute text-[9px] font-semibold -translate-x-1/2"
              style={{ left: m + '%', color: m <= g.pct ? g.color : '#c0bbb0' }}>
              {m === 100 ? '🎯' : `${m}%`}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 text-[12px] mb-3">
          <div>
            <div className="text-[10px] text-[#a0a8b0] uppercase tracking-[0.5px] mb-0.5">Saved</div>
            <div className="font-semibold text-[#0d1b2a]" style={MONO}>₹{g.current.toLocaleString('en-IN')}</div>
          </div>
          <div className="w-px h-7 bg-[#ede9df]" />
          <div>
            <div className="text-[10px] text-[#a0a8b0] uppercase tracking-[0.5px] mb-0.5">Remaining</div>
            <div className="font-semibold text-[#5a6a7a]" style={MONO}>₹{remaining.toLocaleString('en-IN')}</div>
          </div>
          <div className="w-px h-7 bg-[#ede9df]" />
          <div>
            <div className="text-[10px] text-[#a0a8b0] uppercase tracking-[0.5px] mb-0.5">Target</div>
            <div className="font-semibold text-[#8a9aaa]" style={MONO}>₹{g.target.toLocaleString('en-IN')}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px]"
            style={{ background: 'rgba(138,154,170,0.1)' }}>
            <span className="text-[9px] uppercase tracking-[0.5px] text-[#8a9aaa] font-semibold">Now</span>
            <span className="text-[12px] font-bold text-[#5a6a7a]">{g.monthsNow}mo</span>
          </div>
          <span className="text-[#c0bbb0] text-[11px]">→</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px]"
            style={{ background: 'rgba(46,107,85,0.08)', border: '1px solid rgba(46,107,85,0.2)' }}>
            <span className="text-[9px] uppercase tracking-[0.5px] font-semibold" style={{ color: '#2e6b55' }}>If redirected</span>
            <span className="text-[12px] font-bold" style={{ color: '#2e6b55' }}>{g.monthsRedirected}mo</span>
          </div>
          <span className="text-[10px] font-semibold" style={{ color: '#2e6b55' }}>
            saves {g.monthsNow - g.monthsRedirected}mo ⚡
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Redirect Modal ────────────────────────────────────────────────────────────
function RedirectModal({ onClose, onDone }) {
  const [dest, setDest] = useState('emergency')
  const opts = [
    { id: 'emergency', label: 'Emergency Fund', emoji: '🏦', sub: 'Hit goal 9 months sooner' },
    { id: 'sip',       label: 'SIP / Mutual Fund', emoji: '📈', sub: '₹42K+ at 12% XIRR in 12mo' },
    { id: 'goa',       label: 'Goa Trip',       emoji: '✈️', sub: 'Reach ₹25,000 by April' },
  ]
  return (
    <Modal title="Set Up Auto-Redirect" onClose={onClose} width={400}>
      <p style={{ fontSize: 12.5, color: '#8a9aaa', marginBottom: 14 }}>
        Redirect ₹3,218/mo from cancelled subs to:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {opts.map(o => (
          <button key={o.id} onClick={() => setDest(o.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
              border: `1.5px solid ${dest === o.id ? '#2e6b55' : '#ede9df'}`,
              background: dest === o.id ? '#e8f3ee' : '#faf8f3',
              transition: 'all 0.15s',
            }}>
            <span style={{ fontSize: 22 }}>{o.emoji}</span>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0d1b2a' }}>{o.label}</div>
              <div style={{ fontSize: 11, color: '#8a9aaa' }}>{o.sub}</div>
            </div>
            {dest === o.id && <span style={{ fontSize: 11, fontWeight: 700, color: '#2e6b55' }}>✓</span>}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <ModalBtn variant="ghost" onClick={onClose}>Cancel</ModalBtn>
        <ModalBtn variant="green" onClick={() => onDone(opts.find(o => o.id === dest))}>
          Activate Redirect →
        </ModalBtn>
      </div>
    </Modal>
  )
}

// ── Impact panel ──────────────────────────────────────────────────────────────
function ImpactPanel({ onRedirect }) {
  const totalSaved  = goals.reduce((s, g) => s + g.current, 0)
  const totalTarget = goals.reduce((s, g) => s + g.target, 0)
  const overallPct  = Math.round((totalSaved / totalTarget) * 100)
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-[16px] p-4" style={{ background: '#0d1b2a' }}>
        <div className="text-[10px] uppercase tracking-[0.7px] text-[#5a7a9a] font-semibold mb-3">Overall Progress</div>
        <div className="flex items-end gap-3 mb-3">
          <div className="text-[36px] leading-none font-bold text-white" style={SERIF}>{overallPct}%</div>
          <div className="text-[11px] text-[#5a7a9a] mb-1 leading-tight">across<br />all goals</div>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden mb-1" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full" style={{ width: overallPct + '%', background: 'linear-gradient(90deg, #3a5878, #2e6b55)' }} />
        </div>
        <div className="flex justify-between text-[10px] text-[#5a7a9a]">
          <span>₹{(totalSaved / 1000).toFixed(1)}K saved</span>
          <span>₹{(totalTarget / 1000).toFixed(0)}K total</span>
        </div>
      </div>
      <div className="rounded-[16px] p-4"
        style={{ background: 'linear-gradient(160deg, #e8f3ee, #d8ece3)', border: '1px solid rgba(46,107,85,0.2)' }}>
        <div className="text-[10px] uppercase tracking-[0.7px] font-semibold mb-2" style={{ color: '#2e6b55' }}>
          Leak Redirect Impact
        </div>
        <div className="text-[11px] text-[#2a3f52] leading-relaxed mb-3">
          Cancel 4 dead subs (₹3,218/mo) and auto-redirect into goals.
        </div>
        <div className="space-y-2 mb-3">
          {goals.map(g => (
            <div key={g.id} className="flex items-center gap-2">
              <span className="text-[11px]">{g.emoji}</span>
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(46,107,85,0.15)' }}>
                <div className="h-full rounded-full"
                  style={{ background: '#2e6b55', width: (g.monthsRedirected / g.monthsNow * 100) + '%' }} />
              </div>
              <span className="text-[10px] font-semibold" style={{ color: '#2e6b55' }}>
                -{g.monthsNow - g.monthsRedirected}mo
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={onRedirect}
          className="w-full py-2 rounded-[8px] text-[11px] font-semibold text-white cursor-pointer transition-all hover:opacity-90"
          style={{ background: '#2e6b55' }}>
          Set Up Auto-Redirect →
        </button>
      </div>
      <div className="rounded-[16px] p-4" style={{ background: '#fff', border: '1px solid #ede9df' }}>
        <div className="text-[10px] uppercase tracking-[0.7px] text-[#a0a8b0] font-semibold mb-3">Monthly Allocation</div>
        <div className="space-y-2.5">
          {goals.map(g => (
            <div key={g.id} className="flex items-center gap-2">
              <span className="text-[11px] w-4">{g.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] text-[#8a9aaa] mb-1">
                  <span>{g.name}</span>
                  <span style={MONO}>₹{Math.round(g.target / (g.monthsNow * 1.2)).toLocaleString('en-IN')}</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: '#f3f0e8' }}>
                  <div className="h-full rounded-full"
                    style={{ background: g.color, width: Math.round((g.target / (g.monthsNow * 1.2)) / 5000 * 100) + '%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Savings Board ─────────────────────────────────────────────────────────────
// Grid of denomination cells: click to scratch off. Sums to ₹1,00,000.
// 15 rows × 16 cols = 240 cells
// 4×₹50 + 14×₹100 + 42×₹200 + 180×₹500 = 200+1400+8400+90000 = ₹1,00,000
const BOARD_TARGET = 100000
const COLS = 16

function buildCells() {
  // Build pool that sums exactly to ₹1,00,000
  const pool = [
    ...Array(4).fill(50),
    ...Array(14).fill(100),
    ...Array(42).fill(200),
    ...Array(180).fill(500),
  ]
  // Deterministic shuffle (seeded LCG so grid is stable across renders)
  let seed = 42
  const rand = () => { seed = (seed * 1664525 + 1013904223) & 0x7fffffff; return seed / 0x7fffffff }
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]
  }
  // Arrange: first column of each row prefers 50/100 (smaller), rest are what's shuffled
  // Just use the shuffled pool directly — it'll have a natural distribution
  return pool.map((amount, idx) => ({ id: idx, amount }))
}

// Denomination colour mapping
const DENOM_STYLE = {
  50:  { bg: '#4a3525', text: '#d4a87a', border: 'rgba(212,168,122,0.25)' },
  100: { bg: '#3d4a2e', text: '#8eb86a', border: 'rgba(142,184,106,0.25)' },
  200: { bg: '#2a3a4e', text: '#7aadd4', border: 'rgba(122,173,212,0.25)' },
  500: { bg: '#1e2a1e', text: '#d4c87a', border: 'rgba(212,200,122,0.25)' },
}

function SavingsBoard() {
  const cells = useMemo(() => buildCells(), [])
  const [checked, setChecked] = useState(() => new Set())
  const [justAdded, setJustAdded] = useState(null)

  function toggle(id, amount) {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else {
        next.add(id)
        setJustAdded(id)
        setTimeout(() => setJustAdded(null), 600)
      }
      return next
    })
  }

  const saved   = cells.filter(c => checked.has(c.id)).reduce((s, c) => s + c.amount, 0)
  const pct     = Math.min(100, Math.round((saved / BOARD_TARGET) * 100))
  const count   = checked.size
  const remaining = BOARD_TARGET - saved

  // Legend counts
  const legend = [50, 100, 200, 500].map(d => ({
    d,
    total: cells.filter(c => c.amount === d).length,
    done:  cells.filter(c => c.amount === d && checked.has(c.id)).length,
  }))

  return (
    <div className="rounded-[20px] overflow-hidden"
      style={{ border: '10px solid #3d2510', boxShadow: '0 8px 32px rgba(0,0,0,0.22), inset 0 2px 8px rgba(255,255,255,0.04)' }}>

      {/* Wooden top strip */}
      <div className="flex items-center justify-between px-5 py-3"
        style={{ background: 'linear-gradient(180deg, #5c3820 0%, #3d2510 100%)', borderBottom: '2px solid #2a1a08' }}>
        <div>
          <div className="text-[14px] font-semibold" style={{ ...SERIF, color: '#e8c99a', letterSpacing: '0.3px' }}>
            Savings Scratch Board
          </div>
          <div className="text-[10px]" style={{ color: '#a07850' }}>Small amounts become big savings · Click a cell to scratch it off</div>
        </div>
        <div className="text-right">
          <div className="text-[22px] font-bold leading-tight" style={{ ...SERIF, color: '#f0d4a0' }}>
            ₹{saved.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px]" style={{ color: '#a07850' }}>of ₹1,00,000</div>
        </div>
      </div>

      {/* Board inner */}
      <div className="p-4" style={{ background: 'linear-gradient(160deg, #1a1208 0%, #120d05 100%)' }}>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-2 rounded-full overflow-hidden mb-1.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{
                width: pct + '%',
                background: pct >= 100
                  ? 'linear-gradient(90deg, #f0d070, #e8a030)'
                  : 'linear-gradient(90deg, #5c8a3c, #a0c860)',
              }} />
          </div>
          <div className="flex justify-between text-[9.5px]" style={{ color: '#6a5030' }}>
            <span>{count} cells scratched · {pct}% complete</span>
            <span>{pct < 100 ? `₹${remaining.toLocaleString('en-IN')} to go` : '🎉 Goal reached!'}</span>
          </div>
        </div>

        {/* Cell grid */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: '3px' }}>
          {cells.map(c => {
            const done  = checked.has(c.id)
            const fresh = justAdded === c.id
            const ds    = DENOM_STYLE[c.amount]
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id, c.amount)}
                title={`₹${c.amount}`}
                style={{
                  background: done ? 'rgba(255,255,255,0.04)' : ds.bg,
                  border: `1px solid ${done ? 'rgba(255,255,255,0.06)' : ds.border}`,
                  borderRadius: '4px',
                  padding: '3px 1px',
                  cursor: 'pointer',
                  position: 'relative',
                  transform: fresh ? 'scale(1.15)' : 'scale(1)',
                  transition: 'transform 0.15s ease, background 0.2s ease',
                  minWidth: 0,
                }}>
                <div style={{
                  fontSize: '9px',
                  fontWeight: '700',
                  color: done ? 'rgba(255,255,255,0.12)' : ds.text,
                  textDecoration: done ? 'line-through' : 'none',
                  fontFamily: "'DM Mono', monospace",
                  lineHeight: 1,
                  textAlign: 'center',
                  letterSpacing: '-0.3px',
                }}>
                  {c.amount}
                </div>
                {done && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', opacity: 0.5,
                  }}>✓</div>
                )}
              </button>
            )
          })}
        </div>

        {/* Legend + stats row */}
        <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
          {/* Legend */}
          <div className="flex gap-3">
            {legend.map(({ d, total, done }) => {
              const ds = DENOM_STYLE[d]
              return (
                <div key={d} className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded flex items-center justify-center text-[7px] font-bold"
                    style={{ background: ds.bg, color: ds.text, border: `1px solid ${ds.border}` }}>
                    {d >= 1000 ? d/1000+'K' : d}
                  </div>
                  <span style={{ color: '#6a5030', fontSize: '9px', fontFamily: "'DM Mono', monospace" }}>
                    {done}/{total}
                  </span>
                </div>
              )
            })}
          </div>
          {/* Bottom tagline */}
          <div className="text-[10px] italic" style={{ ...SERIF, color: '#6a5030' }}>
            ₹1,00,000 — Small Amounts Become Big Savings
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Goals() {
  const [toast,        setToast]        = useState(null)
  const [showRedirect, setShowRedirect] = useState(false)

  function handleRedirectDone(dest) {
    setShowRedirect(false)
    setToast({ msg: `₹3,218/mo will auto-redirect to "${dest.label}" every month 🚀`, type: 'success' })
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[22px] text-[#0d1b2a] font-normal leading-tight mb-1" style={SERIF}>
            Financial Goals
          </h2>
          <p className="text-[12.5px] text-[#a0a8b0]">
            Track savings targets · See how redirecting leaks accelerates each goal
          </p>
        </div>
        <div className="flex items-center gap-2">
          {['22%', '34%', '3%'].map((v, i) => (
            <div key={i} className="text-center px-3 py-1.5 rounded-[8px]"
              style={{ background: '#fff', border: '1px solid #ede9df' }}>
              <div className="text-[13px] font-bold text-[#0d1b2a]" style={SERIF}>{v}</div>
              <div className="text-[9px] text-[#a0a8b0]">{['Emergency', 'Goa Trip', 'iPhone'][i]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal rows + impact panel */}
      <div className="grid gap-3.5" style={{ gridTemplateColumns: '1fr 240px' }}>
        <div className="space-y-3">
          {goals.map((g, i) => <GoalRow key={g.id} g={g} index={i} />)}
        </div>
        <ImpactPanel onRedirect={() => setShowRedirect(true)} />
      </div>

      {/* Savings Scratch Board */}
      <SavingsBoard />

      {showRedirect && (
        <RedirectModal onClose={() => setShowRedirect(false)} onDone={handleRedirectDone} />
      )}
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </div>
  )
}
