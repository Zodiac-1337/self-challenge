import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TOTAL_STEPS } from '../constants/challenges'
import { pageVariants } from '../hooks/usePageTransition'
import ProgressBar     from '../components/ui/ProgressBar'
import Button         from '../components/ui/Button'
import Step1Title      from '../components/create/Step1Title'
import Step2Deadline   from '../components/create/Step2Deadline'
import Step3Conditions from '../components/create/Step3Conditions'
import Step4Preview    from '../components/create/Step4Preview'

const slideVariants = {
  enter:  dir => ({ x: dir > 0 ?  60 : -60, opacity: 0 }),
  center:           { x: 0, opacity: 1 },
  exit:   dir => ({ x: dir > 0 ? -60 :  60, opacity: 0 }),
}

const INITIAL_FORM = {
  title: '', description: '', deadline: '',
  difficulty: 'medium', failureCondition: '', reward: '', stake: '',
}

const STEPS = [Step1Title, Step2Deadline, Step3Conditions, Step4Preview]

export default function Create() {
  const navigate   = useNavigate()
  const { state }  = useLocation()

  // Предзаполнение формы при редактировании активного челленджа
  const editChallenge = state?.editChallenge ?? null
  const initialForm   = editChallenge
    ? {
        title:            editChallenge.title,
        description:      editChallenge.description,
        // Конвертируем ISO в формат datetime-local
        deadline:         editChallenge.deadline?.slice(0, 16) ?? '',
        difficulty:       editChallenge.difficulty,
        failureCondition: editChallenge.failureCondition,
        reward:           editChallenge.reward,
        stake:            editChallenge.stake,
      }
    : INITIAL_FORM

  const [step, setStep] = useState(1)
  const [dir,  setDir]  = useState(1)
  const [form, setForm] = useState(initialForm)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const canProceed = step === 1
    ? form.title.trim().length >= 3
    : step === 2 ? form.deadline !== '' : true

  const go = next => { setDir(next > step ? 1 : -1); setStep(next) }

  const handleBack = () => {
    if (step > 1) return go(step - 1)
    // При редактировании — назад на Active, иначе на Home
    navigate(editChallenge ? '/active' : '/')
  }

  const handleToAccept = () =>
    navigate('/accept', {
      state: {
        form,
        // Передаём id для отмены старого при сохранении нового
        cancelId: editChallenge?.id ?? null,
      },
    })

  const StepComponent = STEPS[step - 1]

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col h-full px-5 pt-6 pb-8 gap-5"
    >
      {/* Шапка с прогрессбаром */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleBack} className="text-[22px] p-0">←</Button>
        <ProgressBar step={step} />
        <span style={{ color: 'var(--text-muted)', fontSize: '13px', whiteSpace: 'nowrap' }}>
          {step}/{TOTAL_STEPS}
        </span>
      </div>

      {editChallenge && (
        <div style={{ background: 'var(--surface)', border: '1px solid #ff950055', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', color: '#ff9500' }}>
          ✏️ Редактирование — старый вызов заменится новым
        </div>
      )}

      {/* Шаги */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute inset-0 flex flex-col gap-6 overflow-y-auto"
          >
            <StepComponent form={form} set={set} />
          </motion.div>
        </AnimatePresence>
      </div>

      <Button
        variant="primary"
        disabled={!canProceed}
        onClick={() => step < TOTAL_STEPS ? go(step + 1) : handleToAccept()}
      >
        {step < TOTAL_STEPS ? 'ДАЛЕЕ →' : editChallenge ? 'СОХРАНИТЬ ИЗМЕНЕНИЯ →' : 'ПРОДОЛЖИТЬ →'}
      </Button>
    </motion.div>
  )
}
