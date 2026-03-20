import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Toast, Modal, ModalBtn } from './Overlays'
import { generateMoneyTrailPDF } from '../utils/generatePDF'

const PAGE_META = {
  '/':             ['Dashboard',              'March 2026'],
  '/trail':        ['First Rupee Trail',      'FIFO Allocation Engine'],
  '/graveyard':    ['Subscription Graveyard', '4 Dead Services Detected'],
  '/forecast':     ['Cash Flow Forecast',     'Predictive Engine · March 2026'],
  '/transactions': ['Transactions',           'March 2026 · 7 records'],
  '/insights':     ['AI Insights',            '3 New Insights'],
  '/goals':        ['Goals',                  '3 Active Goals'],
  '/health':       ['Spend Health',            'Your personal spending pulse'],
}

const BANKS = [
  { id: 'hdfc',  name: 'HDFC Bank',     logo: '🏦', color: '#004C8F' },
  { id: 'sbi',   name: 'SBI',           logo: '🏛️', color: '#1E5592' },
  { id: 'axis',  name: 'Axis Bank',     logo: '🔷', color: '#800000' },
  { id: 'icici', name: 'ICICI Bank',    logo: '🔶', color: '#F47B20' },
  { id: 'kotak', name: 'Kotak Mahindra',logo: '💎', color: '#E31837' },
]

function ConnectBankModal({ onClose, onConnected }) {
  const [selected, setSelected] = useState(null)
  const [step, setStep] = useState('pick') // pick | confirm | done

  function handleConnect() {
    setStep('done')
    setTimeout(() => { onClose(); onConnected(selected) }, 1200)
  }

  return (
    <Modal title="Connect Your Bank" onClose={onClose} width={420}>
      {step === 'pick' && (
        <>
          <p style={{ fontSize: 12.5, color: '#8a9aaa', marginBottom: 16 }}>
            Select your bank to auto-import transactions via Account Aggregator (AA framework).
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {BANKS.map(b => (
              <button key={b.id} onClick={() => setSelected(b)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                  border: `1.5px solid ${selected?.id === b.id ? b.color : '#ede9df'}`,
                  background: selected?.id === b.id ? `${b.color}0d` : '#faf8f3',
                  transition: 'all 0.15s',
                }}>
                <span style={{ fontSize: 22 }}>{b.logo}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0d1b2a', flex: 1, textAlign: 'left' }}>{b.name}</span>
                {selected?.id === b.id && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: b.color }}>✓ Selected</span>
                )}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <ModalBtn variant="ghost" onClick={onClose}>Cancel</ModalBtn>
            <ModalBtn variant="primary" onClick={() => setStep('confirm')} disabled={!selected}>
              Continue →
            </ModalBtn>
          </div>
        </>
      )}
      {step === 'confirm' && (
        <>
          <div style={{ textAlign: 'center', padding: '8px 0 20px' }}>
            <div style={{ fontSize: 42, marginBottom: 10 }}>{selected.logo}</div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#0d1b2a', marginBottom: 6 }}>
              Connect to {selected.name}?
            </p>
            <p style={{ fontSize: 12, color: '#8a9aaa', lineHeight: 1.6, marginBottom: 20 }}>
              MoneyTrail will read-only access your last 90 days of transactions
              via the RBI Account Aggregator framework. No passwords stored.
            </p>
            <div style={{
              background: '#e8f3ee', borderRadius: 10, padding: '10px 14px',
              fontSize: 11.5, color: '#2e6b55', textAlign: 'left', marginBottom: 20,
            }}>
              🔒 &nbsp;Your credentials are never shared. Data is encrypted end-to-end.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <ModalBtn variant="ghost" onClick={() => setStep('pick')}>← Back</ModalBtn>
            <ModalBtn variant="green" onClick={handleConnect}>Yes, Connect</ModalBtn>
          </div>
        </>
      )}
      {step === 'done' && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#2e6b55' }}>Connecting…</p>
        </div>
      )}
    </Modal>
  )
}

export default function Topbar() {
  const { pathname } = useLocation()
  const [title, sub] = PAGE_META[pathname] ?? ['MoneyTrail', '']

  const [toast,      setToast]      = useState(null)
  const [exporting,  setExporting]  = useState(false)
  const [showBank,   setShowBank]   = useState(false)

  function handleExportPDF() {
    setExporting(true)
    setTimeout(() => {
      try {
        const fileName = generateMoneyTrailPDF({ name: 'Arun Kumar' })
        setToast({ msg: `${fileName} downloaded successfully`, type: 'success' })
      } catch (err) {
        setToast({ msg: 'PDF export failed — try again', type: 'error' })
      }
      setExporting(false)
    }, 800)
  }

  function handleBankConnected(bank) {
    setToast({ msg: `${bank.name} connected! Importing transactions…`, type: 'success' })
  }

  return (
    <>
      <header className="h-14 min-h-14 bg-white border-b border-[#e9e5d8] flex items-center px-7 gap-3"
        style={{ boxShadow: '0 1px 0 #e9e5d8' }}>
        <div className="flex-1">
          <span className="text-[17px] text-[#0d1b2a]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '-0.2px' }}>
            {title}
          </span>
          {sub && (
            <span className="ml-2 text-[12px] text-[#8a9aaa] italic font-normal">{sub}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full"
            style={{ background: '#e8f3ee', color: '#2e6b55' }}>
            <span className="w-[5px] h-[5px] rounded-full pulse-dot" style={{ background: '#2e6b55' }} />
            Live
          </div>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="px-3 py-1.5 rounded-[6px] text-[12px] font-medium bg-transparent border border-[#e9e5d8] text-[#8a9aaa] hover:border-[#ddd8c8] hover:text-[#2a3f52] hover:bg-[#faf8f3] transition-all cursor-pointer disabled:opacity-60">
            {exporting ? '⏳ Exporting…' : 'Export PDF'}
          </button>
          <button
            onClick={() => setShowBank(true)}
            className="px-3 py-1.5 rounded-[6px] text-[12px] font-medium text-white cursor-pointer transition-all hover:opacity-90"
            style={{ background: '#0d1b2a' }}>
            Connect Bank
          </button>
        </div>
      </header>

      {showBank && (
        <ConnectBankModal
          onClose={() => setShowBank(false)}
          onConnected={handleBankConnected}
        />
      )}
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </>
  )
}
