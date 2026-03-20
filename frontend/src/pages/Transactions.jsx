import React, { useState } from 'react';

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };

const allTransactions = [
  {
    emoji: '🏠',
    name: 'House Rent',
    category: 'Essential',
    amount: -12000,
    status: 'Consumed',
    date: 'Mar 1',
    statusColor: '#3a5878',
    statusBg: '#eef3f8',
    amountColor: '#0d1b2a',
  },
  {
    emoji: '📺',
    name: 'Hotstar Premium',
    category: 'Subscription',
    amount: -299,
    status: 'Wasted',
    date: 'Mar 2',
    statusColor: '#b03040',
    statusBg: '#fdecea',
    amountColor: '#b03040',
  },
  {
    emoji: '💼',
    name: 'LinkedIn Premium',
    category: 'Subscription',
    amount: -1600,
    status: 'Wasted',
    date: 'Mar 3',
    statusColor: '#b03040',
    statusBg: '#fdecea',
    amountColor: '#b03040',
  },
  {
    emoji: '🍔',
    name: 'Swiggy',
    category: 'Food',
    amount: -850,
    status: 'Consumed',
    date: 'Mar 5',
    statusColor: '#3a5878',
    statusBg: '#eef3f8',
    amountColor: '#0d1b2a',
  },
  {
    emoji: '📈',
    name: 'SIP Zerodha',
    category: 'Investment',
    amount: -5000,
    status: 'Invested',
    date: 'Mar 7',
    statusColor: '#2e6b55',
    statusBg: '#e6f2ec',
    amountColor: '#2e6b55',
  },
  {
    emoji: '🛍️',
    name: 'Amazon',
    category: 'Shopping',
    amount: -2300,
    status: 'Consumed',
    date: 'Mar 10',
    statusColor: '#3a5878',
    statusBg: '#eef3f8',
    amountColor: '#0d1b2a',
  },
  {
    emoji: '🎵',
    name: 'Spotify Premium',
    category: 'Subscription',
    amount: -119,
    status: 'Wasted',
    date: 'Mar 12',
    statusColor: '#b03040',
    statusBg: '#fdecea',
    amountColor: '#b03040',
  },
];

const categories = ['All', 'Essential', 'Subscription', 'Food', 'Investment', 'Shopping'];

const categoryColors = {
  All:          { active: { bg: '#0d1b2a', text: '#fff' }, inactive: { bg: '#f3f0e8', text: '#0d1b2a' } },
  Essential:    { active: { bg: '#3a5878', text: '#fff' }, inactive: { bg: '#eef3f8', text: '#3a5878' } },
  Subscription: { active: { bg: '#b03040', text: '#fff' }, inactive: { bg: '#fdecea', text: '#b03040' } },
  Food:         { active: { bg: '#b5622a', text: '#fff' }, inactive: { bg: '#fef3ea', text: '#b5622a' } },
  Investment:   { active: { bg: '#2e6b55', text: '#fff' }, inactive: { bg: '#e6f2ec', text: '#2e6b55' } },
  Shopping:     { active: { bg: '#8a6520', text: '#fff' }, inactive: { bg: '#fdf6e3', text: '#8a6520' } },
};

export default function Transactions() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? allTransactions
    : allTransactions.filter((t) => t.category === activeFilter);

  const totalSpent = filtered.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div>
        <h1 style={serif} className="text-2xl font-bold text-[#0d1b2a]">Transactions</h1>
        <p className="text-sm text-[#8a9aaa] mt-0.5">March 2026 · All spending activity</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#e9e5d8] shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = activeFilter === cat;
            const styles = categoryColors[cat];
            const s = isActive ? styles.active : styles.inactive;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all"
                style={{ background: s.bg, color: s.text }}>
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-2xl border border-[#e9e5d8] shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#f3f0e8]">
          <div className="w-8 h-8 rounded-lg bg-[#eef3f8] flex items-center justify-center text-base">💳</div>
          <div>
            <p className="text-sm font-semibold text-[#0d1b2a]">
              {activeFilter === 'All' ? 'All Transactions' : `${activeFilter} Transactions`}
            </p>
            <p className="text-xs text-[#8a9aaa]">{filtered.length} entries</p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#8a9aaa]">
            No transactions in this category.
          </div>
        ) : (
          <div className="divide-y divide-[#f3f0e8]">
            {filtered.map((txn, idx) => (
              <div key={idx} className="flex items-center gap-3 px-5 py-4 hover:bg-[#faf8f3] transition-colors">
                {/* Emoji icon */}
                <div className="w-10 h-10 rounded-xl bg-[#f3f0e8] flex items-center justify-center text-lg flex-shrink-0">
                  {txn.emoji}
                </div>

                {/* Name + category */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0d1b2a] truncate">{txn.name}</p>
                  <p className="text-xs text-[#8a9aaa] mt-0.5">{txn.category} · {txn.date}</p>
                </div>

                {/* Status pill */}
                <span
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: txn.statusBg, color: txn.statusColor }}>
                  {txn.status}
                </span>

                {/* Amount */}
                <span
                  className="text-sm font-bold flex-shrink-0 w-20 text-right"
                  style={{ color: txn.amountColor }}>
                  -₹{Math.abs(txn.amount).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Summary Row */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#f3f0e8] bg-[#faf8f3]">
          <p className="text-xs text-[#8a9aaa] font-medium">
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
          </p>
          <p className="text-sm font-bold text-[#0d1b2a]">
            ₹{totalSpent.toLocaleString('en-IN')} spent
          </p>
        </div>
      </div>
    </div>
  );
}
