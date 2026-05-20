// Активность по неделям — последние N недель
export function getWeeklyActivity(challenges, weeks = 8) {
  const now = new Date()
  return Array.from({ length: weeks }, (_, i) => {
    const end = new Date(now)
    end.setDate(now.getDate() - i * 7)
    end.setHours(23, 59, 59, 999)
    const start = new Date(end)
    start.setDate(end.getDate() - 6)
    start.setHours(0, 0, 0, 0)

    const inWeek = challenges.filter(c => {
      if (c.status === 'active') return false
      const d = new Date(c.completedAt || c.createdAt)
      return d >= start && d <= end
    })

    return {
      label: start.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
      wins:  inWeek.filter(c => c.status === 'completed').length,
      fails: inWeek.filter(c => c.status === 'failed').length,
    }
  }).reverse()
}

// Накопительный XP по времени
export function getXPProgression(challenges) {
  const sorted = [...challenges]
    .filter(c => c.status === 'completed' && c.completedAt && (c.xpEarned ?? 0) > 0)
    .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt))

  let cum = 0
  return sorted.map(c => {
    cum += c.xpEarned
    return {
      label: new Date(c.completedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
      xp: cum,
    }
  })
}

// Статистика по сложности
export function getDifficultyStats(challenges) {
  const done = challenges.filter(c => c.status !== 'active')
  return ['easy', 'medium', 'hard'].map(diff => {
    const group = done.filter(c => c.difficulty === diff)
    return {
      label: { easy: 'Easy', medium: 'Medium', hard: 'Hard' }[diff],
      wins:  group.filter(c => c.status === 'completed').length,
      total: group.length,
      color: { easy: '#00c851', medium: '#ff9500', hard: '#ff3d3d' }[diff],
    }
  }).filter(d => d.total > 0)
}

// Среднее время выполнения в часах
export function getAvgHours(challenges) {
  const done = challenges.filter(c => c.status === 'completed' && c.completedAt)
  if (!done.length) return null
  const avg = done.reduce((s, c) =>
    s + (new Date(c.completedAt) - new Date(c.createdAt)) / 3_600_000, 0
  ) / done.length
  return Math.round(avg)
}
