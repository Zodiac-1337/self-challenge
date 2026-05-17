import { useState, useEffect } from 'react'

export function useCountdown(deadline) {
  const calc = () => {
    const diff = new Date(deadline) - Date.now()
    if (diff <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
    const total   = diff
    const seconds = Math.floor((diff / 1000) % 60)
    const minutes = Math.floor((diff / 1000 / 60) % 60)
    const hours   = Math.floor((diff / 1000 / 60 / 60) % 24)
    const days    = Math.floor(diff / 1000 / 60 / 60 / 24)
    return { total, days, hours, minutes, seconds, expired: false }
  }

  const [time, setTime] = useState(calc)

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(id)
  }, [deadline])

  return time
}

export function pad(n) {
  return String(n).padStart(2, '0')
}

// Returns 'green' | 'yellow' | 'red' based on % of time remaining
export function getUrgency(deadline, createdAt) {
  const total     = new Date(deadline) - new Date(createdAt)
  const remaining = new Date(deadline) - Date.now()
  const pct       = remaining / total

  if (pct > 0.5) return 'green'
  if (pct > 0.2) return 'yellow'
  return 'red'
}
