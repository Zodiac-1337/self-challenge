import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CalendarPicker from './CalendarPicker'
import TimePicker     from './TimePicker'

const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

// ISO string "YYYY-MM-DDTHH:mm" in LOCAL time (same format as datetime-local input)
function toLocalISO(date, hour, minute) {
  const d = new Date(date)
  d.setHours(hour, minute, 0, 0)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(hour)}:${pad(minute)}`
}

// Default time: next round 5-min slot at least 10 min from now
function getDefaultTime() {
  const d = new Date(Date.now() + 10 * 60 * 1000)
  const m = Math.ceil(d.getMinutes() / 5) * 5
  // % 24 handles the 23:5x edge case (prevents hour:24)
  if (m >= 60) return { hour: (d.getHours() + 1) % 24, minute: 0 }
  return { hour: d.getHours(), minute: m }
}

export default function DateTimePicker({ value, onChange }) {
  const parsed = value ? new Date(value) : null

  const [step,   setStep]   = useState('date')
  const [date,   setDate]   = useState(parsed ?? null)
  const [hour,   setHour]   = useState(() => parsed?.getHours()   ?? getDefaultTime().hour)
  const [minute, setMinute] = useState(() => parsed?.getMinutes() ?? getDefaultTime().minute)

  // Snap minute to nearest :05 on init
  useEffect(() => {
    const snapped = MINUTES.includes(minute) ? minute : MINUTES.find(m => m >= minute) ?? 55
    if (snapped !== minute) setMinute(snapped)
  }, []) // eslint-disable-line

  // Emit combined ISO whenever state changes
  useEffect(() => {
    if (!date) { onChange(''); return }
    const iso = toLocalISO(date, hour, minute)
    // Only emit if the deadline is in the future
    if (new Date(iso) > new Date()) onChange(iso)
    else onChange('')
  }, [date, hour, minute]) // eslint-disable-line

  const handleDateSelect = (d) => {
    setDate(d)
    setStep('time')
  }

  const handleTimeChange = (h, m) => {
    setHour(h)
    setMinute(m)
  }

  const dateLabel = date
    ? date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' })
    : 'Выбрать дату'

  const timeLabel = `${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`

  const TAB = (id, label, active) => (
    <button
      onClick={() => (id === 'time' && !date) || setStep(id)}
      disabled={id === 'time' && !date}
      style={{
        flex: 1, padding: '10px 8px', borderRadius: '10px', border: 'none',
        background: active ? '#ff3d3d22' : 'none',
        color: active ? 'var(--color-accent)' : !date && id === 'time' ? 'var(--color-line)' : 'var(--color-muted)',
        fontSize: '13px', fontWeight: active ? '600' : '400',
        cursor: (!date && id === 'time') ? 'default' : 'pointer',
        transition: 'all 0.15s',
        outline: active ? '1px solid #ff3d3d44' : 'none',
      }}
    >
      {id === 'date' ? '📅 ' : '⏰ '}{label}
    </button>
  )

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-4"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line)' }}
    >
      {/* Tab switcher */}
      <div className="flex gap-2">
        {TAB('date', dateLabel, step === 'date')}
        {TAB('time', timeLabel, step === 'time')}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait" initial={false}>
        {step === 'date' && (
          <motion.div
            key="date"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.18 }}
          >
            <CalendarPicker selected={date} onSelect={handleDateSelect} />
          </motion.div>
        )}

        {step === 'time' && (
          <motion.div
            key="time"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.18 }}
          >
            <TimePicker
              selectedDate={date}
              hour={hour}
              minute={minute}
              onChange={handleTimeChange}
            />

            {/* Summary */}
            {date && (
              <div
                className="mt-4 text-center text-sm rounded-xl py-3"
                style={{ background: '#ff3d3d0d', color: 'var(--color-muted)' }}
              >
                Дедлайн:{' '}
                <span style={{ color: 'var(--color-fg)', fontWeight: 600 }}>
                  {date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} в {timeLabel}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
