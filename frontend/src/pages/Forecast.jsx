import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer
} from 'recharts';

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };

const balanceData = [
  { day: 'Mar 20', balance: 7200 },
  { day: 'Mar 22', balance: 5800 },
  { day: 'Mar 24', balance: 4200 },
  { day: 'Mar 25', balance: 3400 },
  { day: 'Mar 27', balance: 800 },
  { day: 'Mar 28', balance: 0 },
  { day: 'Mar 31', balance: 0 },
];

const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

const dayRisk = {
  1: 'consumed', 2: 'wasted', 3: 'wasted', 5: 'consumed',
  7: 'invested', 10: 'consumed', 12: 'wasted', 15: 'safe',
  20: 'safe', 22: 'warn', 24: 'warn', 25: 'danger',
  27: 'danger', 28: 'danger', 29: 'danger', 30: 'danger', 31: 'danger',
};

const riskColors = {
  consumed: '#eef3f8',
  wasted:   '#fdecea',
  invested: '#e6f2ec',
  safe:     '#e6f2ec',
  warn:     '#fdf6e3',
  danger:   '#b03040',
  default:  '#f3f0e8',
};

const riskText = {
  danger: '#fff',
};

const alerts = [
  {
    icon: '⚠️',
    title: 'Shortfall Alert',
    desc: 'Balance hits ₹0 on Mar 28 — 3 days before salary.',
    color: '#b03040',
    bg: '#fdecea',
  },
  {
    icon: '🍔',
    title: 'Food Overspend Risk',
    desc: 'Food spend trending ₹2,800 above monthly budget.',
    color: '#b5622a',
    bg: '#fef3ea',
  },
  {
    icon: '✅',
    title: 'Safe Window',
    desc: 'Mar 20–23 is your safest window for discretionary spend.',
    color: '#2e6b55',
    bg: '#e6f2ec',
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#e9e5d8] rounded-xl p-3 shadow-md text-xs">
        <p className="font-semibold text-[#0d1b2a] mb-1">{label}</p>
        <p style={{ color: payload[0].value < 2000 ? '#b03040' : '#3a5878' }}>
          Balance: ₹{payload[0].value.toLocaleString('en-IN')}
        </p>
      </div>
    );
  }
  return null;
};

export default function Forecast() {
  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div>
        <h1 style={serif} className="text-2xl font-bold text-[#0d1b2a]">Cash Flow Forecast</h1>
        <p className="text-sm text-[#8a9aaa] mt-0.5">Mar 20 – Mar 31, 2026 · AI-powered projection</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#e9e5d8] shadow-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8a9aaa] mb-1">Shortfall Date</p>
          <p style={serif} className="text-3xl font-bold text-[#b03040]">Mar 27</p>
          <p className="text-sm text-[#b03040] font-medium mt-1">Balance drops critical</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#e9e5d8] shadow-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8a9aaa] mb-1">Overspend Risk</p>
          <p style={serif} className="text-3xl font-bold text-[#b5622a]">₹2,800</p>
          <p className="text-sm text-[#b5622a] font-medium mt-1">Above safe threshold</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#e9e5d8] shadow-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8a9aaa] mb-1">Model Accuracy</p>
          <p style={serif} className="text-3xl font-bold text-[#2e6b55]">87%</p>
          <p className="text-sm text-[#2e6b55] font-medium mt-1">Last 3 months avg</p>
        </div>
      </div>

      {/* Balance Chart */}
      <div className="bg-white rounded-2xl border border-[#e9e5d8] shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#f3f0e8]">
          <div className="w-8 h-8 rounded-lg bg-[#fdecea] flex items-center justify-center text-base">📉</div>
          <div>
            <p className="text-sm font-semibold text-[#0d1b2a]">Projected Balance</p>
            <p className="text-xs text-[#8a9aaa]">Danger zone below ₹2,000</p>
          </div>
        </div>
        <div className="p-5">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={balanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3a5878" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3a5878" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dangerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b03040" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#b03040" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f0e8" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8a9aaa' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#8a9aaa' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={2000} stroke="#b03040" strokeDasharray="4 3" strokeWidth={1.5}
                label={{ value: 'Danger Zone', position: 'insideTopRight', fontSize: 10, fill: '#b03040' }} />
              <Area type="monotone" dataKey="balance" stroke="#3a5878" strokeWidth={2.5}
                fill="url(#balGrad)" dot={{ fill: '#3a5878', r: 4, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Calendar */}
      <div className="bg-white rounded-2xl border border-[#e9e5d8] shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#f3f0e8]">
          <div className="w-8 h-8 rounded-lg bg-[#fdf6e3] flex items-center justify-center text-base">📅</div>
          <div>
            <p className="text-sm font-semibold text-[#0d1b2a]">Risk Calendar — March 2026</p>
            <p className="text-xs text-[#8a9aaa]">Color = spend risk level for each day</p>
          </div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-7 gap-1.5 mb-2">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-[#8a9aaa] py-1">{d}</div>
            ))}
          </div>
          {/* March 2026 starts on Sunday */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((day) => {
              const risk = dayRisk[day] || 'default';
              const bg = riskColors[risk];
              const text = riskText[risk] || '#0d1b2a';
              return (
                <div
                  key={day}
                  className="aspect-square rounded-lg flex items-center justify-center text-xs font-semibold"
                  style={{ background: bg, color: text }}>
                  {day}
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {[
              { label: 'Safe', color: '#e6f2ec', text: '#2e6b55' },
              { label: 'Caution', color: '#fdf6e3', text: '#8a6520' },
              { label: 'Danger', color: '#b03040', text: '#fff' },
              { label: 'Spend Day', color: '#fdecea', text: '#b03040' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded" style={{ background: l.color }} />
                <span className="text-xs text-[#8a9aaa]">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-white rounded-2xl border border-[#e9e5d8] shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#f3f0e8]">
          <div className="w-8 h-8 rounded-lg bg-[#fdecea] flex items-center justify-center text-base">🔔</div>
          <p className="text-sm font-semibold text-[#0d1b2a]">Active Alerts</p>
        </div>
        <div className="p-5 space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.title}
              className="flex items-start gap-3 rounded-xl p-4"
              style={{ background: alert.bg }}>
              <span className="text-lg flex-shrink-0">{alert.icon}</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: alert.color }}>{alert.title}</p>
                <p className="text-xs text-[#555] mt-0.5">{alert.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
