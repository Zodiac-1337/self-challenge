import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useChallengeStore } from '../store/challengeStore'
import { useCountdown, getUrgency } from '../hooks/useCountdown'
import { URGENCY_COLORS } from '../constants/challenges'
import { pageVariants } from '../hooks/usePageTransition'
import ChallengeTimer  from '../components/active/ChallengeTimer'
import ConditionsList  from '../components/active/ConditionsList'
import ConfirmComplete from '../components/active/ConfirmComplete'
import ConfirmFail     from '../components/active/ConfirmFail'
import ConfirmCancel   from '../components/active/ConfirmCancel'
import ChallengeNotes  from '../components/active/ChallengeNotes'
import Button          from '../components/ui/Button'

const BG_TINT = {
  green:  'transparent',
  yellow: 'rgba(255,149,0,0.04)',
  red:    'rgba(255,61,61,0.07)',
}

export default function Active() {
  const navigate          = useNavigate()
  const challenge         = useChallengeStore(s => s.challenges.find(c => c.id === s.activeId) ?? null)
  const completeChallenge = useChallengeStore(s => s.completeChallenge)
  const failChallenge     = useChallengeStore(s => s.failChallenge)
  const cancelChallenge   = useChallengeStore(s => s.cancelChallenge)

  const [confirmMode, setConfirmMode] = useState(null)
  const [failNote,    setFailNote]    = useState('')

  const time    = useCountdown(challenge?.deadline ?? new Date().toISOString())
  const urgency = challenge ? getUrgency(challenge.deadline, challenge.createdAt) : 'green'
  const color   = URGENCY_COLORS[urgency]

  useEffect(() => {
    if (time.expired && !confirmMode) setConfirmMode('expired')
  }, [time.expired]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!challenge) { navigate('/', { replace: true }); return null }

  const handleComplete = () => {
    const result = completeChallenge(challenge.id)
    navigate('/result', { state: { type: 'victory', result, challenge } })
  }

  const handleFail = () => {
    failChallenge(challenge.id, failNote)
    navigate('/result', { state: { type: 'failure' } })
  }

  const handleEdit = () => {
    // Pass current challenge data to Create for pre-filling
    navigate('/create', { state: { editChallenge: challenge } })
  }

  const handleCancel = () => {
    cancelChallenge(challenge.id)
    navigate('/', { replace: true })
  }

  const failBtnLabel = challenge.failureCondition
    ? `Признать: ${challenge.failureCondition.slice(0, 40)}${challenge.failureCondition.length > 40 ? '…' : ''}`
    : 'Признать поражение'

  const bgColor = confirmMode ? 'rgba(255,61,61,0.08)' : BG_TINT[urgency]

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col h-full px-5 py-6 gap-5"
      style={{ background: bgColor, transition: 'background 2s ease' }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="page-label">АКТИВНЫЙ ВЫЗОВ</span>
        <div className="flex gap-2 items-center">
          <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', border: `1px solid ${color}`, color }}>
            {challenge.difficulty.toUpperCase()}
          </span>
          <Button variant="ghost" onClick={() => setConfirmMode(m => m === 'menu' ? null : 'menu')} className="text-[18px] p-1 leading-none" title="Действия">⋯</Button>
        </div>
      </div>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 7vw, 2.4rem)', letterSpacing: '0.04em', lineHeight: 1.15, margin: 0 }}>
        {challenge.title}
      </h1>

      <ChallengeTimer time={time} color={color} />
      <ConditionsList challenge={challenge} />
      <ChallengeNotes challengeId={challenge.id} notes={challenge.notes ?? []} />
      <div className="flex-1" />

      <AnimatePresence mode="wait">
        {!confirmMode && (
          <motion.div key="actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col gap-3">
            <Button variant="ok" onClick={() => setConfirmMode('complete')}>✓ Я ВЫПОЛНИЛ!</Button>
            <button
              onClick={() => setConfirmMode('fail')}
              className="w-full rounded-2xl py-[14px] text-sm cursor-pointer text-accent"
              style={{ background: 'none', border: '1px solid #ff3d3d44' }}
            >
              {failBtnLabel}
            </button>
          </motion.div>
        )}
        {confirmMode === 'complete' && (
          <ConfirmComplete key="complete" onConfirm={handleComplete} onCancel={() => setConfirmMode(null)} />
        )}
        {(confirmMode === 'fail' || confirmMode === 'expired') && (
          <ConfirmFail key="fail" mode={confirmMode} failNote={failNote} setFailNote={setFailNote} onConfirm={handleFail} onCancel={() => setConfirmMode(null)} />
        )}
        {confirmMode === 'menu' && (
          <ConfirmCancel key="menu" onEdit={handleEdit} onCancel={handleCancel} onBack={() => setConfirmMode(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
