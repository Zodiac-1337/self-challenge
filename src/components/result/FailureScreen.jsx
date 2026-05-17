import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '../ui/Button'
import Card   from '../ui/Card'

export default function FailureScreen({ navigate }) {
  useEffect(() => {
    if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 300])
  }, [])

  return (
    <motion.div
      className="flex flex-col items-center justify-between h-full px-6 py-10"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ background: 'radial-gradient(ellipse at 50% 30%, #ff3d3d14 0%, transparent 70%)' }}
    >
      <div />

      <div className="flex flex-col items-center gap-6 w-full">
        <motion.span
          animate={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-[80px] leading-none"
        >
          💀
        </motion.span>

        <div className="flex flex-col items-center gap-2">
          <h1 className="font-display text-accent m-0" style={{ fontSize: '3rem', letterSpacing: '0.06em' }}>
            ПРОВАЛ
          </h1>
          <p className="text-muted text-[15px] text-center m-0">
            Серия обнулена. Провал записан в историю.
          </p>
        </div>

        <Card className="px-5 py-4 text-center w-full max-w-[360px]" style={{ borderColor: '#ff3d3d33' }}>
          <p className="m-0 text-muted text-sm leading-[1.6]">
            Провал — это данные, не приговор. Следующий вызов делай с учётом того, где ты сломался.
          </p>
        </Card>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-[360px]">
        <Button variant="primary" onClick={() => navigate('/create')}>ПОПРОБОВАТЬ СНОВА</Button>
        <Button variant="ghost" onClick={() => navigate('/history')}>Посмотреть историю</Button>
      </div>
    </motion.div>
  )
}
