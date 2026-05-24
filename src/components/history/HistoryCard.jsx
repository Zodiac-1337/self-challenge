import { motion } from 'framer-motion'

const STATUS_META = {
  completed: { label: 'Победа',  emoji: '🏆', color: '#00c851' },
  failed:    { label: 'Провал',  emoji: '💀', color: '#ff3d3d' },
  active:    { label: 'Активен', emoji: '⚡', color: '#ff9500' },
}

export default function HistoryCard({ challenge: c, index, onDelete }) {
  const meta = STATUS_META[c.status] ?? STATUS_META.active
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex gap-3 items-start rounded-[14px] px-4 py-[14px]"
      style={{ background: 'var(--color-surface)', border: `1px solid ${meta.color}33` }}
    >
      <span className="text-[24px] leading-[1.2] shrink-0">{meta.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm mb-1 truncate">{c.title}</div>
        <div className="flex gap-[10px] text-[12px] flex-wrap" style={{ color: 'var(--color-muted)' }}>
          <span style={{ color: meta.color }}>{meta.label}</span>
          {c.xpEarned > 0 && <span>+{c.xpEarned} XP</span>}
          <span>{new Date(c.createdAt).toLocaleDateString('ru-RU')}</span>
        </div>
        {c.failureNote && (
          <div className="mt-[6px] text-[12px] italic leading-[1.5]"
               style={{ color: 'var(--color-muted)' }}>
            "{c.failureNote}"
          </div>
        )}
      </div>
      <button onClick={() => onDelete(c.id)}
        className="shrink-0 pl-1 bg-transparent border-none text-[18px] cursor-pointer leading-none"
        style={{ color: 'var(--color-line)' }}>×</button>
    </motion.div>
  )
}
