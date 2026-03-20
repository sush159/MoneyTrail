export default function DemoBanner() {
  return (
    <div className="w-full bg-amber-500/10 border-b border-amber-500/30 px-6 py-2 flex items-center justify-center gap-3 z-50">
      <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      <span className="text-amber-400 text-xs font-mono font-medium tracking-widest uppercase">
        Demo Mode — Simulated Data Only. No Real Bank Connections.
      </span>
      <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
    </div>
  )
}
