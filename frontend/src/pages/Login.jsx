import { useState } from 'react'
import { Eye, EyeOff, ArrowRight, Zap, X } from 'lucide-react'

const SERIF = { fontFamily: "'Playfair Display', Georgia, serif" }

/* ── Sign Up Modal ────────────────────────────────────────────── */
function SignUpModal({ onClose, onSuccess }) {
  const [step,   setStep]   = useState(1)   // 1 = personal, 2 = bank, 3 = done
  const [form,   setForm]   = useState({
    name: '', email: '', phone: '',
    pan: '', dob: '',
    bankName: '', accountNo: '', ifsc: '', accountType: 'Savings',
  })
  const [errors, setErrors] = useState({})
  const [loading,setLoading]= useState(false)

  function set(k, v) { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }

  function validateStep1() {
    const e = {}
    if (!form.name.trim())  e.name  = 'Full name is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone))  e.phone = '10-digit mobile number'
    if (!form.dob.trim())   e.dob   = 'Date of birth required'
    return e
  }

  function validateStep2() {
    const e = {}
    if (!form.bankName.trim())   e.bankName   = 'Bank name required'
    if (!form.accountNo.trim() || form.accountNo.length < 9) e.accountNo = 'Valid account number (min 9 digits)'
    if (!form.ifsc.trim() || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc.toUpperCase())) e.ifsc = 'Valid IFSC code (e.g. HDFC0001234)'
    if (form.pan.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.pan.toUpperCase())) e.pan = 'Valid PAN (e.g. ABCDE1234F)'
    return e
  }

  function next() {
    const e = step === 1 ? validateStep1() : {}
    if (Object.keys(e).length) { setErrors(e); return }
    setStep(2)
  }

  function submit() {
    const e = validateStep2()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep(3) }, 1400)
  }

  const inp = (key, placeholder, type = 'text', extra = {}) => (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={e => set(key, e.target.value)}
        style={{
          width: '100%', padding: '10px 13px', borderRadius: 9, fontSize: 13,
          border: `1.5px solid ${errors[key] ? '#f0c0c0' : '#e9e5d8'}`,
          background: errors[key] ? '#fffafa' : '#faf8f3',
          color: '#0d1b2a', outline: 'none',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          ...extra,
        }}
        onFocus={e => e.target.style.borderColor = '#3a5878'}
        onBlur={e => e.target.style.borderColor = errors[key] ? '#f0c0c0' : '#e9e5d8'}
      />
      {errors[key] && <div style={{ fontSize: 11, color: '#b03040', marginTop: 4 }}>⚠ {errors[key]}</div>}
    </div>
  )

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(13,27,42,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
      animation: 'modal-bg 0.2s ease',
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, width: '100%', maxWidth: 460,
        boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
        animation: 'modal-in 0.22s ease', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0d1b2a, #1e3a52)',
          padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', ...SERIF }}>Create Account</div>
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
              Step {step === 3 ? 2 : step} of 2 — {step === 1 ? 'Personal Details' : step === 2 ? 'Bank Details' : 'Done!'}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} />
          </button>
        </div>

        {/* Step indicator */}
        {step < 3 && (
          <div style={{ display: 'flex', height: 3 }}>
            <div style={{ flex: 1, background: '#b5622a', transition: 'flex 0.3s' }} />
            <div style={{ flex: step >= 2 ? 1 : 0, background: '#2e6b55', transition: 'flex 0.4s' }} />
            <div style={{ flex: step >= 2 ? 0 : 1, background: '#e9e5d8' }} />
          </div>
        )}

        <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>

          {/* Step 1: Personal */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Row label="Full Name">        {inp('name',  'Arun Kumar')}                  </Row>
              <Row label="Email Address">    {inp('email', 'arun@example.com', 'email')}   </Row>
              <Row label="Mobile Number">    {inp('phone', '9876543210', 'tel')}            </Row>
              <Row label="Date of Birth">    {inp('dob',   '', 'date')}                     </Row>
              <Row label="PAN (optional)">
                {inp('pan', 'ABCDE1234F')}
                <div style={{ fontSize: 10.5, color: '#8a9aaa', marginTop: 4 }}>Used for tax-linked insights only. Not stored.</div>
              </Row>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button onClick={onClose} style={ghostBtn}>Cancel</button>
                <button onClick={next} style={primaryBtn('#b5622a')}>Continue → Bank Details</button>
              </div>
            </div>
          )}

          {/* Step 2: Bank */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Row label="Bank Name">
                <select value={form.bankName} onChange={e => set('bankName', e.target.value)}
                  style={{ width: '100%', padding: '10px 13px', borderRadius: 9, fontSize: 13, border: `1.5px solid ${errors.bankName ? '#f0c0c0' : '#e9e5d8'}`, background: '#faf8f3', color: '#0d1b2a', outline: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <option value="">Select your bank</option>
                  {['HDFC Bank','State Bank of India','ICICI Bank','Axis Bank','Kotak Mahindra Bank','Yes Bank','Bank of Baroda','Punjab National Bank','Canara Bank','IndusInd Bank'].map(b => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
                {errors.bankName && <div style={{ fontSize: 11, color: '#b03040', marginTop: 4 }}>⚠ {errors.bankName}</div>}
              </Row>
              <Row label="Account Number">  {inp('accountNo', '0001234567890', 'text')} </Row>
              <Row label="IFSC Code">
                {inp('ifsc', 'HDFC0001234')}
                <div style={{ fontSize: 10.5, color: '#8a9aaa', marginTop: 4 }}>11-character code on your cheque book or passbook</div>
              </Row>
              <Row label="Account Type">
                <div style={{ display: 'flex', gap: 8 }}>
                  {['Savings','Current','Salary'].map(t => (
                    <button key={t} onClick={() => set('accountType', t)}
                      style={{
                        flex: 1, padding: '8px', borderRadius: 8, fontSize: 12.5, fontWeight: 600,
                        cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                        border: `1.5px solid ${form.accountType === t ? '#3a5878' : '#e9e5d8'}`,
                        background: form.accountType === t ? '#eef3f8' : '#faf8f3',
                        color: form.accountType === t ? '#3a5878' : '#8a9aaa',
                      }}>
                      {t}
                    </button>
                  ))}
                </div>
              </Row>

              <div style={{
                background: '#e8f3ee', borderRadius: 10, padding: '10px 14px',
                fontSize: 11.5, color: '#2e6b55', lineHeight: 1.6,
              }}>
                🔒 Read-only access via RBI Account Aggregator framework.
                We never store your credentials or transfer funds.
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button onClick={() => setStep(1)} style={ghostBtn}>← Back</button>
                <button onClick={submit} disabled={loading} style={primaryBtn('#2e6b55')}>
                  {loading ? '⏳ Creating…' : 'Create Account →'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#0d1b2a', marginBottom: 8, ...SERIF }}>
                Account Created!
              </div>
              <div style={{ fontSize: 13, color: '#8a9aaa', lineHeight: 1.7, marginBottom: 24 }}>
                Welcome, <strong style={{ color: '#0d1b2a' }}>{form.name}</strong>!<br />
                Your MoneyTrail account is ready. We're connecting to {form.bankName || 'your bank'} now.
              </div>
              <button onClick={() => { onClose(); onSuccess() }} style={{ ...primaryBtn('#b5622a'), width: '100%', justifyContent: 'center', padding: '13px 20px' }}>
                Enter MoneyTrail →
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes modal-bg{from{opacity:0}to{opacity:1}}
        @keyframes modal-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
      `}</style>
    </div>
  )
}

function Row({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#5a6a7a', marginBottom: 5, letterSpacing: '0.2px', textTransform: 'uppercase' }}>{label}</label>
      {children}
    </div>
  )
}

const ghostBtn = {
  flex: 1, padding: '10px', borderRadius: 9, cursor: 'pointer',
  background: '#f3f0e8', border: 'none', color: '#2a3f52', fontSize: 13, fontWeight: 600,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
}
const primaryBtn = (bg) => ({
  flex: 2, padding: '10px', borderRadius: 9, cursor: 'pointer',
  background: bg, border: 'none', color: '#fff', fontSize: 13, fontWeight: 600,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
})

/* ── Floating preview cards — repositioned to right side ─────── */
const FLOAT_CARDS = [
  {
    style: { top: '12%', left: '56%' },
    content: (
      <div style={{ padding: '11px 15px', minWidth: 160 }}>
        <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.7px', color: 'rgba(255,255,255,0.4)', marginBottom: 5, textTransform: 'uppercase' }}>Monthly Leak</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#f0c57a', fontFamily: "'Playfair Display', serif" }}>₹3,218</div>
        <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>4 dead subscriptions</div>
        <div style={{ marginTop: 7, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
          <div style={{ width: '71%', height: '100%', borderRadius: 2, background: '#b03040' }} />
        </div>
      </div>
    ),
    delay: '0s', duration: '6s',
  },
  {
    style: { top: '44%', left: '54%' },
    content: (
      <div style={{ padding: '11px 15px', minWidth: 155 }}>
        <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.7px', color: 'rgba(255,255,255,0.4)', marginBottom: 5, textTransform: 'uppercase' }}>Invested</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#4aab7a', fontFamily: "'Playfair Display', serif" }}>₹5,000</div>
        <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>↑ On track this month</div>
        <div style={{ display: 'flex', gap: 3, marginTop: 7, alignItems: 'flex-end' }}>
          {[40, 55, 48, 65, 72, 60, 80].map((h, i) => (
            <div key={i} style={{ flex: 1, height: h * 0.28, borderRadius: 2, background: '#4aab7a', opacity: 0.5 + i * 0.07 }} />
          ))}
        </div>
      </div>
    ),
    delay: '1.5s', duration: '7s',
  },
  {
    style: { bottom: '18%', right: '6%' },
    content: (
      <div style={{ padding: '11px 15px', minWidth: 165 }}>
        <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.7px', color: 'rgba(255,255,255,0.4)', marginBottom: 5, textTransform: 'uppercase' }}>Emergency Fund</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#7aadd4', fontFamily: "'Playfair Display', serif" }}>22%</div>
          <div style={{ flex: 1 }}>
            <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <div style={{ width: '22%', height: '100%', borderRadius: 3, background: '#7aadd4' }} />
            </div>
            <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>₹22K of ₹1L</div>
          </div>
        </div>
      </div>
    ),
    delay: '0.8s', duration: '5.5s',
  },
]

/* ── Left panel ──────────────────────────────────────────────── */
function LeftPanel() {
  return (
    <div style={{
      flex: '0 0 48%', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(145deg, #0d1b2a 0%, #162536 50%, #0d2235 100%)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Glows */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 70% 50% at 10% 10%, rgba(181,98,42,0.10) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 85% 85%, rgba(46,107,85,0.08) 0%, transparent 60%)
        `,
      }} />
      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
        backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      {/* Logo */}
      <div style={{ position: 'relative', padding: '32px 40px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #b5622a 0%, #c97840 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(181,98,42,0.35)',
          }}>
            <svg viewBox="0 0 15 15" style={{ width: 16, height: 16, fill: 'white' }}>
              <path d="M7.5 1a6.5 6.5 0 1 0 0 13A6.5 6.5 0 0 0 7.5 1zm.625 3.375a.625.625 0 0 0-1.25 0v3.363L4.97 8.78a.625.625 0 0 0 .625 1.082l2.03-1.172a.625.625 0 0 0 .5-.546V4.375z"/>
            </svg>
          </div>
          <span style={{ fontSize: 19, color: 'rgba(255,255,255,0.9)', ...SERIF }}>MoneyTrail</span>
        </div>
      </div>

      {/* Main copy — left-aligned, cards float on RIGHT */}
      <div style={{ position: 'relative', padding: '0 40px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '60%' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(181,98,42,0.15)', border: '1px solid rgba(181,98,42,0.25)',
          borderRadius: 20, padding: '4px 12px', marginBottom: 18, width: 'fit-content',
        }}>
          <Zap size={10} color="#c97840" />
          <span style={{ fontSize: 10.5, color: '#c97840', fontWeight: 600, letterSpacing: '0.3px' }}>Forensic Finance</span>
        </div>

        <h1 style={{ ...SERIF, fontSize: 36, lineHeight: 1.22, color: 'rgba(255,255,255,0.92)', marginBottom: 14, fontWeight: 400 }}>
          Know where<br />every <em style={{ color: '#c97840' }}>rupee</em><br />goes.
        </h1>

        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.40)', lineHeight: 1.75, maxWidth: 260, marginBottom: 28 }}>
          MoneyTrail traces your salary from entry to exit — exposing leaks, dead subscriptions, and hidden shortfalls before they hurt.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {['Rupee Trail','Sub Graveyard','Cash Forecast','AI Insights','Spend Health'].map(f => (
            <span key={f} style={{
              fontSize: 10.5, fontWeight: 500, padding: '4px 11px', borderRadius: 20,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
              color: 'rgba(255,255,255,0.4)',
            }}>{f}</span>
          ))}
        </div>
      </div>

      {/* Floating cards — RIGHT side only, won't overlap text */}
      {FLOAT_CARDS.map((card, i) => (
        <div key={i} style={{
          position: 'absolute', ...card.style,
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 13,
          boxShadow: '0 8px 28px rgba(0,0,0,0.25)',
          animation: `float-bob ${card.duration} ease-in-out infinite`,
          animationDelay: card.delay,
        }}>
          {card.content}
        </div>
      ))}

      {/* Bottom */}
      <div style={{ position: 'relative', padding: '0 40px 28px' }}>
        <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.18)' }}>Built for salaried India · March 2026</div>
      </div>

      <style>{`
        @keyframes float-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
      `}</style>
    </div>
  )
}

/* ── Right form panel ─────────────────────────────────────────── */
function RightPanel({ onLogin, onSignUp }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [errors,   setErrors]   = useState({})
  const [shake,    setShake]    = useState(false)

  function validate() {
    const e = {}
    if (!email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email'
    if (!password.trim()) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Minimum 6 characters'
    return e
  }

  function handleLogin(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); setShake(true); setTimeout(() => setShake(false), 500); return }
    setErrors({}); setLoading(true)
    setTimeout(() => { setLoading(false); onLogin() }, 1600)
  }

  const iStyle = (err) => ({
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: `1.5px solid ${err ? '#f0c0c0' : '#e9e5d8'}`,
    background: err ? '#fffafa' : '#faf8f3',
    fontSize: 13.5, color: '#0d1b2a', outline: 'none',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  })

  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#faf8f3', padding: '40px 48px', overflowY: 'auto',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ ...SERIF, fontSize: 26, color: '#0d1b2a', fontWeight: 400, marginBottom: 5 }}>Welcome back</h2>
          <p style={{ fontSize: 13, color: '#8a9aaa' }}>Sign in to your MoneyTrail account</p>
        </div>

        {/* Demo CTA */}
        <button onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); onLogin() }, 900) }}
          disabled={loading}
          style={{
            width: '100%', padding: '13px 20px', borderRadius: 12, cursor: 'pointer',
            background: 'linear-gradient(135deg, #0d1b2a 0%, #1e3a52 100%)',
            border: 'none', color: '#fff', fontSize: 13.5, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            marginBottom: 22, opacity: loading ? 0.7 : 1,
            boxShadow: '0 4px 16px rgba(13,27,42,0.18)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
          <Zap size={14} color="#c97840" />
          Try Demo — no sign-up needed
          <ArrowRight size={13} />
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
          <div style={{ flex: 1, height: 1, background: '#e9e5d8' }} />
          <span style={{ fontSize: 11.5, color: '#b8c4ce', fontWeight: 500 }}>or sign in</span>
          <div style={{ flex: 1, height: 1, background: '#e9e5d8' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ animation: shake ? 'shake 0.4s ease' : 'none' }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#5a6a7a', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.2px' }}>Email</label>
            <input type="email" placeholder="arun@example.com" value={email}
              onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
              style={iStyle(!!errors.email)}
              onFocus={e => e.target.style.borderColor = '#3a5878'}
              onBlur={e => e.target.style.borderColor = errors.email ? '#f0c0c0' : '#e9e5d8'}
            />
            {errors.email && <div style={{ fontSize: 11.5, color: '#b03040', marginTop: 4 }}>⚠ {errors.email}</div>}
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#5a6a7a', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.2px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password}
                onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
                style={{ ...iStyle(!!errors.password), paddingRight: 42 }}
                onFocus={e => e.target.style.borderColor = '#3a5878'}
                onBlur={e => e.target.style.borderColor = errors.password ? '#f0c0c0' : '#e9e5d8'}
              />
              <button type="button" onClick={() => setShowPw(v => !v)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8a9aaa', display: 'flex' }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <div style={{ fontSize: 11.5, color: '#b03040', marginTop: 4 }}>⚠ {errors.password}</div>}
          </div>

          <div style={{ textAlign: 'right', marginBottom: 20 }}>
            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#3a5878', textDecoration: 'underline', textUnderlineOffset: 3, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Forgot password?
            </button>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px', borderRadius: 12, cursor: 'pointer',
            background: loading ? '#8a9aaa' : '#b5622a', border: 'none', color: '#fff',
            fontSize: 13.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            boxShadow: loading ? 'none' : '0 4px 16px rgba(181,98,42,0.25)',
          }}>
            {loading ? '⏳ Signing in…' : <><span>Sign In</span><ArrowRight size={14} /></>}
          </button>
        </form>

        {/* Sign up link */}
        <div style={{ marginTop: 22, textAlign: 'center' }}>
          <span style={{ fontSize: 12.5, color: '#8a9aaa' }}>Don't have an account? </span>
          <button onClick={onSignUp} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, color: '#b5622a', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Create account
          </button>
        </div>

        {/* Trust note */}
        <div style={{ marginTop: 26, padding: '11px 13px', borderRadius: 10, background: '#f3f0e8', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 14 }}>🔒</span>
          <p style={{ fontSize: 10.5, color: '#8a9aaa', lineHeight: 1.6, margin: 0 }}>
            Encrypted end-to-end · Read-only AA framework · Passwords never stored
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
      `}</style>
    </div>
  )
}

export default function Login({ onLogin }) {
  const [showSignUp, setShowSignUp] = useState(false)
  return (
    <>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <LeftPanel />
        <RightPanel onLogin={onLogin} onSignUp={() => setShowSignUp(true)} />
      </div>
      {showSignUp && (
        <SignUpModal onClose={() => setShowSignUp(false)} onSuccess={onLogin} />
      )}
    </>
  )
}
