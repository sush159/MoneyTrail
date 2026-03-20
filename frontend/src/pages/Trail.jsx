import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };

const weeklyData = [
  { week: 'W1', spend: 14200 },
  { week: 'W2', spend: 8900 },
  { week: 'W3', spend: 11400 },
  { week: 'W4', spend: 10300 },
];

const allocations = [
  { emoji: '🏠', label: 'House Rent',       pct: 26.7, amount: 12000, status: 'Consumed', color: '#3a5878' },
  { emoji: '📈', label: 'SIP Zerodha',      pct: 11.1, amount: 5000,  status: 'Invested', color: '#2e6b55' },
  { emoji: '🍔', label: 'Swiggy',           pct: 1.9,  amount: 850,   status: 'Consumed', color: '#3a5878' },
  { emoji: '🛍️', label: 'Amazon',           pct: 5.1,  amount: 2300,  status: 'Consumed', color: '#3a5878' },
  { emoji: '💀', label: 'Dead Subscriptions', pct: 7.2, amount: 3218, status: 'Wasted',   color: '#b03040' },
  { emoji: '⏳', label: 'Remaining',         pct: 4.9,  amount: 2200,  status: 'Pending',  color: '#8a6520' },
];

const statusColors = {
  Consumed: { bg: '#eef3f8', text: '#3a5878' },
  Invested: { bg: '#e6f2ec', text: '#2e6b55' },
  Wasted:   { bg: '#fdecea', text: '#b03040' },
  Pending:  { bg: '#fdf6e3', text: '#8a6520' },
};

function StatusPill({ status }) {
  const c = statusColors[status] || { bg: '#f0f0f0', text: '#555' };
  return (
    <span style={{ background: c.bg, color: c.text }}
      className="text-xs font-semibold px-2.5 py-0.5 rounded-full">
      {status}
    </span>
  );
}

export default function Trail() {
  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div>
        <h1 style={serif} className="text-2xl font-bold text-[#0d1b2a]">Rupee Trail</h1>
        <p className="text-sm text-[#8a9aaa] mt-0.5">FIFO allocation · March 2026</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Wasted */}
        <div className="bg-white rounded-2xl border border-[#e9e5d8] shadow-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8a9aaa] mb-1">Wasted</p>
          <p style={serif} className="text-3xl font-bold text-[#b03040]">₹13,950</p>
          <p className="text-sm text-[#b03040] font-medium mt-1">31% of income</p>
          <div className="mt-3 h-1.5 rounded-full bg-[#f3f0e8]">
            <div className="h-1.5 rounded-full bg-[#b03040]" style={{ width: '31%' }} />
          </div>
        </div>

        {/* Consumed */}
        <div className="bg-white rounded-2xl border border-[#e9e5d8] shadow-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8a9aaa] mb-1">Consumed</p>
          <p style={serif} className="text-3xl font-bold text-[#3a5878]">₹23,850</p>
          <p className="text-sm text-[#3a5878] font-medium mt-1">53% of income</p>
          <div className="mt-3 h-1.5 rounded-full bg-[#f3f0e8]">
            <div className="h-1.5 rounded-full bg-[#3a5878]" style={{ width: '53%' }} />
          </div>
        </div>

        {/* Invested */}
        <div className="bg-white rounded-2xl border border-[#e9e5d8] shadow-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8a9aaa] mb-1">Invested</p>
          <p style={serif} className="text-3xl font-bold text-[#2e6b55]">₹5,000</p>
          <p className="text-sm text-[#2e6b55] font-medium mt-1">11.1% of income</p>
          <div className="mt-3 h-1.5 rounded-full bg-[#f3f0e8]">
            <div className="h-1.5 rounded-full bg-[#2e6b55]" style={{ width: '11.1%' }} />
          </div>
        </div>
      </div>

      {/* FIFO Allocation Card */}
      <div className="bg-white rounded-2xl border border-[#e9e5d8] shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#f3f0e8]">
          <div className="w-8 h-8 rounded-lg bg-[#eef3f8] flex items-center justify-center text-base">🧾</div>
          <div>
            <p className="text-sm font-semibold text-[#0d1b2a]">FIFO Allocation</p>
            <p className="text-xs text-[#8a9aaa]">Oldest rupee spent first</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {allocations.map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <span className="text-lg w-7 text-center flex-shrink-0">{row.emoji}</span>
              <span className="text-sm font-medium text-[#0d1b2a] w-40 flex-shrink-0 truncate">{row.label}</span>
              <div className="flex-1 h-2 rounded-full bg-[#f3f0e8] overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(row.pct * 2.5, 100)}%`, background: row.color }}
                />
              </div>
              <span className="text-xs text-[#8a9aaa] w-10 text-right flex-shrink-0">{row.pct}%</span>
              <span className="text-sm font-semibold text-[#0d1b2a] w-20 text-right flex-shrink-0">₹{row.amount.toLocaleString('en-IN')}</span>
              <div className="flex-shrink-0">
                <StatusPill status={row.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Spend Chart */}
      <div className="bg-white rounded-2xl border border-[#e9e5d8] shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#f3f0e8]">
          <div className="w-8 h-8 rounded-lg bg-[#eef3f8] flex items-center justify-center text-base">📊</div>
          <div>
            <p className="text-sm font-semibold text-[#0d1b2a]">Weekly Spend Pattern</p>
            <p className="text-xs text-[#8a9aaa]">March 2026</p>
          </div>
        </div>
        <div className="p-5">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3a5878" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3a5878" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f0e8" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#8a9aaa' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#8a9aaa' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Spend']}
                contentStyle={{ borderRadius: 10, border: '1px solid #e9e5d8', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="spend" stroke="#3a5878" strokeWidth={2}
                fill="url(#spendGrad)" dot={{ fill: '#3a5878', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
