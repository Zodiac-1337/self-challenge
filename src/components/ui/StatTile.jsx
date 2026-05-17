export default function StatTile({ label, value, sub, color }) {
  return (
    <div className="bg-surface border border-line rounded-xl px-[6px] py-[10px] text-center">
      <div
        className="font-display text-[1.3rem] tracking-[0.04em]"
        style={{ color: color ?? 'var(--color-fg)' }}
      >
        {value}
      </div>
      <div className="text-muted text-[10px] mt-[2px]">{sub}</div>
      <div className="text-muted text-[10px] tracking-[0.06em] mt-px">
        {label.toUpperCase()}
      </div>
    </div>
  )
}
