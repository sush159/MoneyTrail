import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

/* ─────────────────────────────────────────────
   TOAST  –  pass { msg, type:'success'|'error'|'info'|'warn', onDone }
   Auto-dismisses after 3 s; parent clears via onDone.
───────────────────────────────────────────── */
const TOAST_STYLES = {
  success: { bg: '#e8f3ee', border: '#c5e0d4', icon: '✓', iconBg: '#2e6b55', text: '#2e6b55' },
  error:   { bg: '#fdecea', border: '#f0c0c0', icon: '✕', iconBg: '#b03040', text: '#b03040' },
  warn:    { bg: '#fdf6e3', border: '#e8d8a0', icon: '!', iconBg: '#8a6520', text: '#8a6520' },
  info:    { bg: '#eef3f8', border: '#c0d4e8', icon: 'i', iconBg: '#3a5878', text: '#3a5878' },
}

export function Toast({ msg, type = 'success', onDone }) {
  const s = TOAST_STYLES[type]
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])

  return createPortal(
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 12, padding: '12px 16px',
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
      maxWidth: 320, minWidth: 220,
      animation: 'toast-in 0.22s ease',
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        background: s.iconBg, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700, flexShrink: 0,
      }}>{s.icon}</div>
      <span style={{ fontSize: 12.5, color: '#0d1b2a', fontWeight: 500, flex: 1, lineHeight: 1.4 }}>{msg}</span>
      <button onClick={onDone} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#8a9aaa', display: 'flex' }}>
        <X size={14} />
      </button>
      <style>{`@keyframes toast-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>
    </div>,
    document.body
  )
}

/* ─────────────────────────────────────────────
   MODAL  –  pass { title, children, onClose, width? }
───────────────────────────────────────────── */
export function Modal({ title, children, onClose, width = 440 }) {
  const ref = useRef()

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(13,27,42,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'modal-bg 0.18s ease',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div ref={ref} style={{
        background: '#fff', borderRadius: 18, width, maxWidth: '92vw',
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        animation: 'modal-in 0.2s ease', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid #f0ede4',
        }}>
          <span style={{
            fontSize: 15, fontWeight: 600, color: '#0d1b2a',
            fontFamily: "'Playfair Display', Georgia, serif",
          }}>{title}</span>
          <button onClick={onClose} style={{
            background: '#f3f0e8', border: 'none', borderRadius: '50%',
            width: 28, height: 28, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: '#8a9aaa',
          }}>
            <X size={14} />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: '20px' }}>{children}</div>
      </div>
      <style>{`
        @keyframes modal-bg{from{opacity:0}to{opacity:1}}
        @keyframes modal-in{from{opacity:0;transform:scale(0.94) translateY(10px)}to{opacity:1;transform:none}}
      `}</style>
    </div>,
    document.body
  )
}

/* ─────────────────────────────────────────────
   Small reusable atoms used inside modals
───────────────────────────────────────────── */
export function ModalBtn({ children, onClick, variant = 'primary', disabled = false }) {
  const styles = {
    primary:  { background: '#0d1b2a', color: '#fff' },
    green:    { background: '#2e6b55', color: '#fff' },
    red:      { background: '#b03040', color: '#fff' },
    ghost:    { background: '#f3f0e8', color: '#2a3f52' },
    orange:   { background: '#b5622a', color: '#fff' },
  }
  const s = styles[variant]
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...s, border: 'none', borderRadius: 8,
        padding: '9px 18px', fontSize: 13, fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.15s',
      }}>
      {children}
    </button>
  )
}
