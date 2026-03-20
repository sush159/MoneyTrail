import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Footprints, Skull, TrendingDown, List,
  Lightbulb, Target, HeartPulse, ChevronRight
} from 'lucide-react'

const sections = [
  {
    label: 'Overview',
    items: [
      { to: '/',            icon: LayoutDashboard, label: 'Dashboard',     tag: null,                tagStyle: '' },
    ]
  },
  {
    label: 'Engines',
    items: [
      { to: '/trail',       icon: Footprints,      label: 'Rupee Trail',   tag: null,                tagStyle: '' },
      { to: '/graveyard',   icon: Skull,           label: 'Sub Graveyard', tag: '4',                 tagStyle: 'bg-red-900/40 text-red-300' },
      { to: '/forecast',    icon: TrendingDown,    label: 'Cash Forecast', tag: '!',                 tagStyle: 'bg-red-900/40 text-red-300' },
      { to: '/transactions',icon: List,            label: 'Transactions',  tag: null,                tagStyle: '' },
    ]
  },
  {
    label: 'Insights',
    items: [
      { to: '/insights',    icon: Lightbulb,       label: 'AI Insights',   tag: '3',                 tagStyle: 'bg-emerald-900/40 text-emerald-300' },
      { to: '/goals',       icon: Target,          label: 'Goals',         tag: null,                tagStyle: '' },
      { to: '/health',      icon: HeartPulse,      label: 'Spend Health',  tag: null,                tagStyle: '' },
    ]
  },
]

export default function Sidebar({ onLogout }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] flex flex-col z-40 overflow-hidden"
      style={{ background: '#0d1b2a' }}>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 160% 80% at 20% 0%, rgba(181,98,42,0.08) 0%, transparent 60%),
                       radial-gradient(ellipse 120% 60% at 80% 100%, rgba(46,107,85,0.06) 0%, transparent 60%)`
        }} />

      {/* Logo */}
      <div className="relative px-[18px] pt-7 pb-5">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #b5622a 0%, #c97840 100%)' }}>
            <svg viewBox="0 0 15 15" className="w-[15px] h-[15px] fill-white">
              <path d="M7.5 1a6.5 6.5 0 1 0 0 13A6.5 6.5 0 0 0 7.5 1zm.625 3.375a.625.625 0 0 0-1.25 0v3.363L4.97 8.78a.625.625 0 0 0 .625 1.082l2.03-1.172a.625.625 0 0 0 .5-.546V4.375z"/>
            </svg>
          </div>
          <span className="text-white text-base leading-none"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '0.1px' }}>
            MoneyTrail
          </span>
        </div>

        {/* Demo badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px]"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)' }}>
          <span className="w-[5px] h-[5px] rounded-full pulse-dot flex-shrink-0"
            style={{ background: '#c97840', boxShadow: '0 0 6px #c97840' }} />
          Demo · Arun Kumar
        </div>
      </div>

      {/* Nav */}
      <nav className="relative flex-1 px-2.5 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {sections.map(({ label, items }) => (
          <div key={label}>
            <div className="px-2 pt-3 pb-1 text-[9.5px] font-semibold uppercase tracking-[1.2px]"
              style={{ color: 'rgba(255,255,255,0.2)' }}>
              {label}
            </div>
            {items.map(({ to, icon: Icon, label: itemLabel, tag, tagStyle }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `relative flex items-center gap-2.5 px-2.5 py-[7px] rounded-[6px] mb-0.5 text-[12.5px] transition-all duration-150 ${
                    isActive
                      ? 'font-medium'
                      : 'font-normal hover:bg-white/[0.06]'
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive ? 'rgba(255,255,255,0.09)' : undefined,
                  color: isActive ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.42)',
                })}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-[22%] bottom-[22%] w-[2.5px] rounded-r-sm"
                        style={{ background: '#c97840' }} />
                    )}
                    <Icon size={14} className="flex-shrink-0"
                      style={{ opacity: isActive ? 1 : 0.8 }} />
                    <span className="flex-1">{itemLabel}</span>
                    {tag && (
                      <span className={`text-[9.5px] font-semibold px-1.5 py-0.5 rounded-full ${tagStyle}`}>
                        {tag}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="relative px-[18px] py-3.5 space-y-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #3a5878 0%, #5078a0 100%)' }}>
            AK
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium truncate" style={{ color: 'rgba(255,255,255,0.78)' }}>Arun Kumar</div>
            <div className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>HDFC Bank · ₹45,000/mo</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-[6px] text-[11px] font-medium cursor-pointer transition-all hover:bg-white/10"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }}>
          <svg viewBox="0 0 14 14" width="11" height="11" fill="currentColor">
            <path d="M5 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2M9 10l3-3-3-3M12 7H5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Log out
        </button>
      </div>
    </aside>
  )
}
