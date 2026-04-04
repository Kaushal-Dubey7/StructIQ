import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMission } from '../hooks/useMission'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { StatusDot } from '../components/ui/StatusDot'
import { SkeletonCard } from '../components/ui/Skeleton'
import { Input } from '../components/ui/Input'
import {
  Search, Eye, Trash2, Plus, Folder, MapPin, ArrowRight,
  Calendar, Users
} from 'lucide-react'

const tabs = [
  { value: 'all', label: 'All' },
  { value: 'planning', label: 'Planning' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

export default function SavedMissions() {
  const { missions, loading, fetchMissions, deleteMission } = useMission()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    fetchMissions()
  }, [fetchMissions])

  const filtered = missions.filter(m => {
    const matchesSearch = !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.destination.toLowerCase().includes(search.toLowerCase()) ||
      m.origin.toLowerCase().includes(search.toLowerCase())
    const matchesTab = activeTab === 'all' || m.status === activeTab
    return matchesSearch && matchesTab
  })

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const riskVariant = (level) => level === 'high' ? 'red' : level === 'medium' ? 'amber' : 'green'
  const statusVariant = (status) => status === 'active' ? 'amber' : status === 'completed' ? 'green' : 'blue'

  return (
    <PageWrapper title="Saved Missions">
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search by title, origin, or destination..."
            icon={Search}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex border border-border rounded-[6px] overflow-hidden">
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 text-[13px] font-medium transition-all duration-150 ${
                activeTab === tab.value
                  ? 'bg-blue-accent text-white'
                  : 'bg-white text-muted hover:bg-card'
              }`}
            >
              {tab.label}
              {tab.value !== 'all' && (
                <span className="ml-1.5 text-[11px] opacity-70">
                  {missions.filter(m => m.status === tab.value).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mission cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Folder className="w-10 h-10 text-muted/40 mx-auto mb-3" />
          <p className="text-[16px] font-medium text-text-primary mb-1">
            {search || activeTab !== 'all' ? 'No missions match your filters' : 'No missions yet'}
          </p>
          <p className="text-[14px] text-muted mb-4">
            {search || activeTab !== 'all' ? 'Try adjusting your search or filter.' : 'Plan your first operation.'}
          </p>
          {!search && activeTab === 'all' && (
            <Button onClick={() => navigate('/missions/new')}>
              <Plus className="w-4 h-4" />
              New Mission
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(mission => (
            <Card key={mission._id} hover className="flex flex-col">
              <CardContent className="flex-1">
                {/* Title & badges */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-[15px] font-semibold text-text-primary leading-snug">{mission.title}</h3>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <Badge variant={riskVariant(mission.riskLevel)}>
                      <StatusDot status={mission.riskLevel} />
                      {mission.riskLevel}
                    </Badge>
                  </div>
                </div>

                {/* Route info */}
                <div className="flex items-center gap-2 text-[13px] text-muted mb-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{mission.origin}</span>
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  <span className="truncate">{mission.destination}</span>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-2 text-[13px] text-muted mb-2">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-mono">{formatDate(mission.startDate)} – {formatDate(mission.endDate)}</span>
                </div>

                {/* Team */}
                <div className="flex items-center gap-2 text-[13px] text-muted mb-3">
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span>{mission.teamSize} agents</span>
                </div>

                {/* Status */}
                <Badge variant={statusVariant(mission.status)}>{mission.status}</Badge>
              </CardContent>

              {/* Actions */}
              <div className="px-5 py-3 border-t border-border flex items-center justify-between">
                <Button size="sm" variant="ghost" onClick={() => navigate(`/missions/${mission._id}`)}>
                  <Eye className="w-3.5 h-3.5" />
                  View
                </Button>
                <Button size="sm" variant="ghost-danger" onClick={() => deleteMission(mission._id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
