import { useState, useEffect, useRef } from 'react'
import { Toast, Modal, ModalBtn } from '../components/Overlays'

const serif = { fontFamily: "'Playfair Display', Georgia, serif" }
const mono  = { fontFamily: "'DM Mono', 'Courier New', monospace" }

/* ── Action Plan data ─────────────────────────────────────────── */
const ACTION_STEPS = [
  { emoji: '💀', title: 'Cancel 4 Dead Subscriptions', saving: '₹3,218/mo', status: 'urgent', desc: 'LinkedIn, Hotstar, Spotify (downgrade), Zee5. None used in 22–112 days.' },
  { emoji: '💰', title: 'Move ₹45,000 to Liquid Fund',  saving: '₹1,800–2,200/yr', status: 'easy', desc: 'Transfer idle savings to a liquid fund for 4–5% returns. Redeemable anytime.' },
  { emoji: '🍔', title: 'Set a Food Budget Alert',       saving: '₹1,800/mo',  status: 'easy', desc: "Set \u20B99,000/mo food limit. You're currently 20% above Coimbatore peer average." },
  { emoji: '🚀', title: 'Auto-Redirect to Emergency Fund', saving: '₹9 months sooner', status: 'smart', desc: 'Redirect cancelled sub money into your Emergency Fund goal monthly.' },
]

const STATUS_PILL = {
  urgent: { bg: '#fdecea', text: '#b03040', label: 'Urgent'   },
  easy:   { bg: '#e8f3ee', text: '#2e6b55', label: 'Quick Win' },
  smart:  { bg: '#eef3f8', text: '#3a5878', label: 'Smart'    },
}

/* ── Voice Briefing ──────────────────────────────────────────── */
const BRIEFING_LINES = [
  "Good morning, Arun. Here's your MoneyTrail briefing for March 2026.",
  "Your salary of ₹45,000 was received on March 1st.",
  "So far this month, ₹23,850 has been consumed across essentials and food.",
  "⚠ Warning: ₹13,950 — 31% of your income — has been wasted on unused subscriptions.",
  "4 subscriptions haven't been used in over 3 weeks. Top offender: LinkedIn at ₹1,600.",
  "Your food spend is ₹11,000 — ₹1,800 above the peer average for your age group.",
  "The good news: ₹5,000 has been invested this month. You're on track.",
  "Action item: Cancel dead subs and redirect ₹3,218 per month to your emergency fund.",
  "That single move gets you to your goal 9 months sooner. End of briefing.",
]

function VoiceBriefing({ onClose }) {
  const [lineIdx,   setLineIdx]   = useState(0)
  const [playing,   setPlaying]   = useState(true)
  const [progress,  setProgress]  = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!playing) return
    const duration = 6500  // ms per line
    const tick     = 80
    let elapsed    = 0
    timerRef.current = setInterval(() => {
      elapsed += tick
      setProgress(Math.min(100, (elapsed / duration) * 100))
      if (elapsed >= duration) {
        elapsed = 0
        setProgress(0)
        setLineIdx(prev => {
          if (prev + 1 >= BRIEFING_LINES.length) {
            setPlaying(false)
            clearInterval(timerRef.current)
            return prev
          }
          return prev + 1
        })
      }
    }, tick)
    return () => clearInterval(timerRef.current)
  }, [playing, lineIdx])

  const done = lineIdx >= BRIEFING_LINES.length - 1 && !playing

  return (
    <Modal title="🎙️ 60-Second Voice Briefing" onClose={onClose} width={460}>
      {/* Waveform animation */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 4, height: 40, marginBottom: 16,
      }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{
            width: 4, borderRadius: 2,
            background: playing ? '#3a5878' : '#e9e5d8',
            height: playing ? `${12 + Math.abs(Math.sin((Date.now() / 200 + i) * 0.8)) * 28}px` : '8px',
            transition: 'height 0.15s ease',
            animation: playing ? `wave ${0.6 + i * 0.05}s ease-in-out infinite alternate` : 'none',
          }} />
        ))}
      </div>

      {/* Current line */}
      <div style={{
        minHeight: 72, background: '#f3f0e8', borderRadius: 12,
        padding: '14px 16px', marginBottom: 12,
        fontSize: 13.5, color: '#0d1b2a', lineHeight: 1.65,
        fontStyle: 'italic',
      }}>
        "{BRIEFING_LINES[lineIdx]}"
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 4 }}>
        <div style={{ height: 4, background: '#e9e5d8', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
          <div style={{
            height: '100%', borderRadius: 2,
            width: `${((lineIdx / (BRIEFING_LINES.length - 1)) * 100 + progress / BRIEFING_LINES.length)}%`,
            background: '#3a5878', transition: 'width 0.08s linear',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#8a9aaa' }}>
          <span>Line {lineIdx + 1} of {BRIEFING_LINES.length}</span>
          <span>{done ? '✓ Complete' : playing ? '▶ Playing…' : '⏸ Paused'}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
        {!done && (
          <ModalBtn variant="ghost" onClick={() => setPlaying(p => !p)}>
            {playing ? '⏸ Pause' : '▶ Resume'}
          </ModalBtn>
        )}
        <ModalBtn variant="primary" onClick={onClose}>
          {done ? 'Done ✓' : 'Close'}
        </ModalBtn>
      </div>
      <style>{`@keyframes wave{from{height:8px}to{height:32px}}`}</style>
    </Modal>
  )
}

/* ── Action Plan Modal ────────────────────────────────────────── */
function ActionPlanModal({ onClose }) {
  const [done, setDone] = useState(new Set())
  const toggle = id => setDone(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const totalSavings = '₹41,834/yr'

  return (
    <Modal title="Your Action Plan" onClose={onClose} width={480}>
      <p style={{ fontSize: 12, color: '#8a9aaa', marginBottom: 16 }}>
        Complete these 4 steps to unlock <strong style={{ color: '#b5622a' }}>{totalSavings}</strong> in savings.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
        {ACTION_STEPS.map((step, i) => {
          const isDone = done.has(i)
          const pill = STATUS_PILL[step.status]
          return (
            <div key={i} onClick={() => toggle(i)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
                border: `1.5px solid ${isDone ? '#c5e0d4' : '#ede9df'}`,
                background: isDone ? '#e8f3ee' : '#faf8f3',
                transition: 'all 0.2s', opacity: isDone ? 0.7 : 1,
              }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${isDone ? '#2e6b55' : '#ddd8c8'}`,
                background: isDone ? '#2e6b55' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: isDone ? 13 : 14, color: isDone ? '#fff' : '#ccc',
              }}>
                {isDone ? '✓' : step.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isDone ? '#2e6b55' : '#0d1b2a',
                    textDecoration: isDone ? 'line-through' : 'none' }}>
                    {step.title}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 20,
                    background: pill.bg, color: pill.text,
                  }}>{pill.label}</span>
                </div>
                <div style={{ fontSize: 11, color: '#8a9aaa', lineHeight: 1.5 }}>{step.desc}</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#2e6b55', whiteSpace: 'nowrap', ...mono }}>
                {step.saving}
              </div>
            </div>
          )
        })}
      </div>
      <div style={{
        background: '#0d1b2a', borderRadius: 12, padding: '12px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
      }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
          {done.size} of {ACTION_STEPS.length} completed
        </span>
        <span style={{ ...serif, fontSize: 18, fontWeight: 700, color: '#f0c57a' }}>{totalSavings}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ModalBtn variant="ghost" onClick={onClose}>Close</ModalBtn>
      </div>
    </Modal>
  )
}

/* ── Dismiss badge ────────────────────────────────────────────── */
/* ── Page ─────────────────────────────────────────────────────── */
export default function Insights() {
  const [toast,         setToast]         = useState(null)
  const [showBriefing,  setShowBriefing]  = useState(false)
  const [showPlan,      setShowPlan]      = useState(false)
  const [dismissed,     setDismissed]     = useState(new Set())

  function dismiss(idx) {
    setDismissed(prev => new Set([...prev, idx]))
    setToast({ msg: 'Insight dismissed', type: 'info' })
  }

  const insightCards = [
    {
      icon: '💸', iconBg: '#fdecea',
      title: 'Dead Money in Savings Account',
      desc: <><span className="font-bold text-[#0d1b2a]">₹45,000</span> has been idle for <span className="font-bold text-[#0d1b2a]">6+ months</span>. Moving it to a liquid fund could earn <span className="font-bold text-[#2e6b55]">₹1,800–2,200/year</span> at 4–5% returns.</>,
      tag: 'Savings Leak', tagColor: '#b03040', tagBg: '#fdecea',
      cta: 'Move to Liquid Fund', ctaAction: () => setToast({ msg: 'Liquid fund transfer initiated — ₹45,000 moving to Parag Parikh Liquid Fund', type: 'success' }),
    },
    {
      icon: '🍔', iconBg: '#fef3ea',
      title: 'Food Spend 20% Above Peer Average',
      desc: <>Your monthly food spend is <span className="font-bold text-[#0d1b2a]">₹11,000</span> vs peer average of <span className="font-bold text-[#0d1b2a]">₹9,200</span> for Coimbatore users aged 22–35. That's <span className="font-bold text-[#b5622a]">₹1,800/mo</span> extra.</>,
      tag: 'Overspend', tagColor: '#b5622a', tagBg: '#fef3ea',
      cta: 'Set Food Budget', ctaAction: () => setToast({ msg: 'Food budget set to ₹9,000/mo — you\'ll get an alert at ₹8,000', type: 'success' }),
    },
    {
      icon: '🎯', iconBg: '#e6f2ec',
      title: 'Emergency Fund Goal: 9 Months Sooner',
      desc: <>Cancel your <span className="font-bold text-[#0d1b2a]">4 dead subscriptions</span> and redirect ₹3,218/mo to your emergency fund — you'd hit your goal <span className="font-bold text-[#2e6b55]">9 months sooner</span>.</>,
      tag: 'Opportunity', tagColor: '#2e6b55', tagBg: '#e6f2ec',
      cta: 'Go to Goals →', ctaAction: () => window.history.pushState({}, '', '/goals') || window.dispatchEvent(new PopStateEvent('popstate')),
    },
    {
      icon: '🎙️', iconBg: '#eef3f8',
      title: 'Voice Briefing Ready',
      desc: <>Your personalized <span className="font-bold text-[#0d1b2a]">60-second audio summary</span> is ready. Tap to hear your weekly financial digest — no reading required.</>,
      tag: 'Audio', tagColor: '#3a5878', tagBg: '#eef3f8',
      hasVoice: true,
    },
  ]

  const visible = insightCards.filter((_, i) => !dismissed.has(i))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={serif} className="text-2xl font-bold text-[#0d1b2a]">AI Detective Briefing</h1>
          <p className="text-sm text-[#8a9aaa] mt-0.5">Patterns spotted across your transactions</p>
        </div>
        <div className="text-xs font-bold px-3 py-1.5 rounded-full text-white" style={{ background: '#b03040' }}>
          {visible.length} New
        </div>
      </div>

      <div className="space-y-4">
        {insightCards.map((insight, idx) => {
          if (dismissed.has(idx)) return null
          return (
            <div key={idx} className="bg-white rounded-2xl border border-[#e9e5d8] shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: insight.iconBg }}>
                    {insight.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="text-sm font-semibold text-[#0d1b2a] leading-snug">{insight.title}</p>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                          style={{ background: insight.tagBg, color: insight.tagColor }}>
                          {insight.tag}
                        </span>
                        <button
                          onClick={() => dismiss(idx)}
                          className="text-[#c0bbb0] hover:text-[#8a9aaa] transition-colors cursor-pointer text-base leading-none"
                          title="Dismiss">×</button>
                      </div>
                    </div>
                    <p className="text-sm text-[#555] leading-relaxed">{insight.desc}</p>

                    {insight.hasVoice && (
                      <button
                        onClick={() => setShowBriefing(true)}
                        className="mt-3 flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity cursor-pointer"
                        style={{ background: '#3a5878' }}>
                        <span>▶</span> Play 60s Briefing
                      </button>
                    )}
                    {insight.cta && !insight.hasVoice && (
                      <button
                        onClick={insight.ctaAction}
                        className="mt-3 text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
                        style={{ background: insight.tagBg, color: insight.tagColor }}>
                        {insight.cta}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* AI Action Card */}
      <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, #0d1b2a 0%, #1e3a52 100%)' }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">🤖</div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">AI Summary</p>
            <p style={serif} className="text-xl font-bold text-white leading-snug">
              Estimated annual savings if you act on these insights
            </p>
            <p className="text-3xl font-bold mt-2" style={{ ...serif, color: '#f0c57a' }}>₹41,834</p>
            <p className="text-sm text-white/70 mt-2">
              Subscriptions cancelled + liquid fund move + food budget optimised.
            </p>
            <button
              onClick={() => setShowPlan(true)}
              className="mt-4 text-xs font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
              style={{ background: '#b5622a', color: '#fff' }}>
              View Action Plan →
            </button>
          </div>
        </div>
      </div>

      {showBriefing  && <VoiceBriefing   onClose={() => setShowBriefing(false)} />}
      {showPlan      && <ActionPlanModal  onClose={() => setShowPlan(false)} />}
      {toast         && <Toast {...toast} onDone={() => setToast(null)} />}
    </div>
  )
}
