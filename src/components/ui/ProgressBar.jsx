import { TOTAL_STEPS } from '../../constants/challenges'

export default function ProgressBar({ step }) {
  return (
    <div className="flex gap-2 w-full">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          className="h-1 flex-1 rounded-full transition-all duration-300"
          style={{ background: i < step ? 'var(--accent)' : 'var(--border)' }}
        />
      ))}
    </div>
  )
}
