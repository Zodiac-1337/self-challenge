import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useShallow } from 'zustand/react/shallow'
import { useChallengeStore, computeLevel } from '../store/challengeStore'
import { pageVariants } from '../hooks/usePageTransition'
import StatTile   from '../components/ui/StatTile'
import Button     from '../components/ui/Button'
import StatsView  from '../components/history/StatsView'

const STATUS_META = {
  completed: { label: 'Победа',  emoji: '🏆', color: '#00c851' },
  failed:    { label: 'Провал',  emoji: '💀', color: '#ff3d3d' },
  active:    { label: 'Активен', emoji: '⚡', color: '#ff9500' },
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 py-2 text-sm font-medium rounded-lg transition-colors"
      style={{
        background:  active ? '#ff3d3d22' : 'none',
        color:       active ? 'var(--color-accent)' : 'var(--color-muted)',
        border:      active ? '1px solid #ff3d3d44' : '1px solid transparent',
        cursor:      'pointer',
      }}
    >
      {label}
    </button>
  )
}

export default function History() {
  const navigate        = useNavigate()
  const deleteChallenge = useChallengeStore(s => s.deleteChallenge)
  const exportData      = useChallengeStore(s => s.exportData)
  const streak          = useChallengeStore(s => s.streak)
  const bestStreak      = useChallengeStore(s => s.bestStreak ?? s.streak)
  const totalXP         = useChallengeStore(s => s.totalXP)
  const level           = useChallengeStore(s => computeLevel(s.streak))
  const history         = useChallengeStore(
    useShallow(s =>
      [...s.challenges]
        .filter(c => c.id !== s.activeId && c.status !== 'active')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    )
  )

  const [tab, setTab] = useState('list')

  const wins   = history.filter(c => c.status === 'completed').length
  const total  = history.length
  const winPct = total > 0 ? Math.round((wins / total) * 100) : 0

  const handleExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    Object.assign(document.createElement('a'), { href: url, download: 'self-challenge-backup.json' }).click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial" animate="animate" exit="exit"
      className="flex flex-col h-full overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex flex-col gap-3" style={{ borderBottom: '1px solid var(--color-line)' }}>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate('/')} className="text-[22px] p-0">←</Button>
          <h2 className="m-0 font-display text-[1.6rem] tracking-[0.04em]">ИСТОРИЯ</h2>
        </div>
        {/* Tabs */}
        <div className="flex gap-2">
          <Tab label="📋 Список"     active={tab === 'list'}  onClick={() => setTab('list')}  />
          <Tab label="📊 Статистика" active={tab === 'stats'} onClick={() => setTab('stats')} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        <AnimatePresence mode="wait" initial={false}>

          {tab === 'list' && (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }} className="flex flex-col gap-4">

              {/* Mini stats row */}
              <div className="grid grid-cols-4 gap-2">
                <StatTile label="Уровень" value={level.emoji} sub={level.label} />
                <StatTile label="XP"      value={totalXP}     sub="очков" />
                <StatTile label="Серия"   value={streak}       sub="побед"  color={streak >= 3 ? '#ff9500' : undefined} />
                <StatTile label="Успех"   value={`${winPct}%`} sub={`${wins}/${total}`} color={winPct >= 60 ? '#00c851' : '#ff3d3d'} />
              </div>

              {history.length === 0
                ? <p className="text-center text-sm py-10 m-0" style={{ color: 'var(--color-muted)' }}>
                    Ещё нет завершённых челленджей.<br />Начни первый!
                  </p>
                : history.map((c, i) => (
                    <HistoryCard key={c.id} challenge={c} index={i} onDelete={deleteChallenge} />
                  ))
              }

              <button onClick={handleExport}
                className="w-full border border-line rounded-xl py-3 text-[13px] cursor-pointer mt-2 bg-transparent"
                style={{ color: 'var(--color-muted)' }}>
                📦 Экспорт данных (JSON)
              </button>
            </motion.div>
          )}

          {tab === 'stats' && (
            <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}>
              <StatsView
                challenges={history}
                streak={streak}
                bestStreak={bestStreak}
                totalXP={totalXP}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function HistoryCard({ challenge: c, index, onDelete }) {
  const meta = STATUS_META[c.status] ?? STATUS_META.active
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex gap-3 items-start rounded-[14px] px-4 py-[14px]"
      style={{ background: 'var(--color-surface)', border: `1px solid ${meta.color}33` }}
    >
      <span className="text-[24px] leading-[1.2] shrink-0">{meta.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm mb-1 truncate">{c.title}</div>
        <div className="flex gap-[10px] text-[12px] flex-wrap" style={{ color: 'var(--color-muted)' }}>
          <span style={{ color: meta.color }}>{meta.label}</span>
          {c.xpEarned > 0 && <span>+{c.xpEarned} XP</span>}
          <span>{new Date(c.createdAt).toLocaleDateString('ru-RU')}</span>
        </div>
        {c.failureNote && (
          <div className="mt-[6px] text-[12px] italic leading-[1.5]" style={{ color: 'var(--color-muted)' }}>
            "{c.failureNote}"
          </div>
        )}
      </div>
      <button onClick={() => onDelete(c.id)}
        className="shrink-0 pl-1 bg-transparent border-none text-[18px] cursor-pointer leading-none"
        style={{ color: 'var(--color-line)' }}>×</button>
    </motion.div>
  )
}
