"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Toyota Camry", bookings: 45, revenue: 3600 },
  { name: "Honda Civic", bookings: 38, revenue: 2850 },
  { name: "BMW 3 Series", bookings: 32, revenue: 4800 },
  { name: "Tesla Model 3", bookings: 29, revenue: 5220 },
  { name: "Audi A4", bookings: 25, revenue: 4000 },
  { name: "Mercedes C-Class", bookings: 22, revenue: 4840 },
]

export default function TopVehiclesChart() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 150, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.18 0.01 0)" />
        <XAxis type="number" stroke="oklch(0.65 0.01 0)" fontSize={12} />
        <YAxis dataKey="name" type="category" stroke="oklch(0.65 0.01 0)" width={140} fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "oklch(0.12 0.01 0)",
            border: "1px solid oklch(0.6 0.2 30)",
            borderRadius: "2px",
            color: "oklch(0.95 0 0)",
          }}
          labelStyle={{ color: "oklch(0.6 0.2 30)" }}
        />
        <Legend wrapperStyle={{ color: "oklch(0.65 0.01 0)" }} />
        <Bar dataKey="bookings" fill="oklch(0.6 0.2 30)" />
        <Bar dataKey="revenue" fill="oklch(0.55 0.15 50)" />
      </BarChart>
    </ResponsiveContainer>
  )
}
