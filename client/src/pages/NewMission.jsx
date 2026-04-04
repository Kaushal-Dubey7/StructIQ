import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMission } from '../hooks/useMission'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Card, CardContent } from '../components/ui/Card'
import { MissionForm } from '../components/dashboard/MissionForm'
import { ArrowRight, MapPin, Calendar, Users } from 'lucide-react'

export default function NewMission() {
  const { createMission } = useMission()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)

  const handleSubmit = async (form) => {
    setLoading(true)
    const mission = await createMission(form)
    setLoading(false)
    if (mission) {
      navigate(`/missions/${mission._id}`)
    }
  }

  return (
    <PageWrapper title="New Mission">
      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
        {/* Form */}
        <Card>
          <CardContent>
            <MissionForm onSubmit={handleSubmit} loading={loading} />
          </CardContent>
        </Card>

        {/* Live preview */}
        <div>
          <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-3">Live Preview</p>

          <Card className="border-2 border-dashed border-border">
            <CardContent className="p-8 text-center">
              <div className="max-w-sm mx-auto">
                <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-5 h-5 text-muted" />
                </div>
                <p className="text-[15px] font-medium text-text-primary mb-1">Mission Preview</p>
                <p className="text-[13px] text-muted mb-6">
                  Fill in the mission parameters on the left to see a preview of your operation.
                </p>

                <div className="bg-card rounded-lg p-4 text-left space-y-3">
                  <div className="flex items-center gap-2 text-[13px]">
                    <MapPin className="w-4 h-4 text-muted" />
                    <span className="text-muted">Origin</span>
                    <ArrowRight className="w-3 h-3 text-muted" />
                    <span className="text-muted">Destination</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px]">
                    <Calendar className="w-4 h-4 text-muted" />
                    <span className="text-muted">Select dates</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px]">
                    <Users className="w-4 h-4 text-muted" />
                    <span className="text-muted">Team size</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info tip for first-time users */}
          <div className="mt-4 bg-blue-tint border border-blue-accent/10 rounded-lg p-4">
            <p className="text-[13px] text-blue-accent font-medium">
              Enter your origin, destination, and dates. StructIQ handles the rest.
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
