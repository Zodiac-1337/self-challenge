import { DIFFICULTIES } from '../../constants/challenges'
import Input from '../ui/Input'

function getMinDeadline() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset() + 5)
  return d.toISOString().slice(0, 16)
}

export default function Step2Deadline({ form, set }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="step-title">Когда дедлайн?</h2>
        <p className="step-sub">После этого момента вызов считается проваленным автоматически</p>
      </div>

      <div className="flex flex-col gap-1">
        <Input
          type="datetime-local"
          value={form.deadline}
          min={getMinDeadline()}
          onChange={e => set('deadline', e.target.value)}
          style={{ colorScheme: 'dark' }}
        />
        {form.deadline && (
          <span className="text-muted text-[11px] px-1">
            {new Date(form.deadline).toLocaleString('ru-RU', {
              weekday: 'long', day: 'numeric', month: 'long',
              hour: '2-digit', minute: '2-digit',
            })}
          </span>
        )}
      </div>

      <div>
        <p className="step-sub mb-[10px]">Сложность:</p>
        <div className="flex gap-3">
          {DIFFICULTIES.map(d => (
            <button
              key={d.id}
              onClick={() => set('difficulty', d.id)}
              className="flex-1 py-[14px] px-2 rounded-xl flex flex-col items-center gap-1 font-semibold text-sm cursor-pointer transition-all duration-150"
              style={{
                border:     `2px solid ${form.difficulty === d.id ? d.color : 'var(--color-line)'}`,
                background: form.difficulty === d.id ? d.color + '22' : 'none',
                color:      form.difficulty === d.id ? d.color : 'var(--color-muted)',
              }}
            >
              <span>{d.label}</span>
              <span className="text-xs opacity-70">+{d.xp} XP</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
