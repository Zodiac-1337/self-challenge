import { motion } from 'framer-motion'
import { DIFFICULTIES } from '../../constants/challenges'

function ContractRow({ icon, label, value, valueColor, badge }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
        {icon} {label.toUpperCase()}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px', color: valueColor ?? 'var(--text)', lineHeight: 1.5 }}>
          {value}
        </span>
        {badge && (
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--surface-2)', padding: '1px 6px', borderRadius: '4px' }}>
            {badge}
          </span>
        )}
      </div>
    </div>
  )
}

function Divider() {
  return <div style={{ borderTop: '1px solid var(--border)' }} />
}

export default function ContractCard({ form }) {
  const diff     = DIFFICULTIES.find(d => d.id === form.difficulty)
  const deadline = new Date(form.deadline).toLocaleString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Title */}
      <div>
        <p style={{ margin: '0 0 6px', color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.12em' }}>
          Я ОБЯЗУЮСЬ
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 7vw, 2.2rem)', letterSpacing: '0.03em', lineHeight: 1.15, margin: 0 }}>
          {form.title}
        </h1>
        {form.description && (
          <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.5 }}>
            {form.description}
          </p>
        )}
      </div>

      <Divider />

      <div className="flex flex-col gap-2">
        <ContractRow icon="⏰" label="Дедлайн"    value={deadline} />
        <ContractRow icon="⚡" label="Сложность"  value={diff?.label ?? '—'} valueColor={diff?.color} badge={`+${diff?.xp} XP`} />
      </div>

      <Divider />

      <div className="flex flex-col gap-3">
        <ContractRow icon="💀" label="Провалом считается" valueColor="#ff3d3d99"
          value={form.failureCondition || 'Невыполнение задачи к дедлайну'} />
        <ContractRow icon="🏆" label="Награда за победу"  valueColor="#00c85199"
          value={form.reward || 'Гордость за себя'} />
        {form.stake && (
          <ContractRow icon="⚠️" label="Ставка при провале" value={form.stake} valueColor="#ff950099" />
        )}
      </div>

      <Divider />

      {/* Signature line */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ width: '120px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.08em' }}>ПОДПИСЬ</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
            {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.08em' }}>ДАТА</span>
        </div>
      </div>
    </motion.div>
  )
}
