'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function RevenueTrendChart({ data }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#0B1F3A1A" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#1A2740' }} />
          <YAxis tick={{ fontSize: 12, fill: '#1A2740' }} />
          <Tooltip
            formatter={(value) => [`KSh ${Number(value).toLocaleString()}`, 'Revenue']}
            contentStyle={{ fontSize: 12, borderRadius: 0, borderColor: '#0B1F3A33' }}
          />
          <Line type="monotone" dataKey="revenue" stroke="#0B1F3A" strokeWidth={2} dot={{ fill: '#C9A24B' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
