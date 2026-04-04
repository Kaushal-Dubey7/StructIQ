import { Card, CardHeader, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { StatusDot } from '../ui/StatusDot'
import { Cloud, AlertTriangle } from 'lucide-react'

export function WeatherCard({ weather }) {
  if (!weather) return null

  const riskVariant = weather.riskLevel === 'high' ? 'red' : weather.riskLevel === 'medium' ? 'amber' : 'green'

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-blue-accent" />
          <h3 className="text-[15px] font-semibold">Weather Forecast</h3>
        </div>
        <Badge variant={riskVariant}>
          <StatusDot status={weather.riskLevel} />
          {weather.riskLevel} risk
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {weather.summary.map((day, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-5 py-3 text-[13px] ${
                day.alert ? 'bg-danger-tint border-l-[3px] border-danger' : i % 2 === 0 ? 'bg-white' : 'bg-card'
              }`}
            >
              <span className="font-medium w-24">{new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              <div className="flex items-center gap-2">
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.condition}
                  className="w-8 h-8"
                />
                <span className="text-muted w-24">{day.condition}</span>
              </div>
              <span className="font-mono text-[13px]">
                {day.minTemp}° – {day.maxTemp}°C
              </span>
              {day.alert && (
                <AlertTriangle className="w-4 h-4 text-danger" />
              )}
              {!day.alert && (
                <StatusDot status="low" />
              )}
            </div>
          ))}
        </div>
        <div className="px-5 py-2 text-[11px] text-muted border-t border-border">
          Source: OpenWeatherMap
        </div>
      </CardContent>
    </Card>
  )
}
