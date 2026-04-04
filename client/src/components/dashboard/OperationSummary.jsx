import { StatusDot } from '../ui/StatusDot'
import { Route, Clock, Users, DollarSign, AlertTriangle } from 'lucide-react'

export function OperationSummary({ mission }) {
  if (!mission?.result) return null

  const { route, budget } = mission.result

  const stats = [
    { label: 'Distance', value: route?.distanceText || '—', icon: Route },
    { label: 'Duration', value: route?.durationText || '—', icon: Clock },
    { label: 'Team', value: `${mission.teamSize} agents`, icon: Users },
    { label: 'Budget', value: budget ? `$${budget.total.toLocaleString()}` : '—', icon: DollarSign },
    { label: 'Risk Level', value: mission.riskLevel, icon: AlertTriangle, isDot: true },
  ]

  return (
    <div className="bg-sidebar rounded-lg p-6">
      <p className="text-[11px] font-semibold text-sidebar-text uppercase tracking-widest mb-4">Mission Summary</p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
        {stats.map((stat, i) => (
          <div key={i}>
            <div className="flex items-center gap-1.5 mb-1">
              <stat.icon className="w-3.5 h-3.5 text-sidebar-text" />
              <p className="text-[11px] text-sidebar-text uppercase tracking-wider">{stat.label}</p>
            </div>
            {stat.isDot ? (
              <div className="flex items-center gap-2">
                <StatusDot status={stat.value} />
                <span className="text-white font-semibold text-[15px] capitalize">{stat.value}</span>
              </div>
            ) : (
              <p className="text-white font-mono font-semibold text-[15px]">{stat.value}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
