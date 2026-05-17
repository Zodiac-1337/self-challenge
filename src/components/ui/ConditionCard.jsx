export default function ConditionCard({ icon, label, text, color }) {
  return (
    <div
      className="bg-surface rounded-xl flex gap-[10px] items-start px-[14px] py-3"
      style={{ border: `1px solid ${color}33` }}
    >
      <span className="text-[18px] leading-[1.3] shrink-0">{icon}</span>
      <div>
        <div
          className="text-[11px] font-semibold tracking-[0.08em] mb-[2px]"
          style={{ color }}
        >
          {label.toUpperCase()}
        </div>
        <div className="text-[13px] text-fg leading-[1.5]">{text}</div>
      </div>
    </div>
  )
}
