import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts'

function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '8px 12px', fontSize: '12px' }}>
      <p style={{ margin: '0 0 4px', color: '#666', fontSize: '11px' }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ margin: '2px 0', color: p.fill }}>
          {p.dataKey === 'wins' ? 'Победы' : 'Провалы'}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function ActivityChart({ data }) {
  const hasData = data.some(w => w.wins + w.fails > 0)
  if (!hasData) return null

  return (
    <ResponsiveContainer width="100%" height={130}>
      <BarChart data={data} barCategoryGap="35%" margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <XAxis
          dataKey="label"
          tick={{ fill: '#666', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval={1}
        />
        <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Bar dataKey="wins"  stackId="a" fill="#00c851" radius={[0, 0, 0, 0]} />
        <Bar dataKey="fails" stackId="a" fill="#ff3d3d" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
