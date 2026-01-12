interface MetricCardProps {
  title: string
  value: string
  icon: string
  trend: number
  bgColor: string
}

export default function MetricCard({ title, value, icon, trend, bgColor }: MetricCardProps) {
  const isPositive = trend >= 0

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground font-medium uppercase">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            {isPositive ? (
              <>
                <span className="text-xs font-semibold text-primary">+{trend}%</span>
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </>
            ) : (
              <>
                <span className="text-xs font-semibold text-destructive">{trend}%</span>
                <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                </svg>
              </>
            )}
          </div>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  )
}
