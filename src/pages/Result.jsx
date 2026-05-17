import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useChallengeStore } from '../store/challengeStore'
import { fadeVariants } from '../hooks/usePageTransition'
import VictoryScreen from '../components/result/VictoryScreen'
import FailureScreen from '../components/result/FailureScreen'

export default function Result() {
  const { state } = useLocation()
  const navigate  = useNavigate()
  const streak    = useChallengeStore(s => s.streak)
  const totalXP   = useChallengeStore(s => s.totalXP)

  if (!state) { navigate('/', { replace: true }); return null }

  return (
    <motion.div
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ height: '100%' }}
    >
      {state.type === 'victory'
        ? <VictoryScreen
            result={state.result ?? {}}
            challenge={state.challenge ?? {}}
            streak={streak}
            totalXP={totalXP}
            navigate={navigate}
          />
        : <FailureScreen navigate={navigate} />
      }
    </motion.div>
  )
}
