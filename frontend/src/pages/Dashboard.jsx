import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { AlertTriangle, X } from 'lucide-react'
import { Toast, Modal, ModalBtn } from '../components/Overlays'

/* ── Constants ── */
const SERIF = { fontFamily: "'Playfair Display', Georgia, serif" }

const donutData = [
  { name: 'Consumed',  value: 23850, color: '#3a5878' },
  { name: 'Wasted',   value: 13950, color: '#b03040' },
  { name: 'Invested', value: 5000,  color: '#b5622a' },
  { name: 'Pending',  value: 2200,  color: '#ddd8c8' },
]

const weekData = [
  { week: 'W1', spend: 7200,  budget: 11250 },
  { week: 'W2', spend: 9400,  budget: 11250 },
  { week: 'W3', spend: 14800, budget: 11250 },
  { week: 'W4', spend: 18000, budget: 11250 },
]

const subs = [
  { emoji: '💼', name: 'LinkedIn Premium', meta: 'Last used 112 days ago', status: 'Graveyard', statusStyle: { background: '#f3ecf8', color: '#7a3fa0' }, amount: '₹1,600', amtColor: '#b03040', action: 'Cancel' },
  { emoji: '📺', name: 'Hotstar Premium',  meta: 'Last used 73 days ago',  status: 'Dead',      statusStyle: { background: '#f7e8ea', color: '#b03040' }, amount: '₹299',   amtColor: '#b03040', action: 'Cancel' },
  { emoji: '🎵', name: 'Spotify Premium',  meta: 'Last used 48 days ago',  status: 'Dead',      statusStyle: { background: '#f7e8ea', color: '#b03040' }, amount: '₹119',   amtColor: '#b03040', action: 'Downgrade' },
  { emoji: '🎬', name: 'Zee5',            meta: 'Last used 22 days ago',  status: 'Dormant',   statusStyle: { background: '#f8f2e0', color: '#8a6520' }, amount: '₹99',    amtColor: '#8a6520', action: 'Review' },
]

const calData = [
  // null = empty, 'safe', 'warn', 'danger', 'today'
  null, null, null,
  'safe','safe','safe','safe','safe','safe','safe',
  'safe','safe','safe','safe','safe','safe','safe',
  'safe','safe','safe','safe','warn','warn','warn',
  'warn','warn','warn','warn','warn','warn','warn',
  'today',
  'warn','warn','warn','warn','warn','warn',
  'danger','danger','danger','danger','danger',
  null,
]

const calDayNums = [
  null, null, null,
  1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,
  20,21,22,23,24,25,26,27,28,29,30,31,null
]

const CAL_STYLE = {
  safe:   { background: '#e8f3ee', color: '#2e6b55' },
  warn:   { background: '#f8f2e0', color: '#8a6520' },
  danger: { background: '#f7e8ea', color: '#b03040', border: '1px solid rgba(176,48,64,0.22)', fontWeight: 700 },
  today:  { background: '#0d1b2a', color: '#fff', fontWeight: 700 },
}

/* ── Sub-components ── */
function KpiCard({ label, value, valueColor, sub, pill, pillType }) {
  const pillStyles = {
    bad:  'pill-bad',
    good: 'pill-good',
    warn: 'pill-warn',
    dim:  'pill-dim',
  }
  return (
    <div className="kpi">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.6px] text-[#8a9aaa]">{label}</span>
        <span className="w-[7px] h-[7px] rounded-full" style={{ background: valueColor }} />
      </div>
      <div className="text-3xl leading-none mb-1.5" style={{ ...SERIF, color: valueColor }}>{value}</div>
      <div className="text-[11px] text-[#8a9aaa] mb-2.5">{sub}</div>
      <span className={pillStyles[pillType]}>{pill}</span>
    </div>
  )
}

function ChIcon({ color, bgColor, children }) {
  return (
    <div className="w-[26px] h-[26px] rounded-[6px] flex items-center justify-center flex-shrink-0"
      style={{ background: bgColor }}>
      <span style={{ color }}>{children}</span>
    </div>
  )
}

function DonutTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-[#e9e5d8] rounded-[8px] px-3 py-2 text-xs shadow-lift">
      <p className="font-semibold mb-0.5" style={{ color: payload[0].payload.color }}>{payload[0].name}</p>
      <p className="text-[#0d1b2a]">₹{payload[0].value.toLocaleString('en-IN')}</p>
    </div>
  )
}

function WeekTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-[#e9e5d8] rounded-[8px] px-3 py-2 text-xs shadow-lift">
      <p className="text-[#8a9aaa] font-semibold mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: ₹{p.value.toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  )
}

/* ── Page ── */
export default function Dashboard() {
  const [showAlert,   setShowAlert]   = useState(true)
  const [toast,       setToast]       = useState(null)
  const [showRedirect,setShowRedirect]= useState(false)
  const [redirectDone,setRedirectDone]= useState(false)

  return (
    <div className="space-y-[18px]">

      {/* Alert Banner */}
      {showAlert && (
        <div className="flex items-start gap-3 rounded-[10px] p-3 pr-4"
          style={{ background: '#f7e8ea', border: '1px solid rgba(176,48,64,0.22)', borderLeft: '3px solid #b03040' }}>
          <div className="w-[26px] h-[26px] rounded-[6px] flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: '#b03040' }}>
            <AlertTriangle size={13} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-[#b03040] mb-0.5">Shortfall Alert — March 27</div>
            <div className="text-[12px] text-[#2a3f52] leading-snug">
              At your current pace, balance runs dry on March 27 — four days before salary.
              Food is ₹2,800 over budget with 11 days left.
            </div>
          </div>
          <button onClick={() => setShowAlert(false)} className="text-[#8a9aaa] hover:text-[#0d1b2a] transition-colors mt-0.5 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-3">
        <KpiCard label="Leak Ratio"     value="31%"     valueColor="#b03040" sub="₹13,950 of ₹45,000 wasted"  pill="↑ +3% vs Feb"      pillType="bad"  />
        <KpiCard label="Dead Subs"      value="₹3,218"  valueColor="#b5622a" sub="4 services · per month"      pill="₹38,616/yr drain"  pillType="bad"  />
        <KpiCard label="Shortfall Date" value="Mar 27"  valueColor="#b03040" sub="4 days before salary"         pill="↑ 5 days earlier"  pillType="bad"  />
        <KpiCard label="Invested"       value="₹5,000"  valueColor="#2e6b55" sub="11.1% of monthly salary"     pill="↑ On track"        pillType="good" />
      </div>

      {/* Row 2: Donut + Graveyard */}
      <div className="grid grid-cols-2 gap-3.5">

        {/* Donut */}
        <div className="card">
          <div className="card-head">
            <ChIcon color="#b5622a" bgColor="rgba(181,98,42,0.12)">
              <svg viewBox="0 0 13 13" className="w-3 h-3 fill-current">
                <path d="M6.5 1a5.5 5.5 0 1 0 0 11A5.5 5.5 0 0 0 6.5 1zm.5 2.3a.5.5 0 0 0-1 0v2.6l-1.5.87a.5.5 0 0 0 .5.87l1.8-1.04a.5.5 0 0 0 .2-.43V3.3z"/>
              </svg>
            </ChIcon>
            <span className="text-[13px] font-semibold text-[#0d1b2a] flex-1">First Rupee Trail</span>
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(181,98,42,0.12)', color: '#b5622a' }}>Engine 1</span>
          </div>
          <div className="card-body">
            <div className="flex items-center gap-6">
              <div className="relative w-[124px] h-[124px] flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} cx="50%" cy="50%" innerRadius={38} outerRadius={58}
                      paddingAngle={2} dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                      {donutData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip content={<DonutTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-[19px] leading-none text-[#0d1b2a]" style={SERIF}>₹45K</div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.9px] text-[#8a9aaa] mt-1">Salary</div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 flex-1">
                {donutData.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-[9px] h-[9px] rounded-[2.5px] flex-shrink-0" style={{ background: d.color }} />
                    <span className="flex-1 text-[12px] text-[#2a3f52]">{d.name}</span>
                    <span className="text-[11px] text-[#8a9aaa] w-7 text-right">
                      {Math.round(d.value / 450)}%
                    </span>
                    <span className="text-[12px] font-semibold min-w-[54px] text-right" style={{ color: d.color }}>
                      ₹{(d.value / 1000).toFixed(1)}K
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Graveyard preview */}
        <div className="card">
          <div className="card-head">
            <ChIcon color="#b03040" bgColor="#f7e8ea">
              <svg viewBox="0 0 13 13" className="w-3 h-3 fill-current">
                <path d="M2 1.5A1.5 1.5 0 0 1 3.5 0h6A1.5 1.5 0 0 1 11 1.5v9.5a.5.5 0 0 1-.77.42L6.5 9.5l-3.73 1.92A.5.5 0 0 1 2 11V1.5z"/>
              </svg>
            </ChIcon>
            <span className="text-[13px] font-semibold text-[#0d1b2a] flex-1">Subscription Graveyard</span>
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: '#f7e8ea', color: '#b03040' }}>₹3,218/mo</span>
          </div>
          <div className="px-4 py-2">
            {subs.map((s, i) => (
              <div key={i} className="flex items-center gap-2.5 py-2.5"
                style={{ borderBottom: i < subs.length - 1 ? '1px solid #f3f0e8' : 'none' }}>
                <div className="w-8 h-8 rounded-[8px] bg-[#f3f0e8] flex items-center justify-center text-sm flex-shrink-0">
                  {s.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-[#0d1b2a]">{s.name}</div>
                  <div className="text-[11px] text-[#8a9aaa]">{s.meta}</div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={s.statusStyle}>{s.status}</span>
                <span className="text-[13px] font-semibold min-w-[52px] text-right" style={{ color: s.amtColor }}>
                  {s.amount}
                </span>
                <span className="text-[11px] font-medium underline underline-offset-2 cursor-pointer ml-1 flex-shrink-0"
                  style={{ color: s.statusStyle.color, textDecorationColor: 'rgba(176,48,64,0.35)' }}>
                  {s.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Calendar + Weekly Spend + CTA */}
      <div className="grid grid-cols-3 gap-3.5">

        {/* Risk Calendar */}
        <div className="card">
          <div className="card-head">
            <ChIcon color="#3a5878" bgColor="#e8eef5">
              <svg viewBox="0 0 13 13" className="w-3 h-3 fill-current">
                <path d="M2.5 0a.5.5 0 0 1 .5.5V1h6V.5a.5.5 0 0 1 1 0V1H11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h.5V.5a.5.5 0 0 1 .5-.5zM0 4v7a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V4H0z"/>
              </svg>
            </ChIcon>
            <span className="text-[13px] font-semibold text-[#0d1b2a] flex-1">Risk Calendar</span>
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: '#f7e8ea', color: '#b03040' }}>Mar 27 ⚑</span>
          </div>
          <div className="px-4 pb-4 pt-3">
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {['S','M','T','W','T','F','S'].map((d, i) => (
                <div key={i} className="text-center text-[9.5px] font-semibold text-[#8a9aaa] pb-1">{d}</div>
              ))}
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-[3px]">
              {calDayNums.map((day, i) => {
                if (day === null) return <div key={i} />
                const type = calData[i]
                const s = type && type !== 'today' ? CAL_STYLE[type] : type === 'today' ? CAL_STYLE.today : { background: '#f3f0e8', color: '#8a9aaa' }
                return (
                  <div key={i} className="aspect-square rounded-[5px] flex items-center justify-center text-[11px]"
                    style={{ ...s, opacity: (i < 19 && type !== 'today') ? 0.55 : 1 }}>
                    {day}{day === 27 ? '⚑' : ''}
                  </div>
                )
              })}
            </div>
            <div className="flex gap-3.5 mt-2.5">
              {[['#2e6b55','Safe'],['#8a6520','Risky'],['#b03040','Danger']].map(([c,l]) => (
                <div key={l} className="flex items-center gap-1.5 text-[10px] text-[#8a9aaa]">
                  <span className="w-2 h-2 rounded-[2px]" style={{ background: c }} />
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Spend */}
        <div className="card">
          <div className="card-head">
            <ChIcon color="#8a9aaa" bgColor="#f3f0e8">
              <svg viewBox="0 0 13 13" className="w-3 h-3 fill-current">
                <path d="M1 8.75A.75.75 0 0 1 1.75 8h1.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-.75.75h-1.5A.75.75 0 0 1 1 11.25V8.75zm3.75-3a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-.75.75H5.5a.75.75 0 0 1-.75-.75V5.75zm3.75-3.75A.75.75 0 0 1 9.25 1h1.5a.75.75 0 0 1 .75.75v9.5a.75.75 0 0 1-.75.75H9.25a.75.75 0 0 1-.75-.75V2z"/>
              </svg>
            </ChIcon>
            <span className="text-[13px] font-semibold text-[#0d1b2a] flex-1">Weekly Spend</span>
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(181,98,42,0.12)', color: '#b5622a' }}>vs Budget</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={90}>
              <BarChart data={weekData} barCategoryGap="20%" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="week" tick={{ fill: '#8a9aaa', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<WeekTooltip />} />
                <Bar dataKey="budget" fill="#f3f0e8" radius={[3,3,0,0]} name="Budget" />
                <Bar dataKey="spend" radius={[3,3,0,0]} name="Spent">
                  {weekData.map((d, i) => (
                    <Cell key={i} fill={
                      d.spend < d.budget * 0.7 ? '#e8f3ee' :
                      d.spend < d.budget      ? '#f8f2e0' : '#f7e8ea'
                    }
                    stroke={
                      d.spend < d.budget * 0.7 ? 'rgba(46,107,85,0.25)' :
                      d.spend < d.budget      ? 'rgba(138,101,32,0.22)' : 'rgba(176,48,64,0.22)'
                    }
                    strokeWidth={1.5} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 px-3 py-2.5 rounded-[10px] bg-[#f3f0e8] text-[12px] text-[#8a9aaa]">
              Weekend spike detected — you spend{' '}
              <strong className="text-[#b5622a]">2.3× more</strong> on Sat &amp; Sun.
            </div>
          </div>
        </div>

        {/* Leak → Invest CTA */}
        <div className="card flex flex-col">
          <div className="card-head">
            <ChIcon color="#2e6b55" bgColor="#e8f3ee">
              <svg viewBox="0 0 13 13" className="w-3 h-3 fill-current">
                <path d="M6.5 0a6.5 6.5 0 1 0 0 13A6.5 6.5 0 0 0 6.5 0zm.75 7.6-.92 4.03c-.06.29.02.46.26.46.16 0 .42-.06.59-.2l-.08.36c-.24.3-.79.51-1.25.51-.6 0-.86-.36-.69-1.13l.74-3.23c.06-.25.01-.34-.25-.4l-.37-.07.07-.32 1.96-.24zM6.5 4a.8.8 0 1 1 0-1.6A.8.8 0 0 1 6.5 4z"/>
              </svg>
            </ChIcon>
            <span className="text-[13px] font-semibold text-[#0d1b2a] flex-1">Leak → Invest</span>
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: '#e8f3ee', color: '#2e6b55' }}>Action</span>
          </div>
          <div className="card-body flex flex-col items-center justify-center text-center flex-1">
            <div className="text-[11px] text-[#8a9aaa] mb-1" style={SERIF}>Monthly recovered</div>
            <div className="text-[34px] leading-none mb-1" style={{ ...SERIF, color: '#2e6b55', letterSpacing: '-1px' }}>₹3,218</div>
            <div className="text-[12px] text-[#8a9aaa] mb-5">
              becomes <strong className="text-[#b5622a]">₹38,616 in SIP</strong> over 12 months
            </div>
            <button
              onClick={() => setShowRedirect(true)}
              className="w-full py-2 px-4 rounded-[6px] text-[12px] font-medium text-white cursor-pointer transition-all hover:opacity-90"
              style={{ background: redirectDone ? '#8a9aaa' : '#2e6b55' }}>
              {redirectDone ? '✓ Redirect Active' : 'Cancel Dead + Redirect →'}
            </button>
          </div>
        </div>

      </div>

      {showRedirect && (
        <Modal title="Cancel Dead Subs + Redirect Savings" onClose={() => setShowRedirect(false)} width={400}>
          <div style={{ marginBottom: 16 }}>
            {[
              { emoji: '💼', name: 'LinkedIn Premium', amt: 1600 },
              { emoji: '📺', name: 'Hotstar Premium',  amt: 299  },
              { emoji: '🎵', name: 'Spotify Premium',  amt: 119  },
              { emoji: '🎬', name: 'Zee5',             amt: 99   },
            ].map(s => (
              <div key={s.name} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '7px 12px', borderRadius: 8, marginBottom: 6,
                background: '#fdecea', border: '1px solid rgba(176,48,64,0.15)',
              }}>
                <span style={{ fontSize: 18 }}>{s.emoji}</span>
                <span style={{ flex: 1, fontSize: 13, color: '#0d1b2a', fontWeight: 500 }}>{s.name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#b03040' }}>
                  -₹{s.amt.toLocaleString('en-IN')}/mo
                </span>
              </div>
            ))}
          </div>
          <div style={{
            background: '#e8f3ee', borderRadius: 10, padding: '10px 14px',
            fontSize: 13, color: '#2e6b55', fontWeight: 600, marginBottom: 18,
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span>Redirected to Emergency Fund</span>
            <span>₹3,218/mo</span>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <ModalBtn variant="ghost" onClick={() => setShowRedirect(false)}>Cancel</ModalBtn>
            <ModalBtn variant="green" onClick={() => {
              setShowRedirect(false)
              setRedirectDone(true)
              setToast({ msg: '4 subs cancelled · ₹3,218/mo redirected to Emergency Fund 🚀', type: 'success' })
            }}>Confirm &amp; Redirect →</ModalBtn>
          </div>
        </Modal>
      )}
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </div>
  )
}
