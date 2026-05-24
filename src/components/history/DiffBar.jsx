export default function DiffBar({ label, wins, total, color }) {
  const pct = total > 0 ? Math.round((wins / total) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-[12px] w-14" style={{ color: 'var(--color-muted)' }}>{label}</span>
      <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{ background: 'var(--color-line)' }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color, transition: 'width 0.5s ease' }} />
      </div>
      <span className="text-[12px] text-right" style={{ color: 'var(--color-muted)', minWidth: '64px' }}>
        {wins}/{total} · {pct}%
      </span>
    </div>
  )
}
