export default function Placeholder({ title }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p className="text-amber-500/50 text-4xl mb-3">🔍</p>
        <p className="text-slate-400 font-mono text-sm">{title} — coming soon</p>
      </div>
    </div>
  )
}
