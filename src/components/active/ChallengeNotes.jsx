import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChallengeStore } from '../../store/challengeStore'
import Textarea from '../ui/Textarea'
import Button  from '../ui/Button'

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

export default function ChallengeNotes({ challengeId, notes = [] }) {
  const addNote    = useChallengeStore(s => s.addNote)
  const deleteNote = useChallengeStore(s => s.deleteNote)

  const [open,  setOpen]  = useState(false)
  const [text,  setText]  = useState('')
  const [input, setInput] = useState(false)

  const handleAdd = () => {
    if (text.trim().length < 2) return
    addNote(challengeId, text)
    setText('')
    setInput(false)
  }

  const sorted = [...notes].reverse()

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full bg-transparent border-none cursor-pointer"
      >
        <span className="page-label">
          📝 Заметки {notes.length > 0 && `(${notes.length})`}
        </span>
        <span className="text-muted text-[18px]">{open ? '▲' : '▼'}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{   height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="flex flex-col gap-2 pt-1 max-h-[200px] overflow-y-auto">
              {/* Notes list */}
              {sorted.map(note => (
                <div
                  key={note.id}
                  className="bg-surface border border-line rounded-xl px-3 py-2 flex gap-2 items-start"
                >
                  <div className="flex-1">
                    <p className="text-fg text-sm m-0 leading-[1.5]">{note.text}</p>
                    <span className="text-muted text-[11px]">{formatTime(note.createdAt)}</span>
                  </div>
                  <button
                    onClick={() => deleteNote(challengeId, note.id)}
                    className="text-muted text-[16px] bg-transparent border-none cursor-pointer leading-none shrink-0"
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Add note */}
              {input ? (
                <div className="flex flex-col gap-2">
                  <Textarea
                    autoFocus
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Что происходит? Как продвигаешься?"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button variant="ok" onClick={handleAdd} disabled={text.trim().length < 2} className="flex-1">
                      Сохранить
                    </Button>
                    <Button variant="ghost" onClick={() => { setInput(false); setText('') }}>
                      Отмена
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setInput(true)}
                  className="w-full border border-dashed border-line rounded-xl py-2 text-muted text-sm cursor-pointer bg-transparent"
                >
                  + Добавить заметку
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
