import type { FunctionComponent } from 'react'

interface KPI {
  title: string
  value: string
  description: string
  icon: any
  color: string
  bgColor: string
}

const KPICards: FunctionComponent<{ items: KPI[] }> = ({ items }) => {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((kpi) => (
        <div key={kpi.title} className="rounded-xl bg-white text-card-foreground shadow-sm card-hover">
          <div className="flex items-center gap-4 p-5">
            <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${kpi.bgColor}`}>
              <kpi.icon className={`size-6 ${kpi.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">{kpi.title}</p>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default KPICards
