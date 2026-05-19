import { useState } from 'react'

const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь',
                'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']
const DAYS   = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']

export default function CalendarPicker({ selected, onSelect }) {
  const today = new Date(); today.setHours(0,0,0,0)

  const [view, setView] = useState(() => {
    const d = selected ? new Date(selected) : new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })

  const year  = view.getFullYear()
  const month = view.getMonth()

  // Build 7-column grid (Mon–Sun)
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7 // 0=Mon
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []

  for (let i = 0; i < firstDow; i++) {
    const d = new Date(year, month, 1 - (firstDow - i))
    cells.push({ date: d, current: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), current: true })
  }
  while (cells.length % 7 !== 0) {
    const d = new Date(year, month + 1, cells.length - daysInMonth - firstDow + 1)
    cells.push({ date: d, current: false })
  }

  const isToday    = d => d.toDateString() === today.toDateString()
  const isSelected = d => selected && d.toDateString() === new Date(selected).toDateString()
  const isPast     = d => d < today

  const canGoPrev = new Date(year, month - 1, 1) >= new Date(today.getFullYear(), today.getMonth(), 1)

  return (
    <div className="flex flex-col gap-3">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => canGoPrev && setView(new Date(year, month - 1, 1))}
          disabled={!canGoPrev}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-colors"
          style={{ color: canGoPrev ? 'var(--color-fg)' : 'var(--color-line)', background: 'none', border: 'none', cursor: canGoPrev ? 'pointer' : 'default' }}
        >←</button>

        <span className="font-semibold text-[15px]">
          {MONTHS[month]} {year}
        </span>

        <button
          onClick={() => setView(new Date(year, month + 1, 1))}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
          style={{ color: 'var(--color-fg)', background: 'none', border: 'none', cursor: 'pointer' }}
        >→</button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 text-center">
        {DAYS.map(d => (
          <div key={d} className="text-[11px] tracking-[0.08em] py-1" style={{ color: 'var(--color-muted)' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map(({ date, current }, i) => {
          const past = isPast(date)
          const sel  = isSelected(date)
          const tod  = isToday(date)
          const disabled = past || !current

          return (
            <button
              key={i}
              onClick={() => !disabled && onSelect(date)}
              disabled={disabled}
              className="h-9 w-full rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              style={{
                background: sel ? 'var(--color-accent)' : tod ? '#ff3d3d22' : 'none',
                color:      sel ? '#fff' : !current || past ? 'var(--color-line)' : tod ? 'var(--color-accent)' : 'var(--color-fg)',
                border:     tod && !sel ? '1px solid #ff3d3d44' : 'none',
                cursor:     disabled ? 'default' : 'pointer',
                fontWeight: tod || sel ? '700' : '400',
              }}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
