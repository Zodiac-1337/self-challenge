import { useEffect, useState } from 'react'
import { useConfetti } from '../../hooks/useConfetti'
import Button     from '../ui/Button'
import Card       from '../ui/Card'
import StatBox    from './StatBox'
import LevelUpBadge from './LevelUpBadge'
import ShareButton  from './ShareButton'

export default function VictoryScreen({ result, challenge, streak, totalXP, navigate }) {
  const { xpEarned = 0, savedHours = 0, newStreak = streak,
          level, prevLevel, leveledUp, challengeDifficulty } = result

  const [showLevelUp, setShowLevelUp] = useState(leveledUp ?? false)

  useConfetti(challengeDifficulty ?? challenge?.difficulty ?? 'medium')

  useEffect(() => {
    if (navigator.vibrate) navigator.vibrate([100, 50, 200])
  }, [])

  return (
    <>
      {showLevelUp && level && prevLevel && (
        <LevelUpBadge level={level} prevLevel={prevLevel} onDismiss={() => setShowLevelUp(false)} />
      )}

      <div
        className="flex flex-col items-center justify-between h-full px-6 py-10"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, #00c85118 0%, transparent 70%)' }}
      >
        <div />

        <div className="flex flex-col items-center gap-6 w-full">
          <span className="text-[80px] leading-none" style={{ animation: 'float 2.5s ease-in-out infinite' }}>🏆</span>

          <div className="flex flex-col items-center gap-2">
            <h1 className="font-display text-ok m-0" style={{ fontSize: '3rem', letterSpacing: '0.06em' }}>
              ПОБЕДА!
            </h1>
            <p className="text-muted text-[15px] text-center m-0">
              Ты держал слово. Это важнее результата.
            </p>
          </div>

          <div className="w-full grid grid-cols-3 gap-3 max-w-[360px]">
            <StatBox label="XP"    value={`+${xpEarned}`} color="var(--color-ok)" />
            <StatBox label="Серия" value={newStreak}       color="var(--color-warn)" />
            {savedHours > 0
              ? <StatBox label="Досрочно" value={`-${savedHours}ч`} color="#4a9eff" />
              : <StatBox label="Всего XP" value={totalXP}           color="#4a9eff" />}
          </div>

          {level && (
            <Card className="px-5 py-[14px] text-center w-full max-w-[360px]">
              <div className="text-[28px]">{level.emoji}</div>
              <div className="font-semibold mt-1">{level.label}</div>
              {newStreak >= 3 && (
                <div className="text-muted text-[12px] mt-[2px]">{newStreak} побед подряд</div>
              )}
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-3 w-full max-w-[360px]">
          <Button variant="ok" onClick={() => navigate('/create')}>НОВЫЙ ВЫЗОВ</Button>
          <ShareButton result={result} challenge={challenge} />
          <Button variant="ghost" onClick={() => navigate('/history')}>Посмотреть историю</Button>
        </div>
      </div>
    </>
  )
}
