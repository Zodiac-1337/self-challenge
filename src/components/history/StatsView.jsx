import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { getWeeklyActivity, getXPProgression, getDifficultyStats, getAvgHours } from '../../utils/statsUtils'
import StatTile      from '../ui/StatTile'
import DiffBar       from './DiffBar'
import ActivityChart from './ActivityChart'
import XPChart       from './XPChart'

const Section = ({ title, children }) => (
  <div className="flex flex-col">
    <p className="m-0 mb-3 text-[11px] tracking-[0.1em]" style={{ color: 'var(--color-muted)' }}>{title}</p>
    {children}
  </div>
)

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

  const winPct     = Math.round(wins  / total * 100)
  const failPct    = Math.round(fails / total * 100)
  const donut      = [{ value: wins, color: '#00c851' }, { value: fails, color: '#ff3d3d' }]
  const diffStats  = getDifficultyStats(challenges).filter(d => d.total > 0)
  const weeklyData = getWeeklyActivity(challenges)
  const xpData     = getXPProgression(challenges)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-4 gap-2">
        <StatTile label="Всего"  value={total}              sub="чел-жей" />
        <StatTile label="Побед"  value={wins}               sub="выполнено" color="#00c851" />
        <StatTile label="Провал" value={fails}              sub="провалено" color="#ff3d3d" />
        <StatTile label="Рекорд" value={bestStreak ?? streak} sub="серия"  color="#ff9500" />
      </div>

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
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#00c851' }} />
              <span className="text-sm">{wins} побед · {winPct}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#ff3d3d' }} />
              <span className="text-sm">{fails} провала · {failPct}%</span>
            </div>
            {early > 0 && <span className="text-[12px]" style={{ color: 'var(--color-muted)' }}>⚡ {early} досрочно</span>}
            {avgH  != null && <span className="text-[12px]" style={{ color: 'var(--color-muted)' }}>⏱ среднее ~{avgH}ч</span>}
          </div>
        </div>
      </Section>

      {diffStats.length > 0 && (
        <Section title="ПО СЛОЖНОСТИ">
          <div className="flex flex-col gap-3">
            {diffStats.map(d => <DiffBar key={d.label} {...d} />)}
          </div>
        </Section>
      )}

      <Section title="АКТИВНОСТЬ (8 НЕДЕЛЬ)">
        <ActivityChart data={weeklyData} />
      </Section>

      {xpData.length >= 2 && (
        <Section title="ПРОГРЕСС XP">
          <XPChart data={xpData} />
        </Section>
      )}
    </div>
  )
}
