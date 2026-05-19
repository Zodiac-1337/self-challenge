import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useChallengeStore, computeLevel } from '../store/challengeStore'
import { pageVariants } from '../hooks/usePageTransition'
import Button      from '../components/ui/Button'
import Onboarding  from '../components/onboarding/Onboarding'

const ONBOARDING_KEY = 'sc_onboarded'

export default function Home() {
  const navigate = useNavigate()
  const active   = useChallengeStore(s => s.challenges.find(c => c.id === s.activeId) ?? null)
  const streak   = useChallengeStore(s => s.streak)
  const level    = useChallengeStore(s => computeLevel(s.streak))

  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem(ONBOARDING_KEY)
  )

  if (active) { navigate('/active', { replace: true }); return null }

  if (showOnboarding) {
    return (
      <Onboarding
        onDone={() => {
          localStorage.setItem(ONBOARDING_KEY, '1')
          setShowOnboarding(false)
        }}
      />
    )
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial" animate="animate" exit="exit"
      className="flex flex-col items-center justify-center h-full px-6 gap-8"
    >
      {/* Уровень */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-[52px]">{level.emoji}</span>
        <span className="text-muted text-[12px] tracking-[0.12em]">
          {level.label.toUpperCase()}
        </span>
        {streak > 0 && (
          <span className="text-accent text-[13px]">🔥 Серия: {streak}</span>
        )}
      </div>

      {/* Заголовок */}
      <div className="flex flex-col items-center gap-4 w-full">
        <h1
          className="font-display text-center m-0"
          style={{ fontSize: 'clamp(2.5rem, 12vw, 4rem)', letterSpacing: '0.04em', lineHeight: 1.1 }}
        >
          БРОСИТЬ<br />СЕБЕ ВЫЗОВ
        </h1>
        <p className="text-muted text-center text-[15px] max-w-[280px] m-0">
          Поставь задачу. Задай ставку. Выполни или проиграй.
        </p>
      </div>

      {/* CTA */}
      <Button
        variant="primary"
        size="lg"
        onClick={() => navigate('/create')}
        className="max-w-[360px]"
        style={{ boxShadow: '0 0 32px rgba(255,61,61,0.2)' }}
      >
        НАЧАТЬ ВЫЗОВ
      </Button>

      <Button variant="ghost" onClick={() => navigate('/history')} className="underline">
        История челленджей
      </Button>
    </motion.div>
  )
}
