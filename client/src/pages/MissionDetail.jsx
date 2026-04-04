import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMission } from '../hooks/useMission'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { StatusDot } from '../components/ui/StatusDot'
import { Skeleton, SkeletonCard } from '../components/ui/Skeleton'
import { WeatherCard } from '../components/dashboard/WeatherCard'
import { RouteCard } from '../components/dashboard/RouteCard'
import { BudgetCard } from '../components/dashboard/BudgetCard'
import { ItineraryCard } from '../components/dashboard/ItineraryCard'
import { MapView } from '../components/dashboard/MapView'
import { OperationSummary } from '../components/dashboard/OperationSummary'
import {
  ArrowLeft, RefreshCw, Zap, CheckCircle, Loader2, XCircle, Printer,
  Save, Calendar, Users, MapPin, ArrowRight
} from 'lucide-react'

function AgentProgress({ steps }) {
  if (!steps || steps.length === 0) return null

  return (
    <div className="bg-card border border-border rounded-lg p-5 mb-6">
      <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-3">Agent Orchestration</p>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3 fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
            {step.status === 'done' && <CheckCircle className="w-4 h-4 text-success shrink-0" />}
            {step.status === 'loading' && <Loader2 className="w-4 h-4 text-blue-accent animate-spin shrink-0" />}
            {step.status === 'error' && <XCircle className="w-4 h-4 text-danger shrink-0" />}
            <span className={`text-[13px] ${step.status === 'done' ? 'text-success' : step.status === 'error' ? 'text-danger' : 'text-text-primary'}`}>
              {step.status === 'done' ? '✓' : step.status === 'loading' ? '⟳' : '✗'} {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MissionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const mapRef = useRef(null)
  const { currentMission, loading, planning, planSteps, fetchMission, planMissionAction } = useMission()

  useEffect(() => {
    fetchMission(id)
  }, [id, fetchMission])

  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading && !currentMission) {
    return (
      <PageWrapper title="Mission Detail">
        <div className="space-y-4">
          <Skeleton height="40px" width="300px" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (!currentMission) {
    return (
      <PageWrapper title="Mission Detail">
        <Card className="p-12 text-center">
          <p className="text-[16px] font-medium text-text-primary mb-2">Mission not found</p>
          <p className="text-[14px] text-muted mb-4">The requested mission could not be located.</p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Card>
      </PageWrapper>
    )
  }

  const mission = currentMission
  const hasResults = mission.result && mission.result.weather

  const riskVariant = mission.riskLevel === 'high' ? 'red' : mission.riskLevel === 'medium' ? 'amber' : 'green'
  const statusVariant = mission.status === 'active' ? 'amber' : mission.status === 'completed' ? 'green' : 'blue'

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <PageWrapper title="Mission Detail">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-[13px] text-muted hover:text-text-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </button>

      {/* Mission header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[28px] font-bold text-text-primary">{mission.title}</h1>
            <Badge variant={statusVariant}>{mission.status}</Badge>
            <Badge variant={riskVariant}>
              <StatusDot status={mission.riskLevel} />
              {mission.riskLevel} risk
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-[13px] text-muted">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {mission.origin}
              <ArrowRight className="w-3 h-3" />
              {mission.destination}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(mission.startDate)} – {formatDate(mission.endDate)}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {mission.teamSize} agents
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {hasResults && (
            <Button variant="secondary" size="sm" onClick={() => planMissionAction(mission._id)} disabled={planning}>
              <RefreshCw className={`w-3.5 h-3.5 ${planning ? 'animate-spin' : ''}`} />
              Re-plan
            </Button>
          )}
          {!hasResults && (
            <Button
              size="lg"
              onClick={() => planMissionAction(mission._id)}
              disabled={planning}
              className={!hasResults && !planning ? 'pulse-glow' : ''}
            >
              <Zap className="w-4 h-4" />
              {planning ? 'Coordinating agents...' : 'GENERATE PLAN'}
            </Button>
          )}
        </div>
      </div>

      {/* Agent progress */}
      {planSteps.length > 0 && <AgentProgress steps={planSteps} />}

      {/* Results grid */}
      {hasResults && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <WeatherCard weather={mission.result.weather} />
            <RouteCard route={mission.result.route} onViewMap={scrollToMap} />
            <BudgetCard budget={mission.result.budget} />
            <ItineraryCard itinerary={mission.result.itinerary} />
          </div>

          {/* Map */}
          <div ref={mapRef} className="mb-6">
            <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-3">Route Map</p>
            <MapView route={mission.result.route} />
          </div>

          {/* Operation summary */}
          <div className="mb-6">
            <OperationSummary mission={mission} />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={handlePrint}>
              <Printer className="w-4 h-4" />
              Print Brief
            </Button>
          </div>
        </>
      )}

      {/* No results placeholder */}
      {!hasResults && !planning && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {['Weather Forecast', 'Route Intelligence', 'Operational Budget', 'AI Mission Brief'].map((title, i) => (
            <Card key={i} className="border-2 border-dashed border-border">
              <CardContent className="p-8 text-center">
                <p className="text-[14px] text-muted">
                  {title} will appear here after generating the plan.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
