import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CalendarPicker from './CalendarPicker'
import TimePicker     from './TimePicker'

const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
const pad     = n => String(n).padStart(2, '0')

function toLocalISO(date, h, m) {
  const d = new Date(date)
  d.setHours(h, m, 0, 0)
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(h)}:${pad(m)}`
}

function getDefaultTime() {
  const d = new Date(Date.now() + 10 * 60 * 1000)
  const m = Math.ceil(d.getMinutes() / 5) * 5
  return m >= 60
    ? { hour: (d.getHours() + 1) % 24, minute: 0 }
    : { hour: d.getHours(), minute: m }
}

function PickerTab({ id, label, active, disabled, onClick }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ flex: 1, padding: '10px 8px', borderRadius: '10px', border: 'none',
        background: active ? '#ff3d3d22' : 'none', transition: 'all 0.15s',
        color: active ? 'var(--color-accent)' : disabled ? 'var(--color-line)' : 'var(--color-muted)',
        fontSize: '13px', fontWeight: active ? '600' : '400',
        cursor: disabled ? 'default' : 'pointer',
        outline: active ? '1px solid #ff3d3d44' : 'none' }}>
      {id === 'date' ? '📅 ' : '⏰ '}{label}
    </button>
  )
}

const SLIDE = { date: { initial: { opacity: 0, x: -12 }, exit: { opacity: 0, x: 12  } },
                time: { initial: { opacity: 0, x:  12 }, exit: { opacity: 0, x: -12 } } }

export default function DateTimePicker({ value, onChange }) {
  const parsed = value ? new Date(value) : null
  const def    = getDefaultTime()

  const [step,   setStep]   = useState('date')
  const [date,   setDate]   = useState(parsed ?? null)
  const [hour,   setHour]   = useState(() => parsed?.getHours()   ?? def.hour)
  const [minute, setMinute] = useState(() => parsed?.getMinutes() ?? def.minute)

  // Snap minute to :05 grid on init
  useEffect(() => {
    const s = MINUTES.includes(minute) ? minute : (MINUTES.find(m => m >= minute) ?? 55)
    if (s !== minute) setMinute(s)
  }, []) // eslint-disable-line

  // Emit ISO string whenever date/time changes
  useEffect(() => {
    if (!date) { onChange(''); return }
    const iso = toLocalISO(date, hour, minute)
    onChange(new Date(iso) > new Date() ? iso : '')
  }, [date, hour, minute]) // eslint-disable-line

  const dateLabel = date
    ? date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' })
    : 'Выбрать дату'
  const timeLabel = `${pad(hour)}:${pad(minute)}`

  return (
    <div className="rounded-2xl p-4 flex flex-col gap-4"
         style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line)' }}>

      <div className="flex gap-2">
        <PickerTab id="date" label={dateLabel} active={step === 'date'} onClick={() => setStep('date')} />
        <PickerTab id="time" label={timeLabel} active={step === 'time'} disabled={!date}
                   onClick={() => date && setStep('time')} />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {step === 'date' && (
          <motion.div key="date" animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.18 }}
            {...SLIDE.date}>
            <CalendarPicker selected={date} onSelect={d => { setDate(d); setStep('time') }} />
          </motion.div>
        )}
        {step === 'time' && (
          <motion.div key="time" animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.18 }}
            {...SLIDE.time}>
            <TimePicker selectedDate={date} hour={hour} minute={minute}
              onChange={(h, m) => { setHour(h); setMinute(m) }} />
            {date && (
              <div className="mt-4 text-center text-sm rounded-xl py-3"
                   style={{ background: '#ff3d3d0d', color: 'var(--color-muted)' }}>
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
