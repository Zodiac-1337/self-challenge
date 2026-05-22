import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../ui/Button'
import Input  from '../ui/Input'

export default function AuthModal({ onClose, signIn }) {
  const [email,  setEmail]  = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | sent | error
  const [errMsg, setErrMsg] = useState('')

  const handleSubmit = async () => {
    if (!email.trim() || !email.includes('@')) {
      setErrMsg('Введите корректный email')
      return setStatus('error')
    }
    setStatus('loading')
    setErrMsg('')
    const { error } = await signIn(email.trim())
    if (error) { setErrMsg(error.message); setStatus('error') }
    else        { setStatus('sent') }
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '16px' }}
      >
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          exit={{    y: 60, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 260 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-[480px] rounded-2xl p-6 flex flex-col gap-5"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line)' }}
        >
          {status === 'sent' ? (
            <div className="flex flex-col gap-4 items-center text-center">
              <span className="text-[52px]">📬</span>
              <div>
                <h3 className="font-display text-[1.4rem] tracking-[0.04em] m-0">Проверь почту!</h3>
                <p className="text-muted text-sm mt-2 m-0">
                  Ссылка для входа отправлена на<br />
                  <span style={{ color: 'var(--color-fg)' }}>{email}</span>
                </p>
              </div>
              <Button variant="ghost" onClick={onClose}>Закрыть</Button>
            </div>
          ) : (
            <>
              <div>
                <h3 className="font-display text-[1.4rem] tracking-[0.04em] m-0">
                  Синхронизация
                </h3>
                <p className="text-muted text-sm mt-1 m-0">
                  Войди через email — данные синхронизируются между устройствами автоматически
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="твой@email.com"
                  autoFocus
                />
                {status === 'error' && (
                  <p className="text-[12px] m-0" style={{ color: 'var(--color-accent)' }}>
                    {errMsg}
                  </p>
                )}
              </div>

              <Button variant="primary" onClick={handleSubmit} disabled={status === 'loading'}>
                {status === 'loading'
                  ? <><span className="animate-spin inline-block mr-2">⟳</span>Отправляю...</>
                  : '📧 Отправить ссылку'}
              </Button>

              <Button variant="ghost" onClick={onClose} className="text-center">Отмена</Button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}
