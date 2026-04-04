import { Card, CardHeader, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { StatusDot } from '../ui/StatusDot'
import { DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const BAR_COLORS = {
  Fuel: '#1A56DB',
  Hotels: '#D97706',
  Meals: '#16A34A',
  Misc: '#94A3B8',
}

export function BudgetCard({ budget }) {
  if (!budget) return null

  const chartData = Object.entries(budget.breakdown).map(([key, val]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: val
  }))

  const statusVariant = budget.budgetStatus === 'high' ? 'red' : budget.budgetStatus === 'medium' ? 'amber' : 'green'
  const statusLabel = budget.budgetStatus === 'high' ? 'High spend' : budget.budgetStatus === 'medium' ? 'Moderate' : 'Within budget'

  const totalColor = budget.budgetStatus === 'high' ? '#DC2626' : budget.budgetStatus === 'medium' ? '#D97706' : '#16A34A'

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-blue-accent" />
          <h3 className="text-[15px] font-semibold">Operational Budget</h3>
        </div>
        <Badge variant={statusVariant}>
          <StatusDot status={budget.budgetStatus} />
          {statusLabel}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">Total Cost</p>
          <p className="font-mono text-[28px] font-bold leading-none" style={{ color: totalColor }}>
            ${budget.total.toLocaleString()}
          </p>
        </div>

        {/* Bar chart */}
        <div className="h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
              <XAxis type="number" tickFormatter={v => `$${v}`} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#0D0D0D', fontWeight: 500 }} axisLine={false} tickLine={false} width={50} />
              <Tooltip
                formatter={(value) => [`$${value.toFixed(2)}`, '']}
                contentStyle={{ fontSize: 13, borderRadius: 6, border: '1px solid #E2E8F0' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={BAR_COLORS[entry.name] || '#94A3B8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border text-[13px]">
          <span className="text-muted">Per person ({budget.teamSize} agents, {budget.days} days)</span>
          <span className="font-mono font-semibold">${budget.perPerson.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
