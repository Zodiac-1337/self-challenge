export function useShareCard() {
  const download = ({ title, type, streak, xpEarned, levelEmoji, levelLabel }) => {
    const SIZE   = 1080
    const canvas = document.createElement('canvas')
    canvas.width  = SIZE
    canvas.height = SIZE
    const ctx = canvas.getContext('2d')

    const isVictory = type === 'victory'
    const accent    = isVictory ? '#00c851' : '#ff3d3d'

    // Background
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, SIZE, SIZE)

    // Radial glow
    const grd = ctx.createRadialGradient(SIZE / 2, SIZE * 0.4, 0, SIZE / 2, SIZE * 0.4, SIZE * 0.55)
    grd.addColorStop(0, accent + '22')
    grd.addColorStop(1, 'transparent')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, SIZE, SIZE)

    // Border
    ctx.strokeStyle = accent + '44'
    ctx.lineWidth   = 6
    ctx.strokeRect(30, 30, SIZE - 60, SIZE - 60)

    // App name
    ctx.fillStyle = '#444'
    ctx.font      = 'bold 36px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('SELF-CHALLENGE', SIZE / 2, 110)

    // Big emoji
    ctx.font     = '200px serif'
    ctx.fillText(isVictory ? '🏆' : '💀', SIZE / 2, 420)

    // Result text
    ctx.fillStyle = accent
    ctx.font      = `bold 130px system-ui, sans-serif`
    ctx.fillText(isVictory ? 'ПОБЕДА!' : 'ПРОВАЛ', SIZE / 2, 570)

    // Challenge title (truncated)
    const maxChars = 32
    const displayTitle = title.length > maxChars ? title.slice(0, maxChars) + '…' : title
    ctx.fillStyle = '#cccccc'
    ctx.font      = '44px system-ui, sans-serif'
    ctx.fillText(displayTitle, SIZE / 2, 660)

    // Stats row
    if (isVictory) {
      ctx.fillStyle = '#666'
      ctx.font      = '36px system-ui, sans-serif'
      ctx.fillText(`${levelEmoji} ${levelLabel}  ·  🔥 Серия ${streak}  ·  +${xpEarned} XP`, SIZE / 2, 760)
    }

    // Decorative bottom line
    ctx.strokeStyle = accent + '55'
    ctx.lineWidth   = 2
    ctx.beginPath()
    ctx.moveTo(200, 860)
    ctx.lineTo(SIZE - 200, 860)
    ctx.stroke()

    // Trigger download
    const link    = document.createElement('a')
    link.download = `self-challenge-${isVictory ? 'victory' : 'fail'}.png`
    link.href     = canvas.toDataURL('image/png')
    link.click()
  }

  return { download }
}
