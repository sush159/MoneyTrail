import { useState } from 'react'
import { Toast, Modal, ModalBtn } from '../components/Overlays'

const serif = { fontFamily: "'Playfair Display', Georgia, serif" }

/* ── Brand logo SVGs ─────────────────────────────────────────── */
const LOGOS = {
  LinkedIn: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
      <rect width="24" height="24" rx="4" fill="#0A66C2"/>
      <path d="M7.5 9.5h-2v8h2v-8zm-1-3a1.1 1.1 0 1 0 0 2.2A1.1 1.1 0 0 0 6.5 6.5zm4 3h-1.9v8H10.5v-4.2c0-1.1.2-2.2 1.6-2.2 1.3 0 1.4 1.2 1.4 2.3v4.1h2v-4.6c0-2.2-.5-3.4-2.5-3.4z" fill="white"/>
    </svg>
  ),
  Hotstar: (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <rect width="24" height="24" rx="4" fill="#0A1835"/>
      <text x="3" y="17" fontSize="10" fontWeight="900" fill="#00A8FF">D+</text>
    </svg>
  ),
  Spotify: (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <rect width="24" height="24" rx="12" fill="#1DB954"/>
      <path d="M16.7 10.7c-2.8-1.6-7.3-1.8-9.9-1 a.65.65 0 0 0 .4 1.24c2.2-.7 6-.5 8.4.9a.65.65 0 0 0 .88-.24.65.65 0 0 0-.24-.88l.5.01zm-.2 2.4c-.2.34-.65.44-1 .24-2.3-1.4-5.8-1.8-8.5-.98a.75.75 0 0 0-.5.94.75.75 0 0 0 .94.5c2.4-.73 5.6-.37 7.6.87a.75.75 0 0 0 1.02-.28l-.06-.3zm-.4 2.3a.6.6 0 0 1-.82.2C13 14.5 10 14.2 7.6 14.9a.6.6 0 0 1-.35-1.14c2.7-.82 6-.47 8.3 1a.6.6 0 0 1 .2.82l.3-.08z" fill="white"/>
    </svg>
  ),
  Zee5: (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <rect width="24" height="24" rx="4" fill="#7B2FBE"/>
      <text x="4" y="17" fontSize="9" fontWeight="900" fill="white">ZEE5</text>
    </svg>
  ),
  Netflix: (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <rect width="24" height="24" rx="3" fill="#141414"/>
      <path d="M7 4v16l3.5-9.5L14 20V4h-3v8.5L9 4H7z" fill="#E50914"/>
    </svg>
  ),
}

const INIT_SUBS = [
  { id: 1, logoKey: 'LinkedIn', name: 'LinkedIn Premium', status: 'Graveyard', amount: 1600, daysAgo: 112, action: 'Cancel',    actionColor: '#b03040', actionBg: '#fdecea', isDead: true  },
  { id: 2, logoKey: 'Hotstar',  name: 'Disney+ Hotstar', status: 'Dead',      amount: 299,  daysAgo: 73,  action: 'Cancel',    actionColor: '#b03040', actionBg: '#fdecea', isDead: true  },
  { id: 3, logoKey: 'Spotify',  name: 'Spotify Premium', status: 'Dead',      amount: 119,  daysAgo: 48,  action: 'Downgrade', actionColor: '#8a6520', actionBg: '#fdf6e3', isDead: true  },
  { id: 4, logoKey: 'Zee5',     name: 'ZEE5',            status: 'Dormant',   amount: 99,   daysAgo: 22,  action: 'Review',    actionColor: '#8a6520', actionBg: '#fdf6e3', isDead: false },
  { id: 5, logoKey: 'Netflix',  name: 'Netflix',         status: 'Active',    amount: 649,  daysAgo: 2,   action: 'Keep',      actionColor: '#2e6b55', actionBg: '#e6f2ec', isDead: false },
]

const STATUS_STYLE = {
  Graveyard:  { bg: '#f3e8ff', text: '#7c3aed' },
  Dead:       { bg: '#fdecea', text: '#b03040' },
  Dormant:    { bg: '#fdf6e3', text: '#8a6520' },
  Active:     { bg: '#e6f2ec', text: '#2e6b55' },
  Cancelled:  { bg: '#f3f0e8', text: '#8a9aaa' },
  Downgraded: { bg: '#eef3f8', text: '#3a5878' },
  Kept:       { bg: '#e6f2ec', text: '#2e6b55' },
  Reviewed:   { bg: '#fdf6e3', text: '#8a6520' },
}

function StatusPill({ status }) {
  const c = STATUS_STYLE[status] || { bg: '#f0f0f0', text: '#555' }
  return (
    <span style={{ background: c.bg, color: c.text }}
      className="text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap">
      {status}
    </span>
  )
}

/* ── Confirm Cancel Modal ───────────────────────────────────────── */
function CancelModal({ sub, onConfirm, onClose }) {
  return (
    <Modal title={`Cancel ${sub.name}?`} onClose={onClose} width={400}>
      <div style={{ textAlign: 'center', padding: '4px 0 18px' }}>
        <div style={{ fontSize: 44, marginBottom: 10, display: 'flex', justifyContent: 'center' }}>
          <span style={{ transform: 'scale(2)', display: 'inline-block' }}>{LOGOS[sub.logoKey]}</span>
        </div>
        <p style={{ fontSize: 13, color: '#2a3f52', lineHeight: 1.6, marginBottom: 8 }}>
          You'll save <strong style={{ color: '#2e6b55' }}>₹{sub.amount.toLocaleString('en-IN')}/mo</strong> — that's{' '}
          <strong style={{ color: '#2e6b55' }}>₹{(sub.amount * 12).toLocaleString('en-IN')}/year</strong>.
        </p>
        <p style={{ fontSize: 12, color: '#8a9aaa', marginBottom: 0 }}>
          Last used {sub.daysAgo} days ago. This subscription is not adding value.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <ModalBtn variant="ghost" onClick={onClose}>Keep It</ModalBtn>
        <ModalBtn variant="red" onClick={onConfirm}>Yes, Cancel →</ModalBtn>
      </div>
    </Modal>
  )
}

/* ── Cancel All Dead Modal ──────────────────────────────────────── */
function CancelAllModal({ subs, onConfirm, onClose }) {
  const dead    = subs.filter(s => s.isDead && s.status !== 'Cancelled')
  const monthly = dead.reduce((t, s) => t + s.amount, 0)
  return (
    <Modal title="Cancel All Dead Subscriptions" onClose={onClose} width={440}>
      <p style={{ fontSize: 12.5, color: '#8a9aaa', marginBottom: 14 }}>
        These {dead.length} subscriptions haven't been used recently:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        {dead.map(s => (
          <div key={s.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', borderRadius: 8,
            background: '#fdecea', border: '1px solid rgba(176,48,64,0.15)',
          }}>
            <span style={{ display: 'flex' }}>{LOGOS[s.logoKey]}</span>
            <span style={{ flex: 1, fontSize: 13, color: '#0d1b2a', fontWeight: 500 }}>{s.name}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#b03040' }}>
              -₹{s.amount.toLocaleString('en-IN')}/mo
            </span>
          </div>
        ))}
      </div>
      <div style={{
        background: '#e8f3ee', borderRadius: 10, padding: '10px 14px',
        fontSize: 13, color: '#2e6b55', fontWeight: 600, marginBottom: 18,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>Total monthly saving</span>
        <span>₹{monthly.toLocaleString('en-IN')}/mo → ₹{(monthly * 12).toLocaleString('en-IN')}/yr</span>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <ModalBtn variant="ghost" onClick={onClose}>Not Now</ModalBtn>
        <ModalBtn variant="red" onClick={onConfirm}>Cancel All {dead.length} →</ModalBtn>
      </div>
    </Modal>
  )
}

/* ── Redirect Modal ─────────────────────────────────────────────── */
function RedirectModal({ onConfirm, onClose }) {
  const [dest, setDest] = useState('emergency')
  const opts = [
    { id: 'emergency', label: 'Emergency Fund',      emoji: '🏦', desc: 'Hit goal 9 months sooner'    },
    { id: 'sip',       label: 'SIP / Mutual Fund',   emoji: '📈', desc: '₹42K+ at 12% XIRR in 12mo' },
    { id: 'goa',       label: 'Goa Trip Goal',        emoji: '✈️', desc: 'Reach ₹25,000 by April'    },
  ]
  return (
    <Modal title="Set Up Auto-Redirect" onClose={onClose} width={420}>
      <p style={{ fontSize: 12.5, color: '#8a9aaa', marginBottom: 14 }}>
        Redirect ₹3,218/mo saved from cancelled subs to:
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
              <div style={{ fontSize: 11, color: '#8a9aaa' }}>{o.desc}</div>
            </div>
            {dest === o.id && <span style={{ fontSize: 11, fontWeight: 700, color: '#2e6b55' }}>✓</span>}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <ModalBtn variant="ghost" onClick={onClose}>Cancel</ModalBtn>
        <ModalBtn variant="green" onClick={() => onConfirm(opts.find(o => o.id === dest))}>
          Activate Redirect →
        </ModalBtn>
      </div>
    </Modal>
  )
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function Graveyard() {
  const [subs,         setSubs]         = useState(INIT_SUBS)
  const [toast,        setToast]        = useState(null)
  const [cancelTarget, setCancelTarget] = useState(null)   // sub to cancel individually
  const [showCancelAll,setShowCancelAll]= useState(false)
  const [showRedirect, setShowRedirect] = useState(false)

  /* ── Actions ─────────────────────────── */
  function markSub(id, newStatus, newAction = null) {
    setSubs(prev => prev.map(s =>
      s.id === id
        ? { ...s, status: newStatus, isDead: false, action: newAction ?? s.action,
            actionColor: '#8a9aaa', actionBg: '#f3f0e8' }
        : s
    ))
  }

  function handleAction(sub) {
    if (sub.action === 'Cancel' && sub.status !== 'Cancelled') {
      setCancelTarget(sub)
    } else if (sub.action === 'Downgrade') {
      markSub(sub.id, 'Downgraded', 'Downgraded')
      setToast({ msg: `${sub.name} downgraded to Free plan — saving ₹${sub.amount}/mo`, type: 'info' })
    } else if (sub.action === 'Review') {
      markSub(sub.id, 'Reviewed', 'Reviewed')
      setToast({ msg: `${sub.name} marked for review — we'll remind you in 7 days`, type: 'warn' })
    } else if (sub.action === 'Keep') {
      markSub(sub.id, 'Kept', 'Kept')
      setToast({ msg: `${sub.name} kept — noted ✓`, type: 'success' })
    }
  }

  function confirmCancel(sub) {
    markSub(sub.id, 'Cancelled', 'Cancelled')
    setCancelTarget(null)
    setToast({ msg: `${sub.name} cancelled — saving ₹${sub.amount}/mo 🎉`, type: 'success' })
  }

  function confirmCancelAll() {
    const dead = subs.filter(s => s.isDead && s.status !== 'Cancelled')
    setSubs(prev => prev.map(s =>
      s.isDead && s.status !== 'Cancelled'
        ? { ...s, status: 'Cancelled', isDead: false, action: 'Cancelled', actionColor: '#8a9aaa', actionBg: '#f3f0e8' }
        : s
    ))
    setShowCancelAll(false)
    const saved = dead.reduce((t, s) => t + s.amount, 0)
    setToast({ msg: `${dead.length} subs cancelled — saving ₹${saved.toLocaleString('en-IN')}/mo 🎉`, type: 'success' })
  }

  function confirmRedirect(dest) {
    setShowRedirect(false)
    setToast({ msg: `₹3,218/mo will now auto-redirect to "${dest.label}" 🚀`, type: 'success' })
  }

  /* ── Derived stats ───────────────────── */
  const activeWaste   = subs.filter(s => s.isDead).reduce((t, s) => t + s.amount, 0)
  const cancelledSave = subs.filter(s => s.status === 'Cancelled').reduce((t, s) => t + s.amount, 0)
  const deadCount     = subs.filter(s => s.isDead).length

  return (
    <div className="space-y-5">
      <div>
        <h1 style={serif} className="text-2xl font-bold text-[#0d1b2a]">Subscription Graveyard</h1>
        <p className="text-sm text-[#8a9aaa] mt-0.5">Subscriptions you're paying for but not using</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#e9e5d8] shadow-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8a9aaa] mb-1">Monthly Waste</p>
          <p style={serif} className="text-3xl font-bold text-[#b03040]">
            ₹{activeWaste > 0 ? activeWaste.toLocaleString('en-IN') : '0'}
          </p>
          <p className="text-sm text-[#b03040] font-medium mt-1">
            {deadCount > 0 ? `${deadCount} dead subscription${deadCount > 1 ? 's' : ''}` : 'All cleared! 🎉'}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-[#e9e5d8] shadow-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8a9aaa] mb-1">Annual Drain</p>
          <p style={serif} className="text-3xl font-bold text-[#b5622a]">₹38,616</p>
          <p className="text-sm text-[#b5622a] font-medium mt-1">Every year, silently</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#e9e5d8] shadow-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8a9aaa] mb-1">
            {cancelledSave > 0 ? 'Rescued This Session' : 'SIP Potential'}
          </p>
          <p style={serif} className="text-3xl font-bold text-[#2e6b55]">
            {cancelledSave > 0 ? `₹${cancelledSave.toLocaleString('en-IN')}/mo` : '₹42K+'}
          </p>
          <p className="text-sm text-[#2e6b55] font-medium mt-1">
            {cancelledSave > 0 ? `₹${(cancelledSave * 12).toLocaleString('en-IN')}/yr saved 🎉` : 'If redirected to SIP'}
          </p>
        </div>
      </div>

      {/* Subscription List */}
      <div className="bg-white rounded-2xl border border-[#e9e5d8] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f3f0e8]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#fdecea] flex items-center justify-center text-base">💀</div>
            <div>
              <p className="text-sm font-semibold text-[#0d1b2a]">All Subscriptions</p>
              <p className="text-xs text-[#8a9aaa]">5 subscriptions · ₹2,766/mo</p>
            </div>
          </div>
          {deadCount > 0 ? (
            <button
              onClick={() => setShowCancelAll(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white hover:opacity-80 transition-opacity cursor-pointer"
              style={{ background: '#b03040' }}>
              Cancel All Dead ({deadCount})
            </button>
          ) : (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: '#e8f3ee', color: '#2e6b55' }}>
              ✓ All cleared!
            </span>
          )}
        </div>

        <div className="divide-y divide-[#f3f0e8]">
          {subs.map(sub => {
            const isDone = ['Cancelled','Downgraded','Kept','Reviewed'].includes(sub.status)
            return (
              <div key={sub.id}
                className="flex items-center gap-3 px-5 py-4 transition-all duration-300"
                style={{ opacity: isDone ? 0.55 : 1 }}>
                <span className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                  style={{ filter: isDone ? 'grayscale(1)' : 'none', opacity: isDone ? 0.5 : 1 }}>
                  {LOGOS[sub.logoKey]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0d1b2a] truncate"
                    style={{ textDecoration: sub.status === 'Cancelled' ? 'line-through' : 'none' }}>
                    {sub.name}
                  </p>
                  <p className="text-xs text-[#8a9aaa] mt-0.5">Last used {sub.daysAgo} days ago</p>
                </div>
                <StatusPill status={sub.status} />
                <span className="text-sm font-bold text-[#0d1b2a] w-16 text-right flex-shrink-0">
                  ₹{sub.amount.toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => !isDone && handleAction(sub)}
                  disabled={isDone}
                  className="text-xs font-semibold px-3 py-1 rounded-lg flex-shrink-0 transition-all"
                  style={{
                    background: isDone ? '#f3f0e8' : sub.actionBg,
                    color: isDone ? '#8a9aaa' : sub.actionColor,
                    cursor: isDone ? 'default' : 'pointer',
                  }}>
                  {isDone ? '✓ Done' : sub.action}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Redirect CTA */}
      <div className="rounded-2xl border border-[#c5e0d4] p-5"
        style={{ background: 'linear-gradient(135deg, #e6f2ec 0%, #d0ead9 100%)' }}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl flex-shrink-0 shadow-sm">🚀</div>
          <div className="flex-1">
            <p className="text-sm font-bold text-[#0d1b2a]">Cancel 4 dead subs → ₹38,616/year redirected to SIP</p>
            <p className="text-xs text-[#2e6b55] mt-1">
              At 12% XIRR, this becomes <span className="font-bold">₹43,700+</span> in 12 months.
              Your emergency fund goal could be hit <span className="font-bold">9 months sooner.</span>
            </p>
          </div>
          <button
            onClick={() => setShowRedirect(true)}
            className="text-xs font-semibold px-4 py-2 rounded-lg text-white flex-shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
            style={{ background: '#2e6b55' }}>
            Redirect Now →
          </button>
        </div>
      </div>

      {/* Modals */}
      {cancelTarget && (
        <CancelModal
          sub={cancelTarget}
          onConfirm={() => confirmCancel(cancelTarget)}
          onClose={() => setCancelTarget(null)}
        />
      )}
      {showCancelAll && (
        <CancelAllModal
          subs={subs}
          onConfirm={confirmCancelAll}
          onClose={() => setShowCancelAll(false)}
        />
      )}
      {showRedirect && (
        <RedirectModal
          onConfirm={confirmRedirect}
          onClose={() => setShowRedirect(false)}
        />
      )}

      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </div>
  )
}
