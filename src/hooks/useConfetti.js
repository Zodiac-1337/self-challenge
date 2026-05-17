import { useEffect } from 'react'
import confetti from 'canvas-confetti'

const COLORS = ['#ff3d3d', '#ff9500', '#00c851', '#ffffff', '#ffdd00']

function burst(opts) {
  confetti({
    particleCount: opts.count ?? 80,
    spread:        opts.spread ?? 70,
    origin:        opts.origin ?? { x: 0.5, y: 0.55 },
    colors:        COLORS,
    startVelocity: opts.velocity ?? 30,
    gravity:       0.9,
    ticks:         200,
  })
}

export function useConfetti(difficulty) {
  useEffect(() => {
    const intensity = difficulty === 'hard' ? 1.6 : difficulty === 'medium' ? 1.2 : 0.9

    // Initial center burst — delayed so page animation finishes first
    const t1 = setTimeout(() => {
      burst({ count: Math.round(100 * intensity), spread: 80, velocity: 35 })
    }, 350)

    // Left cannon
    const t2 = setTimeout(() => {
      burst({ count: Math.round(50 * intensity), spread: 55, origin: { x: 0.1, y: 0.6 }, velocity: 45 })
    }, 650)

    // Right cannon
    const t3 = setTimeout(() => {
      burst({ count: Math.round(50 * intensity), spread: 55, origin: { x: 0.9, y: 0.6 }, velocity: 45 })
    }, 850)

    // Follow-up shower
    const t4 = setTimeout(() => {
      burst({ count: Math.round(40 * intensity), spread: 120, velocity: 20 })
    }, 1300)

    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [difficulty])
}
