import { motion } from 'framer-motion'
import Button from '../ui/Button'

function MenuItem({ icon, title, sub, onClick, muted = false }) {
  return (
    <button
      onClick={onClick}
      className="menu-row w-full"
      style={{ background: muted ? 'none' : 'var(--color-surface)' }}
    >
      <span className="text-[20px]">{icon}</span>
      <div className="text-left">
        <div className={`font-semibold text-sm ${muted ? 'text-muted' : 'text-fg'}`}>{title}</div>
        <div className="text-[12px] text-muted mt-[2px]">{sub}</div>
      </div>
    </button>
  )
}

export default function ConfirmCancel({ onEdit, onCancel, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
      className="flex flex-col gap-3"
    >
      <p className="text-center text-muted text-[13px] m-0">
        Что хочешь сделать с этим вызовом?
      </p>

      <MenuItem
        icon="✏️"
        title="Редактировать"
        sub="Изменить название, дедлайн или условия"
        onClick={onEdit}
      />
      <MenuItem
        icon="🗑️"
        title="Отменить вызов"
        sub="Удалить без записи в историю"
        onClick={onCancel}
        muted
      />

      <Button variant="ghost" onClick={onBack}>Назад</Button>
    </motion.div>
  )
}
