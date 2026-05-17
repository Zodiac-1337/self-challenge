export default function StatBox({ label, value, color }) {
  return (
    <div className="bg-surface border border-line rounded-xl px-2 py-3 text-center">
      <div
        className="font-display text-[1.5rem] tracking-[0.04em]"
        style={{ color }}
      >
        {value}
      </div>
      <div className="text-muted text-[11px] tracking-[0.08em] mt-[2px]">
        {label.toUpperCase()}
      </div>
    </div>
  )
}
