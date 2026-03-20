import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const SERIF = { fontFamily: "'Playfair Display', Georgia, serif" }

const bars = [
  { label: 'Mon - Tue', level: 'Low',      pct: 24, fill: '#2e6b55' },
  { label: 'Wed - Thu', level: 'Moderate', pct: 50, fill: '#8a6520' },
  { label: 'Friday',    level: 'High',     pct: 72, fill: '#b5622a' },
  { label: 'Weekend',   level: 'Peak',     pct: 93, fill: '#b03040' },
]

const pieData = [
  { name: 'Stress Spend', value: 9500,  color: '#b03040' },
  { name: 'Normal',       value: 36500, color: '#3a5878' },
]

function StressTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-[#e9e5d8] rounded-[8px] px-3 py-2 text-xs shadow-card">
      <p className="font-semibold mb-0.5" style={{ color: payload[0].payload.color }}>{payload[0].name}</p>
      <p className="text-[#0d1b2a]">₹{payload[0].value.toLocaleString('en-IN')}</p>
    </div>
  )
}

export default function Stress() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[20px] text-[#0d1b2a] font-normal mb-1" style={SERIF}>Stress-Spend Analysis</h2>
        <p className="text-[12.5px] text-[#8a9aaa]">Patterns correlated with late-night orders, rapid transactions, and weekend behaviour</p>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        <div className="card">
          <div className="card-head">
            <span className="text-[13px] font-semibold text-[#0d1b2a] flex-1">Stress-Spend Correlation</span>
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(181,98,42,0.12)', color: '#b5622a' }}>Behavioral</span>
          </div>
          <div className="card-body space-y-3">
            <p className="text-[12px] text-[#8a9aaa]">Spending intensity by day of week, correlated with stress indicators.</p>
            {bars.map(b => (
              <div key={b.label} className="flex items-center gap-3">
                <span className="text-[12px] text-[#8a9aaa] w-20 flex-shrink-0">{b.label}</span>
                <div className="flex-1 h-[7px] rounded-full overflow-hidden" style={{ background: '#f3f0e8' }}>
                  <div className="h-full rounded-full" style={{ width: b.pct + '%', background: b.fill }} />
                </div>
                <span className="text-[11px] font-semibold w-16 text-right" style={{ color: b.fill }}>{b.level}</span>
              </div>
            ))}
            <div className="mt-4 px-3.5 py-3 rounded-[10px]" style={{ background: '#f3f0e8' }}>
              <div className="text-[12px] font-semibold text-[#0d1b2a] mb-1">Key pattern identified</div>
              <div className="text-[12px] text-[#8a9aaa] leading-relaxed">
                73% of wasted transactions occur between 10 PM to 2 AM on weekends. Impulse Swiggy orders account for ₹2,400 of ₹3,218 wasted this month.
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <span className="text-[13px] font-semibold text-[#0d1b2a] flex-1">Stress vs Normal Spend</span>
          </div>
          <div className="card-body">
            <div className="relative h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} opacity={0.85} />)}
                  </Pie>
                  <Tooltip content={<StressTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-[9px] font-semibold uppercase tracking-wider text-[#8a9aaa]">Stress</div>
                <div className="text-[19px] leading-none" style={{ ...SERIF, color: '#b03040' }}>21%</div>
              </div>
            </div>
            <div className="flex gap-4 mt-3 justify-center">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-2 text-[12px] text-[#2a3f52]">
                  <span className="w-2.5 h-2.5 rounded-[2px]" style={{ background: d.color }} />
                  {d.name} - ₹{(d.value/1000).toFixed(1)}K
                </div>
              ))}
            </div>
            <div className="mt-4 px-3.5 py-3 rounded-[10px]" style={{ background: '#f7e8ea' }}>
              <p className="text-[12px] text-[#b03040] font-semibold mb-1">Peak stress hours</p>
              <p className="text-[12px] text-[#8a9aaa]">Most stress spending happens Fri 8pm - Sun 2am. Consider a cooldown rule before late-night purchases.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
