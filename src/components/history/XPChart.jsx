import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts'

function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '8px 12px', fontSize: '12px' }}>
      <p style={{ margin: '0 0 2px', color: '#666', fontSize: '11px' }}>{label}</p>
      <p style={{ margin: 0, color: '#ff9500' }}>Итого XP: {payload[0].value}</p>
    </div>
  )
}

export default function XPChart({ data }) {
  if (data.length < 2) return null

  return (
    <ResponsiveContainer width="100%" height={110}>
      <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#ff9500" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#ff9500" stopOpacity={0}    />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="label"
          tick={{ fill: '#666', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <Tooltip content={<DarkTooltip />} cursor={{ stroke: '#2a2a2a' }} />
        <Area
          type="monotone"
          dataKey="xp"
          stroke="#ff9500"
          strokeWidth={2}
          fill="url(#xpGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#ff9500', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
