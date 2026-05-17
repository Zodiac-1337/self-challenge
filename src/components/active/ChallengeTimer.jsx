import { motion } from 'framer-motion'
import { pad } from '../../hooks/useCountdown'

export default function ChallengeTimer({ time, color }) {
  // Пульсация включается за 2 часа до дедлайна
  const pulse = time.total > 0 && time.total < 2 * 60 * 60 * 1000

  return (
    <motion.div
      animate={pulse ? { scale: [1, 1.015, 1] } : {}}
      transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
      style={{
        textAlign: 'center',
        padding: '24px 0',
        // Sprint 4: бордеры тоже меняют цвет вместе с urgency
        borderTop:    `1px solid ${color}55`,
        borderBottom: `1px solid ${color}55`,
        transition: 'border-color 2s ease',
      }}
    >
      {time.expired ? (
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: '#ff3d3d', letterSpacing: '0.1em' }}>
          ВРЕМЯ ВЫШЛО
        </div>
      ) : (
        <>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 18vw, 5rem)',
            letterSpacing: '0.06em',
            lineHeight: 1,
            color,
            transition: 'color 2s ease',
          }}>
            {time.days > 0
              ? `${time.days}д ${pad(time.hours)}:${pad(time.minutes)}`
              : `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '6px', letterSpacing: '0.1em' }}>
            {time.days > 0 ? 'ДНЕЙ ЧАСОВ МИНУТ' : 'ЧАСОВ МИНУТ СЕКУНД'}
          </div>
        </>
      )}
    </motion.div>
  )
}
