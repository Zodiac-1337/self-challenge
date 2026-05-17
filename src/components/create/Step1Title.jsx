import { TEMPLATES } from '../../constants/challenges'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'

export default function Step1Title({ form, set }) {
  const applyTemplate = t => {
    set('title', t.title)
    set('description', t.desc)
    set('difficulty', t.difficulty)
  }

  const charsLeft    = 80 - form.title.length
  const counterColor = charsLeft <= 5 ? 'text-accent' : charsLeft <= 15 ? 'text-warn' : 'text-muted'

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="step-title">Что ты хочешь сделать?</h2>
        <p className="step-sub">Сформулируй конкретно — без "попробую"</p>
      </div>

      <div className="flex flex-col gap-1">
        <Input
          autoFocus
          value={form.title}
          onChange={e => set('title', e.target.value)}
          placeholder="Написать 500 строк кода"
          maxLength={80}
        />
        <div className="flex justify-between px-1">
          <span className="text-muted text-[11px]">
            {form.title.length > 0 && form.title.trim().length < 3 ? 'Минимум 3 символа' : ''}
          </span>
          <span className={`text-[11px] transition-colors ${counterColor}`}>
            {form.title.length}/80
          </span>
        </div>
      </div>

      <Textarea
        value={form.description}
        onChange={e => set('description', e.target.value)}
        placeholder="Детали (необязательно)..."
        rows={2}
      />

      <div>
        <p className="step-sub mb-[10px]">Или выбери шаблон:</p>
        <div className="flex flex-col gap-2">
          {TEMPLATES.map(t => (
            <button
              key={t.title}
              onClick={() => applyTemplate(t)}
              className="text-left px-[14px] py-[10px] rounded-xl text-fg text-sm cursor-pointer transition-colors"
              style={{
                background: form.title === t.title ? 'var(--color-surface-2)' : 'none',
                border: `1px solid ${form.title === t.title ? 'var(--color-accent)' : 'var(--color-line)'}`,
              }}
            >
              {t.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
