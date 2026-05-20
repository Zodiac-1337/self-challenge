import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Textarea       from '../ui/Textarea'
import AISuggestCard  from './AISuggestCard'
import { useAISuggest } from '../../hooks/useAISuggest'

export default function Step3Conditions({ form, set }) {
  const { suggest, loading, error } = useAISuggest()
  const [suggestion, setSuggestion] = useState(null)

  const canSuggest = (form.title?.trim().length ?? 0) >= 3

  const handleSuggest = async () => {
    const result = await suggest(form.title, form.description)
    if (result?.failureCondition) setSuggestion(result)
  }

  const handleApply = () => {
    set('failureCondition', suggestion.failureCondition)
    set('reward',           suggestion.reward)
    setSuggestion(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="step-title">Условия и награда</h2>
        <p className="step-sub">Сам определяй правила. Будь честным с собой.</p>
      </div>

      {/* AI suggest button */}
      <button
        onClick={handleSuggest}
        disabled={!canSuggest || loading}
        className="flex items-center justify-center gap-2 rounded-xl py-[11px] text-sm font-medium transition-colors"
        style={{
          background: canSuggest ? '#ff3d3d0e' : 'none',
          border:     `1px solid ${canSuggest ? '#ff3d3d44' : 'var(--color-line)'}`,
          color:      canSuggest ? 'var(--color-accent)' : 'var(--color-muted)',
          cursor:     canSuggest && !loading ? 'pointer' : 'not-allowed',
        }}
      >
        {loading
          ? <><span className="animate-spin inline-block">⟳</span> Генерирую...</>
          : <>🤖 Предложить условия (AI)</>
        }
      </button>

      {error && (
        <p className="text-[12px] text-center m-0" style={{ color: 'var(--color-accent)' }}>
          {error}
        </p>
      )}

      <AnimatePresence>
        {suggestion && (
          <AISuggestCard
            suggestion={suggestion}
            loading={loading}
            onApply={handleApply}
            onRegenerate={handleSuggest}
          />
        )}
      </AnimatePresence>

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
