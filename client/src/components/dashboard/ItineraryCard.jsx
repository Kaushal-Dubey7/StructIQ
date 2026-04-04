import { Card, CardHeader, CardContent } from '../ui/Card'
import { Cpu } from 'lucide-react'

export function ItineraryCard({ itinerary }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-accent" />
          <h3 className="text-[15px] font-semibold">AI Mission Brief</h3>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {itinerary ? (
          <div className="bg-sidebar text-white p-5 border-l-[3px] border-blue-accent m-0 rounded-b-lg">
            <pre className="font-mono text-[13px] leading-relaxed whitespace-pre-wrap text-slate-300">
              {itinerary}
            </pre>
          </div>
        ) : (
          <div className="p-8 text-center border-2 border-dashed border-border rounded-b-lg m-4 mt-0">
            <Cpu className="w-8 h-8 text-muted mx-auto mb-3" />
            <p className="text-[14px] text-muted">
              Click <span className="font-semibold text-text-primary">GENERATE PLAN</span> to produce tactical itinerary
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
