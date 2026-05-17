import { useState } from 'react'
import { motion } from 'framer-motion'

/**
 * variant:
 *   'primary' — красная CTA (по умолчанию)
 *   'ok'      — зелёная CTA
 *   'ghost'   — прозрачная текстовая
 *
 * size:  'md' (18px pad, 1.3rem) | 'lg' (20px pad, 1.5rem)
 * ripple — волновой эффект при нажатии (для Accept)
 * Все остальные props прокидываются в <button>
 */

const VARIANT_CLS = {
  primary: 'btn-cta bg-accent text-white',
  ok:      'btn-cta bg-ok text-white',
  ghost:   'btn-ghost',
}

const SIZE_STYLE = {
  md: { padding: '18px', fontSize: '1.3rem' },
  lg: { padding: '20px', fontSize: '1.5rem' },
}

export default function Button({
  variant  = 'primary',
  size     = 'md',
  ripple   = false,
  disabled = false,
  onClick,
  className = '',
  style,
  children,
  ...props
}) {
  const [ripples, setRipples] = useState([])

  const handleClick = (e) => {
    if (disabled) return
    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect()
      const sz   = Math.max(rect.width, rect.height) * 2
      const id   = Date.now()
      setRipples(r => [...r, { id, x: e.clientX - rect.left - sz / 2, y: e.clientY - rect.top - sz / 2, size: sz }])
      setTimeout(() => setRipples(r => r.filter(rip => rip.id !== id)), 700)
    }
    onClick?.(e)
  }

  const sizeStyle = variant === 'ghost' ? {} : SIZE_STYLE[size]

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={handleClick}
      disabled={disabled}
      className={`${VARIANT_CLS[variant]} ${className}`}
      style={{
        ...sizeStyle,
        ...(ripple ? { position: 'relative', overflow: 'hidden' } : {}),
        ...style,
      }}
      {...props}
    >
      {ripple && ripples.map(({ id, x, y, size: sz }) => (
        <span
          key={id}
          style={{
            position: 'absolute', left: x, top: y,
            width: sz, height: sz, borderRadius: '50%',
            background: 'rgba(255,255,255,0.22)',
            animation: 'ripple 0.7s ease-out forwards',
            pointerEvents: 'none',
          }}
        />
      ))}
      {children}
    </motion.button>
  )
}
