import { motion } from 'framer-motion'
import Button from '../ui/Button'

export default function ConfirmComplete({ onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="flex flex-col gap-3"
    >
      <p className="text-center text-muted text-sm m-0">
        Ты уверен? Без читов — только если задача реально выполнена.
      </p>
      <Button variant="ok" onClick={onConfirm}>ДА, ВЫПОЛНЕНО!</Button>
      <Button variant="ghost" onClick={onCancel}>Назад</Button>
    </motion.div>
  )
}
