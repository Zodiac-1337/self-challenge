import Textarea from '../ui/Textarea'

export default function Step3Conditions({ form, set }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="step-title">Условия и награда</h2>
        <p className="step-sub">Сам определяй правила. Будь честным с собой.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="step-label">💀 Что считать провалом?</label>
        <Textarea
          variant="danger"
          value={form.failureCondition}
          onChange={e => set('failureCondition', e.target.value)}
          placeholder="Если открою YouTube или не достигну 500 строк к дедлайну..."
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="step-label">🏆 Твоя награда за победу?</label>
        <Textarea
          variant="success"
          value={form.reward}
          onChange={e => set('reward', e.target.value)}
          placeholder="Разрешу себе вечер без гаджетов и закажу пиццу..."
          rows={3}
        />
      </div>
    </div>
  )
}
