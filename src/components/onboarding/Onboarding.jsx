import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../ui/Button'

const SLIDES = [
  {
    emoji: '⚡',
    title: 'Self-Challenge',
    sub:   'Личный контракт с собой',
    body:  'Ты ставишь себе вызов, задаёшь дедлайн и условия. Никто не заставляет — только твоё слово.',
  },
  {
    emoji: '📋',
    title: 'Как это работает',
    sub:   'Три простых шага',
    body:  null,
    steps: [
      { icon: '✍️', text: 'Опиши задачу и задай дедлайн' },
      { icon: '🔥', text: 'Подпиши контракт с собой' },
      { icon: '🏆', text: 'Выполни или признай провал честно' },
    ],
  },
  {
    emoji: '🎯',
    title: 'Ставки реальны',
    sub:   'Это не to-do лист',
    body:  'Каждый вызов — публичное обязательство перед собой. Провал фиксируется. Победа награждается. Серия побед строит характер.',
  },
]

const slideVariants = {
  enter: dir => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center:         { x: 0, opacity: 1 },
  exit:  dir => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

export default function Onboarding({ onDone }) {
  const [index, setIndex] = useState(0)
  const [dir,   setDir]   = useState(1)

  const next = () => {
    if (index < SLIDES.length - 1) { setDir(1); setIndex(i => i + 1) }
    else onDone()
  }

  const prev = () => {
    if (index > 0) { setDir(-1); setIndex(i => i - 1) }
  }

  const slide = SLIDES[index]
  const isLast = index === SLIDES.length - 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0a] px-6 py-10"
      style={{ maxWidth: '480px', margin: '0 auto' }}
    >
      {/* Skip */}
      <div className="flex justify-end">
        <button onClick={onDone} className="btn-ghost text-[13px]">
          Пропустить
        </button>
      </div>

      {/* Slide */}
      <div className="flex-1 flex flex-col justify-center overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <span className="text-[80px] leading-none">{slide.emoji}</span>

            <div>
              <h2 className="font-display m-0 text-fg" style={{ fontSize: '2.2rem', letterSpacing: '0.04em' }}>
                {slide.title}
              </h2>
              <p className="text-muted text-sm mt-1 m-0">{slide.sub}</p>
            </div>

            {slide.body && (
              <p className="text-fg text-[15px] leading-[1.7] max-w-[320px] m-0">
                {slide.body}
              </p>
            )}

            {slide.steps && (
              <div className="flex flex-col gap-3 w-full max-w-[320px]">
                {slide.steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-4 bg-surface border border-line rounded-xl px-4 py-3">
                    <span className="text-[24px]">{s.icon}</span>
                    <span className="text-fg text-sm text-left">{s.text}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 py-4">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width:      i === index ? '20px' : '6px',
              height:     '6px',
              background: i === index ? 'var(--color-accent)' : 'var(--color-line)',
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-3">
        <Button variant="primary" onClick={next}>
          {isLast ? 'НАЧАТЬ →' : 'ДАЛЕЕ →'}
        </Button>
        {index > 0 && (
          <Button variant="ghost" onClick={prev}>Назад</Button>
        )}
      </div>
    </motion.div>
  )
}
