import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { getWeeklyActivity, getXPProgression, getDifficultyStats, getAvgHours } from '../../utils/statsUtils'
import StatTile      from '../ui/StatTile'
import ActivityChart from './ActivityChart'
import XPChart       from './XPChart'

function Label({ children }) {
  return (
    <p className="m-0 mb-3 text-[11px] tracking-[0.1em]" style={{ color: 'var(--color-muted)' }}>
      {children}
    </p>
  )
}

function Section({ title, children }) {
  return (
    <div className="flex flex-col">
      <Label>{title}</Label>
      {children}
    </div>
  )
}

function DiffBar({ label, wins, total, color }) {
  const pct = total > 0 ? Math.round((wins / total) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-[12px] w-14" style={{ color: 'var(--color-muted)' }}>{label}</span>
      <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{ background: 'var(--color-line)' }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color, transition: 'width 0.5s ease' }} />
      </div>
      <span className="text-[12px] text-right" style={{ color: 'var(--color-muted)', minWidth: '64px' }}>
        {wins}/{total} · {pct}%
      </span>
    </div>
  )
}

export default function StatsView({ challenges, streak, bestStreak }) {
  const wins  = challenges.filter(c => c.status === 'completed').length
  const fails = challenges.filter(c => c.status === 'failed').length
  const total = wins + fails
  const early = challenges.filter(c => (c.savedHours ?? 0) > 0).length
  const avgH  = getAvgHours(challenges)

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <span className="text-[48px]">📊</span>
        <p className="text-sm text-center m-0" style={{ color: 'var(--color-muted)' }}>
          Статистика появится после<br />первого завершённого челленджа
        </p>
      </div>
    )
  }

  const winPct     = total > 0 ? Math.round(wins  / total * 100) : 0
  const failPct    = total > 0 ? Math.round(fails / total * 100) : 0
  const donut      = [{ value: wins, color: '#00c851' }, { value: fails, color: '#ff3d3d' }]
  const diffStats  = getDifficultyStats(challenges)
  const weeklyData = getWeeklyActivity(challenges)
  const xpData     = getXPProgression(challenges)

  return (
    <div className="flex flex-col gap-6">

      {/* Tiles */}
      <div className="grid grid-cols-4 gap-2">
        <StatTile label="Всего"  value={total}              sub="чел-жей" />
        <StatTile label="Побед"  value={wins}               sub="выполнено" color="#00c851" />
        <StatTile label="Провал" value={fails}              sub="провалено" color="#ff3d3d" />
        <StatTile label="Рекорд" value={bestStreak ?? streak} sub="серия"  color="#ff9500" />
      </div>

      {/* Win/Loss donut */}
      <Section title="РЕЗУЛЬТАТЫ">
        <div className="flex items-center gap-4">
          <div style={{ flexShrink: 0 }}>
            <ResponsiveContainer width={130} height={130}>
              <PieChart>
                <Pie data={donut} cx="50%" cy="50%" innerRadius={38} outerRadius={62}
                     startAngle={90} endAngle={450} dataKey="value" paddingAngle={3}>
                  {donut.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#00c851', flexShrink: 0 }} />
              <span className="text-sm">{wins} побед · {winPct}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff3d3d', flexShrink: 0 }} />
              <span className="text-sm">{fails} провала · {failPct}%</span>
            </div>
            {early > 0 && (
              <span className="text-[12px]" style={{ color: 'var(--color-muted)' }}>
                ⚡ {early} досрочно
              </span>
            )}
            {avgH != null && (
              <span className="text-[12px]" style={{ color: 'var(--color-muted)' }}>
                ⏱ среднее ~{avgH}ч
              </span>
            )}
          </div>
        </div>
      </Section>

      {/* Difficulty */}
      {diffStats.length > 0 && (
        <Section title="ПО СЛОЖНОСТИ">
          <div className="flex flex-col gap-3">
            {diffStats.map(d => <DiffBar key={d.label} {...d} />)}
          </div>
        </Section>
      )}

      {/* Activity */}
      <Section title="АКТИВНОСТЬ (8 НЕДЕЛЬ)">
        <ActivityChart data={weeklyData} />
      </Section>

      {/* XP */}
      {xpData.length >= 2 && (
        <Section title="ПРОГРЕСС XP">
          <XPChart data={xpData} />
        </Section>
      )}

    </div>
  )
}
