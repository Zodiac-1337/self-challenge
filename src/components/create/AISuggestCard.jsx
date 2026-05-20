import { motion } from 'framer-motion'
import Button from '../ui/Button'
import Card   from '../ui/Card'

export default function AISuggestCard({ suggestion, loading, onApply, onRegenerate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-4 flex flex-col gap-3" style={{ borderColor: '#ff3d3d33' }}>
        <span className="text-[11px] tracking-[0.08em]" style={{ color: 'var(--color-accent)' }}>
          🤖 ПРЕДЛОЖЕНИЕ AI
        </span>

        <div className="flex flex-col gap-3">
          <div>
            <p className="step-label mb-1">💀 Провал:</p>
            <p className="text-sm m-0 leading-relaxed">{suggestion.failureCondition}</p>
          </div>
          <div>
            <p className="step-label mb-1">🏆 Награда:</p>
            <p className="text-sm m-0 leading-relaxed">{suggestion.reward}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ok"
            onClick={onApply}
            className="flex-1"
            style={{ padding: '10px', fontSize: '0.9rem', letterSpacing: '0.04em' }}
          >
            ✓ Применить
          </Button>
          <Button
            variant="ghost"
            onClick={onRegenerate}
            disabled={loading}
            className="px-4 py-[10px] rounded-2xl border border-line"
            style={{ fontSize: '18px' }}
          >
            {loading ? <span className="animate-spin inline-block">⟳</span> : '↺'}
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
