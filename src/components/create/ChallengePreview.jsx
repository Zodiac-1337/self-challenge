import { DIFFICULTIES } from '../../constants/challenges'
import Card from '../ui/Card'

function Row({ label, value, labelColor }) {
  return (
    <div className="text-[13px]">
      <span style={{ color: labelColor ?? 'var(--color-muted)' }}>{label}: </span>
      <span className="text-muted">{value}</span>
    </div>
  )
}

export default function ChallengePreview({ form }) {
  const diff     = DIFFICULTIES.find(d => d.id === form.difficulty)
  const deadline = form.deadline
    ? new Date(form.deadline).toLocaleString('ru-RU', {
        day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
      })
    : '—'

  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex justify-between items-start gap-[10px]">
        <h3 className="font-display flex-1 m-0" style={{ fontSize: '1.4rem', letterSpacing: '0.04em' }}>
          {form.title || 'Название вызова'}
        </h3>
        {diff && (
          <span
            className="text-[12px] font-semibold px-2 py-[3px] rounded-[6px] whitespace-nowrap border"
            style={{ color: diff.color, borderColor: diff.color }}
          >
            {diff.label}
          </span>
        )}
      </div>

      {form.description && <p className="m-0 text-muted text-[13px]">{form.description}</p>}

      <div className="border-t border-line pt-3 flex flex-col gap-[6px]">
        <Row label="⏰ Дедлайн" value={deadline} />
        {form.failureCondition && <Row label="💀 Провал"  value={form.failureCondition} labelColor="var(--color-accent)" />}
        {form.reward           && <Row label="🏆 Награда" value={form.reward}           labelColor="var(--color-ok)" />}
      </div>

      <p className="text-center text-muted text-[12px] m-0">+{diff?.xp} XP за победу</p>
    </Card>
  )
}
