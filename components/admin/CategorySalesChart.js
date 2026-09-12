'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function CategorySalesChart({ data }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#0B1F3A1A" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#1A2740' }} />
          <YAxis tick={{ fontSize: 12, fill: '#1A2740' }} allowDecimals={false} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 0, borderColor: '#0B1F3A33' }} />
          <Bar dataKey="unitsSold" name="Units sold" fill="#C9A24B" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
