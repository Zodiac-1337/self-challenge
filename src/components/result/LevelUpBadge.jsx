import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function LevelUpBadge({ level, prevLevel, onDismiss }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); onDismiss?.() }, 2800)
    return () => clearTimeout(t)
  }, [])

  const dismiss = () => { setVisible(false); onDismiss?.() }

  // ✅ Portal — рендерим прямо в document.body
  // Иначе position:fixed ломается из-за transform в родительском VictoryScreen
  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={dismiss}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.88)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '20px', cursor: 'pointer',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ position: 'absolute', width: '260px', height: '260px', borderRadius: '50%', border: '2px solid #ffdd00' }}
          />

          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 14 }}
            style={{
              width: '180px', height: '180px', borderRadius: '50%',
              background: 'radial-gradient(circle at 40% 35%, #2a2a00, #1a1a00)',
              border: '3px solid #ffdd00',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 60px #ffdd0044',
            }}
          >
            <span style={{ fontSize: '64px', lineHeight: 1 }}>{level.emoji}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ color: '#ffdd00', fontSize: '12px', letterSpacing: '0.2em', marginBottom: '8px' }}>
              НОВЫЙ УРОВЕНЬ
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', letterSpacing: '0.06em', color: '#fff' }}>
              {level.label.toUpperCase()}
            </div>
            <div style={{ color: '#666', fontSize: '13px', marginTop: '8px' }}>
              Было: {prevLevel.emoji} {prevLevel.label}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            style={{ color: '#444', fontSize: '12px', position: 'absolute', bottom: '48px' }}
          >
            нажми чтобы продолжить
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
