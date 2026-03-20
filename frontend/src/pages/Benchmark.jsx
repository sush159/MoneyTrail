const SERIF = { fontFamily: "'Playfair Display', Georgia, serif" }

const benchmarks = [
  {
    emoji: '🍔', label: 'Food & Delivery',
    youVal: '11,000', peerVal: '9,200',
    youPct: 88, peerPct: 73,
    verdict: '20% over average', verdictColor: '#b03040',
    youColor: '#b03040', youBg: '#f7e8ea', youBorder: 'rgba(176,48,64,0.22)',
  },
  {
    emoji: '📈', label: 'Investment Rate',
    youVal: '11.1%', peerVal: '18%',
    youPct: 44, peerPct: 72,
    verdict: '7% below average', verdictColor: '#b5622a',
    youColor: '#b5622a', youBg: 'rgba(181,98,42,0.1)', youBorder: 'rgba(181,98,42,0.28)',
  },
  {
    emoji: '🗑️', label: 'Leak Ratio',
    youVal: '31%', peerVal: '20%',
    youPct: 100, peerPct: 65,
    verdict: '11% above average', verdictColor: '#b03040',
    youColor: '#b03040', youBg: '#f7e8ea', youBorder: 'rgba(176,48,64,0.22)',
  },
  {
    emoji: '🏠', label: 'Housing Cost',
    youVal: '12,000', peerVal: '11,800',
    youPct: 67, peerPct: 66,
    verdict: 'On par with peers', verdictColor: '#2e6b55',
    youColor: '#2e6b55', youBg: '#e8f3ee', youBorder: 'rgba(46,107,85,0.25)',
  },
]

function BenchRow({ b }) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12.5px] font-medium text-[#0d1b2a]">{b.emoji} {b.label}</span>
        <span className="text-[11px] font-semibold" style={{ color: b.verdictColor }}>{b.verdict}</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#8a9aaa] w-7">You</span>
          <div className="flex-1 h-[7px] rounded-full overflow-hidden" style={{ background: '#f3f0e8' }}>
            <div className="h-full rounded-full" style={{ width: b.youPct + '%', background: b.youBg, border: '1px solid ' + b.youBorder }} />
          </div>
          <span className="text-[10px] text-[#4a5f72] w-12 text-right">{b.youVal.endsWith('%') ? b.youVal : '₹' + b.youVal}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#8a9aaa] w-7">Peers</span>
          <div className="flex-1 h-[7px] rounded-full overflow-hidden" style={{ background: '#f3f0e8' }}>
            <div className="h-full rounded-full" style={{ width: b.peerPct + '%', background: '#e9e5d8' }} />
          </div>
          <span className="text-[10px] text-[#4a5f72] w-12 text-right">{b.peerVal.endsWith('%') ? b.peerVal : '₹' + b.peerVal}</span>
        </div>
      </div>
    </div>
  )
}

export default function Benchmark() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[20px] text-[#0d1b2a] font-normal mb-1" style={SERIF}>Hyperlocal Benchmarks</h2>
        <p className="text-[12.5px] text-[#8a9aaa]">You vs Coimbatore peers — salaried, age 22-35, income ₹40K–50K</p>
      </div>

      <div className="grid grid-cols-3 gap-3.5">
        <div className="col-span-2 card">
          <div className="card-head">
            <div className="w-[26px] h-[26px] rounded-[6px] flex items-center justify-center" style={{ background: '#e8eef5' }}>
              <svg viewBox="0 0 13 13" className="w-3 h-3" style={{ fill: '#3a5878' }}>
                <path d="M1 8.75A.75.75 0 0 1 1.75 8h1.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-.75.75h-1.5A.75.75 0 0 1 1 11.25V8.75zm3.75-3a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-.75.75H5.5a.75.75 0 0 1-.75-.75V5.75zm3.75-3.75A.75.75 0 0 1 9.25 1h1.5a.75.75 0 0 1 .75.75v9.5a.75.75 0 0 1-.75.75H9.25a.75.75 0 0 1-.75-.75V2z"/>
              </svg>
            </div>
            <span className="text-[13px] font-semibold text-[#0d1b2a] flex-1">Category Comparison</span>
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: '#e8eef5', color: '#3a5878' }}>CBE Benchmark</span>
          </div>
          <div className="card-body">
            {benchmarks.map((b, i) => <BenchRow key={i} b={b} />)}
          </div>
        </div>

        <div className="space-y-3.5">
          <div className="card p-5">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.6px] text-[#8a9aaa] mb-3">Financial Health Score</div>
            <div className="text-[40px] leading-none mb-1" style={{ ...SERIF, color: '#b5622a' }}>62</div>
            <div className="text-[11px] text-[#8a9aaa] mb-3">out of 100</div>
            <div className="h-[6px] rounded-full overflow-hidden mb-3" style={{ background: '#f3f0e8' }}>
              <div className="h-full rounded-full" style={{ width: '62%', background: 'linear-gradient(90deg, #2e6b55, #8a6520, #b5622a)' }} />
            </div>
            <div className="text-[11px] text-[#8a9aaa]">Below average for your peer group. Main drags: high leak ratio, low investment rate.</div>
          </div>

          <div className="card p-5">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.6px] text-[#8a9aaa] mb-3">Peer Ranking</div>
            <div className="text-[28px] leading-none mb-1" style={{ ...SERIF, color: '#3a5878' }}>38th</div>
            <div className="text-[11px] text-[#8a9aaa]">percentile of 2,847 Coimbatore peers tracked</div>
          </div>

          <div className="card p-5" style={{ background: 'linear-gradient(135deg, #e8eef5 0%, #dde6f0 100%)' }}>
            <div className="text-[12.5px] font-semibold text-[#2a3f52] mb-2">To reach top 25%</div>
            <div className="text-[11px] text-[#8a9aaa] space-y-1">
              <div>- Cut leak ratio to below 15%</div>
              <div>- Raise investment to 18%+</div>
              <div>- Reduce food spend by ₹1,800</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
