import { useState } from 'react'
import { useShareCard } from '../../hooks/useShareCard'

export default function ShareButton({ result, challenge }) {
  const { download } = useShareCard()
  const [done, setDone] = useState(false)

  const handleShare = () => {
    download({
      type:       'victory',
      title:      result.challengeTitle ?? challenge?.title ?? '',
      streak:     result.newStreak ?? 0,
      xpEarned:   result.xpEarned ?? 0,
      levelEmoji: result.level?.emoji ?? '🌱',
      levelLabel: result.level?.label ?? '',
    })
    setDone(true)
    setTimeout(() => setDone(false), 3000)
  }

  return (
    <button
      onClick={handleShare}
      className="w-full border border-line rounded-xl py-3 text-[14px] cursor-pointer bg-transparent transition-colors"
      style={{ color: done ? 'var(--color-ok)' : 'var(--color-muted)' }}
    >
      {done ? '✓ Картинка сохранена' : '📸 Поделиться результатом'}
    </button>
  )
}
