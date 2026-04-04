import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useMission } from '../hooks/useMission'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { StatusDot } from '../components/ui/StatusDot'
import { SkeletonTable } from '../components/ui/Skeleton'
import {
  Crosshair, Activity, AlertTriangle, CheckCircle, Eye, Trash2, Plus, Folder
} from 'lucide-react'

export default function Dashboard() {
  const { user, isFirstLogin, setIsFirstLogin } = useAuth()
  const { missions, loading, fetchMissions, deleteMission } = useMission()
  const navigate = useNavigate()

  useEffect(() => {
    fetchMissions()
  }, [fetchMissions])

  const stats = [
    {
      label: 'Total Missions',
      value: missions.length,
      icon: Crosshair,
      color: 'border-l-blue-accent',
      iconColor: 'text-blue-accent',
    },
    {
      label: 'Active Operations',
      value: missions.filter(m => m.status === 'active').length,
      icon: Activity,
      color: 'border-l-warning',
      iconColor: 'text-warning',
    },
    {
      label: 'High Risk Alerts',
      value: missions.filter(m => m.riskLevel === 'high').length,
      icon: AlertTriangle,
      color: 'border-l-danger',
      iconColor: 'text-danger',
    },
    {
      label: 'Completed',
      value: missions.filter(m => m.status === 'completed').length,
      icon: CheckCircle,
      color: 'border-l-success',
      iconColor: 'text-success',
    },
  ]

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <PageWrapper title="Command Overview">
      {/* Welcome banner for first login */}
      {isFirstLogin && (
        <div className="bg-blue-tint border border-blue-accent/20 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-[15px] font-semibold text-text-primary">
              Welcome to StructIQ, Agent {user?.name?.split(' ')[0] || 'Agent'}.
            </p>
            <p className="text-[13px] text-muted">Plan your first mission to get started.</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => navigate('/missions/new')}>
              <Plus className="w-3.5 h-3.5" />
              Plan New Mission
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsFirstLogin(false)}>
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className={`border-l-[3px] ${stat.color} p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-[28px] font-bold text-text-primary font-mono leading-none">{stat.value}</p>
              </div>
              <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Recent missions table */}
      <div>
        <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-4">Recent Operations</p>

        {loading ? (
          <Card><SkeletonTable rows={4} /></Card>
        ) : missions.length === 0 ? (
          <Card className="p-12 text-center">
            <Folder className="w-10 h-10 text-muted/40 mx-auto mb-3" />
            <p className="text-[16px] font-medium text-text-primary mb-1">No missions yet</p>
            <p className="text-[14px] text-muted mb-4">Plan your first operation.</p>
            <Button onClick={() => navigate('/missions/new')}>
              <Plus className="w-4 h-4" />
              New Mission
            </Button>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-[11px] font-semibold text-muted uppercase tracking-wider px-5 py-3">Mission</th>
                    <th className="text-left text-[11px] font-semibold text-muted uppercase tracking-wider px-5 py-3">Destination</th>
                    <th className="text-left text-[11px] font-semibold text-muted uppercase tracking-wider px-5 py-3">Dates</th>
                    <th className="text-left text-[11px] font-semibold text-muted uppercase tracking-wider px-5 py-3">Risk</th>
                    <th className="text-left text-[11px] font-semibold text-muted uppercase tracking-wider px-5 py-3">Status</th>
                    <th className="text-right text-[11px] font-semibold text-muted uppercase tracking-wider px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {missions.slice(0, 10).map((mission, i) => (
                    <tr key={mission._id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-card'} hover:bg-blue-tint/50 transition-colors`}>
                      <td className="px-5 py-3">
                        <p className="text-[14px] font-medium text-text-primary">{mission.title}</p>
                      </td>
                      <td className="px-5 py-3 text-[13px] text-muted">{mission.destination}</td>
                      <td className="px-5 py-3 text-[13px] text-muted font-mono">
                        {formatDate(mission.startDate)} – {formatDate(mission.endDate)}
                      </td>
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-1.5 text-[13px]">
                          <StatusDot status={mission.riskLevel} />
                          <span className="capitalize">{mission.riskLevel}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={mission.status === 'active' ? 'amber' : mission.status === 'completed' ? 'green' : 'blue'}>
                          {mission.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => navigate(`/missions/${mission._id}`)}>
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </Button>
                          <Button size="sm" variant="ghost-danger" onClick={() => deleteMission(mission._id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </PageWrapper>
  )
}
