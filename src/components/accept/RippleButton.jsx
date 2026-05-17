import { useState } from 'react'

export default function RippleButton({ onClick, style, children, ...props }) {
  const [ripples, setRipples] = useState([])

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    const x    = e.clientX - rect.left - size / 2
    const y    = e.clientY - rect.top  - size / 2
    const id   = Date.now()

    setRipples(r => [...r, { id, x, y, size }])
    setTimeout(() => setRipples(r => r.filter(rip => rip.id !== id)), 700)

    onClick?.(e)
  }

  return (
    <button
      {...props}
      onClick={handleClick}
      style={{ ...style, position: 'relative', overflow: 'hidden' }}
    >
      {ripples.map(({ id, x, y, size }) => (
        <span
          key={id}
          style={{
            position:      'absolute',
            left:          x,
            top:           y,
            width:         size,
            height:        size,
            borderRadius:  '50%',
            background:    'rgba(255,255,255,0.22)',
            animation:     'ripple 0.7s ease-out forwards',
            pointerEvents: 'none',
          }}
        />
      ))}
      {children}
    </button>
  )
}
