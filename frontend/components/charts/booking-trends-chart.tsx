"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { week: "W1", bookings: 240 },
  { week: "W2", bookings: 140 },
  { week: "W3", bookings: 221 },
  { week: "W4", bookings: 229 },
  { week: "W5", bookings: 200 },
  { week: "W6", bookings: 249 },
  { week: "W7", bookings: 210 },
  { week: "W8", bookings: 290 },
]

export default function BookingTrendsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.18 0.01 0)" />
        <XAxis dataKey="week" stroke="oklch(0.65 0.01 0)" fontSize={12} />
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
        <Bar dataKey="bookings" fill="oklch(0.6 0.2 30)" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
