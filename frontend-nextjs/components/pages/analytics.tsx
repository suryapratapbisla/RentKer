"use client"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const monthlyData = [
  { month: "Jan", revenue: 4000, bookings: 240 },
  { month: "Feb", revenue: 3000, bookings: 140 },
  { month: "Mar", revenue: 2000, bookings: 221 },
  { month: "Apr", revenue: 2780, bookings: 229 },
  { month: "May", revenue: 1890, bookings: 200 },
  { month: "Jun", revenue: 2390, bookings: 249 },
  { month: "Jul", revenue: 3490, bookings: 210 },
  { month: "Aug", revenue: 4200, bookings: 290 },
]

const vehicleTypeData = [
  { name: "Sedan", value: 45 },
  { name: "SUV", value: 25 },
  { name: "Luxury", value: 20 },
  { name: "Electric", value: 10 },
]

const COLORS = ["oklch(0.6 0.2 30)", "oklch(0.55 0.15 50)", "oklch(0.5 0.18 40)", "oklch(0.65 0.18 35)"]

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-primary uppercase tracking-widest font-mono">ANALYTICS COMMAND</h1>
        <p className="text-xs text-foreground/60 mt-1 font-mono tracking-wide">BUSINESS INTELLIGENCE & INSIGHTS</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="tactical-card p-6 shadow-md">
          <h2 className="tactical-title mb-6">Monthly Revenue & Bookings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
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
              <Legend wrapperStyle={{ color: "oklch(0.65 0.01 0)" }} />
              <Bar dataKey="revenue" fill="oklch(0.6 0.2 30)" />
              <Bar dataKey="bookings" fill="oklch(0.55 0.15 50)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="tactical-card p-6 shadow-md">
          <h2 className="tactical-title mb-6">Fleet Distribution by Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vehicleTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {vehicleTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.12 0.01 0)",
                  border: "1px solid oklch(0.6 0.2 30)",
                  borderRadius: "2px",
                  color: "oklch(0.95 0 0)",
                }}
                labelStyle={{ color: "oklch(0.6 0.2 30)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="tactical-card p-6 shadow-md">
        <h2 className="tactical-title mb-6">Revenue Trend Analysis</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlyData}>
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
            <Legend wrapperStyle={{ color: "oklch(0.65 0.01 0)" }} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="oklch(0.6 0.2 30)"
              strokeWidth={2}
              dot={{ fill: "oklch(0.6 0.2 30)", r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="oklch(0.55 0.15 50)"
              strokeWidth={2}
              dot={{ fill: "oklch(0.55 0.15 50)", r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
