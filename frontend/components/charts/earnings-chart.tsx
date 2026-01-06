"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", earnings: 4000 },
  { month: "Feb", earnings: 3000 },
  { month: "Mar", earnings: 2000 },
  { month: "Apr", earnings: 2780 },
  { month: "May", earnings: 1890 },
  { month: "Jun", earnings: 2390 },
  { month: "Jul", earnings: 3490 },
  { month: "Aug", earnings: 4200 },
  { month: "Sep", earnings: 3800 },
  { month: "Oct", earnings: 4500 },
  { month: "Nov", earnings: 5200 },
  { month: "Dec", earnings: 6100 },
]

export default function EarningsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.18 0.01 0)" />
        <XAxis dataKey="month" stroke="oklch(0.65 0.01 0)" fontSize={12} />
        <YAxis stroke="oklch(0.65 0.01 0)" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "oklch(0.12 0.01 0)",
            border: "1px solid oklch(0.6 0.2 30)",
            borderRadius: "2px",
            color: "oklch(0.95 0 0)",
          }}
          labelStyle={{ color: "oklch(0.6 0.2 30)" }}
        />
        <Line
          type="monotone"
          dataKey="earnings"
          stroke="oklch(0.6 0.2 30)"
          strokeWidth={3}
          dot={{ fill: "oklch(0.6 0.2 30)", r: 5 }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
