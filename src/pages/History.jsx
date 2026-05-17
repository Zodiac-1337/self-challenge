import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useShallow } from 'zustand/react/shallow'
import { useChallengeStore, computeLevel } from '../store/challengeStore'
import { pageVariants } from '../hooks/usePageTransition'
import StatTile from '../components/ui/StatTile'
import Button   from '../components/ui/Button'

const STATUS_META = {
  completed: { label: 'Победа',  emoji: '🏆', color: '#00c851' },
  failed:    { label: 'Провал',  emoji: '💀', color: '#ff3d3d' },
  active:    { label: 'Активен', emoji: '⚡', color: '#ff9500' },
}

export default function History() {
  const navigate        = useNavigate()
  const deleteChallenge = useChallengeStore(s => s.deleteChallenge)
  const exportData      = useChallengeStore(s => s.exportData)
  const streak          = useChallengeStore(s => s.streak)
  const totalXP         = useChallengeStore(s => s.totalXP)
  const level           = useChallengeStore(s => computeLevel(s.streak))

  // useShallow — стабильное сравнение массива, предотвращает бесконечный
  // цикл перерендеров в Zustand v5 + React 18 useSyncExternalStore
  const history = useChallengeStore(
    useShallow(s =>
      [...s.challenges]
        .filter(c => c.id !== s.activeId && c.status !== 'active')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    )
  )

  const wins   = history.filter(c => c.status === 'completed').length
  const total  = history.length
  const winPct = total > 0 ? Math.round((wins / total) * 100) : 0

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    Object.assign(document.createElement('a'), { href: url, download: 'self-challenge-backup.json' }).click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col h-full overflow-hidden"
    >
      <div className="px-5 pt-6 pb-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <Button variant="ghost" onClick={() => navigate("/")} className="text-[22px] p-0">←</Button>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.04em' }}>ИСТОРИЯ</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-2">
          <StatTile label="Уровень" value={level.emoji} sub={level.label} />
          <StatTile label="XP"      value={totalXP}     sub="очков" />
          <StatTile label="Серия"   value={streak}       sub="побед" color={streak >= 3 ? '#ff9500' : undefined} />
          <StatTile label="Успех"   value={`${winPct}%`} sub={`${wins}/${total}`} color={winPct >= 60 ? '#00c851' : '#ff3d3d'} />
        </div>

        {history.length === 0
          ? <p style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '40px', fontSize: '14px' }}>
              Ещё нет завершённых челленджей.<br />Начни первый!
            </p>
          : <div className="flex flex-col gap-3">
              {history.map((c, i) => (
                <HistoryCard key={c.id} challenge={c} index={i} onDelete={deleteChallenge} />
              ))}
            </div>
        }

        <button onClick={handleExport} className="w-full border border-line rounded-xl py-3 text-muted text-[13px] cursor-pointer mt-2 bg-transparent">📦 Экспорт данных (JSON)</button>
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
      style={{ background: 'var(--surface)', border: `1px solid ${meta.color}33`, borderRadius: '14px', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}
    >
      <span style={{ fontSize: '24px', lineHeight: 1.2, flexShrink: 0 }}>{meta.emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {c.title}
        </div>
        <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
          <span style={{ color: meta.color }}>{meta.label}</span>
          {c.xpEarned > 0 && <span>+{c.xpEarned} XP</span>}
          <span>{new Date(c.createdAt).toLocaleDateString('ru-RU')}</span>
        </div>
        {c.failureNote && (
          <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
            "{c.failureNote}"
          </div>
        )}
      </div>
      <button
        onClick={() => onDelete(c.id)}
        style={{ background: 'none', border: 'none', color: 'var(--border)', fontSize: '18px', cursor: 'pointer', flexShrink: 0, lineHeight: 1, paddingLeft: '4px' }}
      >
        ×
      </button>
    </motion.div>
  )
}
