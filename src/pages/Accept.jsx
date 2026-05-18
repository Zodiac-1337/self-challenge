import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useChallengeStore } from '../store/challengeStore'
import { contractVariants } from '../hooks/usePageTransition'
import ContractCard from '../components/accept/ContractCard'
import Button from '../components/ui/Button'
import { subscribeChallenge } from '../hooks/usePushNotification'

export default function Accept() {
  const { state }       = useLocation()
  const navigate        = useNavigate()
  const createChallenge = useChallengeStore(s => s.createChallenge)
  const cancelChallenge = useChallengeStore(s => s.cancelChallenge)

  if (!state?.form) { navigate('/create', { replace: true }); return null }

  const { form, cancelId } = state

  const handleAccept = async () => {
    if (navigator.vibrate) navigator.vibrate([50, 30, 200])
    if (cancelId) cancelChallenge(cancelId)
    const id = createChallenge(form)
    // Подписка нефатальная — не блокируем навигацию
    await subscribeChallenge({ id, title: form.title, deadline: form.deadline })
    navigate('/active', { replace: true })
  }

  return (
    <motion.div
      variants={contractVariants}
      initial="initial" animate="animate" exit="exit"
      className="flex flex-col h-full px-5 py-6 gap-5"
      style={{ justifyContent: 'space-between' }}
    >
      {/* Штамп */}
      <div className="flex justify-center pt-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -12 }}
          animate={{ opacity: 1, scale: 1,   rotate: -6  }}
          transition={{ delay: 0.25, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="border-2 border-accent rounded-lg px-[14px] py-1 text-accent font-display text-base tracking-[0.2em] opacity-85"
        >
          {cancelId ? 'ОБНОВЛЁННЫЙ КОНТРАКТ' : 'ЛИЧНЫЙ КОНТРАКТ'}
        </motion.div>
      </div>

      <ContractCard form={form} />

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col gap-3"
      >
        <Button
          variant="primary"
          size="lg"
          ripple
          onClick={handleAccept}
          style={{ boxShadow: '0 0 32px rgba(255,61,61,0.25)' }}
        >
          {cancelId ? 'СОХРАНИТЬ' : 'ПРИНИМАЮ'}
        </Button>

        <Button variant="ghost" onClick={() => navigate(cancelId ? '/active' : '/create')}>
          Отменить
        </Button>
      </motion.div>
    </motion.div>
  )
}
