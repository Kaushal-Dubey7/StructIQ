import { Card, CardHeader, CardContent } from '../ui/Card'
import { MapPin, ArrowRight, Navigation } from 'lucide-react'

export function RouteCard({ route, onViewMap }) {
  if (!route) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-blue-accent" />
          <h3 className="text-[15px] font-semibold">Route Intelligence</h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Distance & Duration */}
        <div className="flex gap-6">
          <div>
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">Distance</p>
            <p className="font-mono text-[28px] font-bold text-blue-accent leading-none">{route.distanceText}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-1">Duration</p>
            <p className="font-mono text-[20px] font-semibold text-text-primary leading-none mt-1">{route.durationText}</p>
          </div>
        </div>

        {/* Origin to Destination */}
        <div className="flex items-center gap-3 py-3 border-t border-b border-border">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-2.5 h-2.5 rounded-full bg-danger shrink-0" />
            <span className="text-[13px] truncate">{route.origin}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-muted shrink-0" />
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-accent shrink-0" />
            <span className="text-[13px] truncate">{route.destination}</span>
          </div>
        </div>

        {/* Steps */}
        {route.steps && route.steps.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">Key Directions</p>
            {route.steps.slice(0, 3).map((step, i) => (
              <div key={i} className="flex items-start gap-2 text-[13px]">
                <span className="text-muted font-mono text-[11px] mt-0.5 min-w-[20px]">{i + 1}.</span>
                <span className="text-text-primary flex-1">{step.instruction}</span>
                <span className="text-muted font-mono text-[12px] shrink-0">{step.distance}</span>
              </div>
            ))}
          </div>
        )}

        {onViewMap && (
          <button
            onClick={onViewMap}
            className="text-[13px] font-medium text-blue-accent hover:text-blue-hover transition-colors"
          >
            View full route on map ↓
          </button>
        )}
      </CardContent>
    </Card>
  )
}
