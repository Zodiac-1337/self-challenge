import { useEffect } from 'react'
import Drum from './Drum'

const HOURS   = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

function getMinTime(date) {
  const now     = new Date()
  const isToday = date?.toDateString() === now.toDateString()
  if (!isToday) return { minHour: 0, minMinute: 0 }

  const minHour   = now.getHours()
  const raw       = now.getMinutes() + 6
  const minMinute = Math.ceil(raw / 5) * 5
  if (minMinute >= 60) return { minHour: minHour + 1, minMinute: 0 }
  return { minHour, minMinute }
}

export default function TimePicker({ selectedDate, hour, minute, onChange }) {
  const { minHour, minMinute } = getMinTime(selectedDate)

  const isHourDisabled   = h => h < minHour
  const isMinuteDisabled = m => {
    if (hour < minHour)   return true
    if (hour === minHour) return m < minMinute
    return false
  }

  // Авто-коррекция минуты при смене часа в ограниченную зону
  useEffect(() => {
    if (hour === minHour && minute < minMinute) {
      const snap = MINUTES.find(m => m >= minMinute) ?? MINUTES[MINUTES.length - 1]
      onChange(hour, snap)
    }
  }, [hour, minHour, minMinute]) // eslint-disable-line

  return (
    <div className="flex items-stretch gap-2">
      <Drum
        items={HOURS}
        value={hour}
        isDisabled={isHourDisabled}
        onChange={h => onChange(h, minute)}
        label="ЧАСЫ"
      />
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem',
        color: 'var(--color-muted)', alignSelf: 'center', paddingBottom: '4px', lineHeight: 1 }}>
        :
      </span>
      <Drum
        items={MINUTES}
        value={minute}
        isDisabled={isMinuteDisabled}
        onChange={m => onChange(hour, m)}
        label="МИНУТЫ"
      />
    </div>
  )
}
