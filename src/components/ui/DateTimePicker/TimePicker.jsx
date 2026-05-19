import { useRef, useEffect, useLayoutEffect } from 'react'

const ITEM_H = 52
const HOURS  = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

// Min valid time for a given date (returns { minHour, minMinute })
function getMinTime(date) {
  const now     = new Date()
  const isToday = date?.toDateString() === now.toDateString()
  if (!isToday) return { minHour: 0, minMinute: 0 }

  const minHour   = now.getHours()
  const raw       = now.getMinutes() + 6               // at least +5 min
  const minMinute = Math.ceil(raw / 5) * 5             // round up to next :05

  if (minMinute >= 60) return { minHour: minHour + 1, minMinute: 0 }
  return { minHour, minMinute }
}

// Drum — scrollable column that snaps to item
function Drum({ items, value, isDisabled, onChange, label }) {
  const ref   = useRef(null)
  const timer = useRef(null)
  const ready = useRef(false)

  const indexOf = v => items.indexOf(v)

  // Set initial scroll without animation
  useLayoutEffect(() => {
    const idx = indexOf(value)
    if (ref.current && idx >= 0) ref.current.scrollTop = idx * ITEM_H
    ready.current = true
  }, []) // eslint-disable-line

  // Sync scroll when value changes programmatically
  useEffect(() => {
    if (!ready.current) return
    const idx = indexOf(value)
    if (ref.current && idx >= 0) {
      ref.current.scrollTo({ top: idx * ITEM_H, behavior: 'smooth' })
    }
  }, [value]) // eslint-disable-line

  const handleScroll = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      if (!ref.current) return
      let idx = Math.round(ref.current.scrollTop / ITEM_H)
      idx = Math.max(0, Math.min(idx, items.length - 1))

      // Skip disabled — find nearest enabled forward, then backward
      let fwd = idx
      while (fwd < items.length  && isDisabled(items[fwd])) fwd++
      let bwd = idx
      while (bwd >= 0 && isDisabled(items[bwd])) bwd--

      const finalIdx = fwd < items.length ? fwd : bwd >= 0 ? bwd : idx
      ref.current.scrollTo({ top: finalIdx * ITEM_H, behavior: 'smooth' })
      if (items[finalIdx] !== undefined) onChange(items[finalIdx])
    }, 120)
  }

  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <span className="text-[11px] tracking-[0.1em]" style={{ color: 'var(--color-muted)' }}>
        {label}
      </span>

      <div style={{ position: 'relative', height: ITEM_H * 5, width: '100%', overflow: 'hidden' }}>
        {/* Highlight band */}
        <div style={{
          position: 'absolute', top: ITEM_H * 2, left: 8, right: 8, height: ITEM_H,
          background: '#ff3d3d18', borderTop: '1px solid #ff3d3d44', borderBottom: '1px solid #ff3d3d44',
          borderRadius: '10px', pointerEvents: 'none', zIndex: 1,
        }} />
        {/* Top fade */}
        <div style={{ position: 'absolute', inset: '0 0 auto', height: ITEM_H * 2,
          background: 'linear-gradient(to bottom, var(--color-surface) 20%, transparent)',
          pointerEvents: 'none', zIndex: 2 }} />
        {/* Bottom fade */}
        <div style={{ position: 'absolute', inset: 'auto 0 0', height: ITEM_H * 2,
          background: 'linear-gradient(to top, var(--color-surface) 20%, transparent)',
          pointerEvents: 'none', zIndex: 2 }} />

        <div
          ref={ref}
          onScroll={handleScroll}
          style={{
            height: '100%', overflowY: 'scroll', overflowX: 'hidden',
            scrollSnapType: 'y mandatory', scrollbarWidth: 'none',
            paddingTop: ITEM_H * 2, paddingBottom: ITEM_H * 2,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {items.map(item => {
            const dis = isDisabled(item)
            const sel = item === value
            return (
              <div
                key={item}
                style={{
                  height: ITEM_H, scrollSnapAlign: 'center',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem', letterSpacing: '0.04em',
                  color: dis ? 'var(--color-line)' : sel ? 'var(--color-accent)' : 'var(--color-fg)',
                  transition: 'color 0.1s',
                  userSelect: 'none',
                }}
              >
                {String(item).padStart(2, '0')}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function TimePicker({ selectedDate, hour, minute, onChange }) {
  const { minHour, minMinute } = getMinTime(selectedDate)

  const isHourDisabled   = h => h < minHour
  const isMinuteDisabled = m => {
    if (hour < minHour)  return true
    if (hour === minHour) return m < minMinute
    return false
  }

  // Auto-correct minute when hour changes into restricted zone
  useEffect(() => {
    if (hour === minHour && minute < minMinute) {
      const snap = MINUTES.find(m => m >= minMinute) ?? MINUTES[MINUTES.length - 1]
      onChange(hour, snap)
    }
  }, [hour, minHour, minMinute]) // eslint-disable-line

  const SEPARATOR_STYLE = {
    fontFamily: 'var(--font-display)',
    fontSize: '2rem',
    color: 'var(--color-muted)',
    alignSelf: 'center',
    paddingBottom: '4px',
    lineHeight: 1,
  }

  return (
    <div className="flex items-stretch gap-2">
      <Drum
        items={HOURS}
        value={hour}
        isDisabled={isHourDisabled}
        onChange={h => onChange(h, minute)}
        label="ЧАСЫ"
      />
      <span style={SEPARATOR_STYLE}>:</span>
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
