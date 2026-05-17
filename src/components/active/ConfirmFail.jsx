import { motion } from 'framer-motion'
import Button from '../ui/Button'
import Textarea from '../ui/Textarea'

export default function ConfirmFail({ mode, failNote, setFailNote, onConfirm, onCancel }) {
  const isExpired = mode === 'expired'
  const isReady   = failNote.trim().length >= 3

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="flex flex-col gap-3"
    >
      <p className="text-center font-semibold text-accent m-0">
        {isExpired ? 'Время вышло.' : 'Признаёшь поражение?'}
      </p>

      <Textarea
        variant="danger"
        value={failNote}
        onChange={e => setFailNote(e.target.value)}
        placeholder="Где именно ты сломался? (обязательно)"
        rows={3}
      />

      <Button
        variant="primary"
        disabled={!isReady}
        onClick={onConfirm}
        style={{ fontSize: '1.2rem' }}
      >
        ЗАФИКСИРОВАТЬ ПРОВАЛ
      </Button>

      {!isExpired && <Button variant="ghost" onClick={onCancel}>Назад</Button>}
    </motion.div>
  )
}
