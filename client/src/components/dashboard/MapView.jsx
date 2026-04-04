import { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, useMap, LayerGroup, Circle, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Decode Google polyline
function decodePolyline(encoded) {
  const points = []
  let index = 0, lat = 0, lng = 0
  while (index < encoded.length) {
    let b, shift = 0, result = 0
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5 } while (b >= 0x20)
    lat += (result & 1) ? ~(result >> 1) : (result >> 1)
    shift = 0; result = 0
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5 } while (b >= 0x20)
    lng += (result & 1) ? ~(result >> 1) : (result >> 1)
    points.push([lat / 1e5, lng / 1e5])
  }
  return points
}

function FitBounds({ positions }) {
  const map = useMap()
  useEffect(() => {
    if (positions.length > 1) {
      map.fitBounds(positions, { padding: [40, 40] })
    }
  }, [map, positions])
  return null
}

function HeatmapLayer({ points, options }) {
  const map = useMap()
  useEffect(() => {
    if (!L.heatLayer) return
    const layer = L.heatLayer(points, options).addTo(map)
    return () => { map.removeLayer(layer) }
  }, [map, points, options])
  return null
}

export function MapView({ route, weather }) {
  const [heatLoaded, setHeatLoaded] = useState(!!L.heatLayer)
  const [layers, setLayers] = useState({ crime: false, crowd: false, weather: false })

  useEffect(() => {
    if (heatLoaded) return
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet.heat/dist/leaflet-heat.js'
    script.onload = () => setHeatLoaded(true)
    document.head.appendChild(script)
  }, [heatLoaded])

  if (!route) return null

  const startPos = route.startLocation ? [route.startLocation.lat, route.startLocation.lng] : null
  const endPos = route.endLocation ? [route.endLocation.lat, route.endLocation.lng] : null

  let polylinePositions = []
  if (route.polyline && route.polyline.length > 10) {
    try {
      polylinePositions = decodePolyline(route.polyline)
    } catch {
      polylinePositions = []
    }
  }

  const defaultCenter = startPos || [41.0, -83.0]
  const bounds = polylinePositions.length > 0 ? polylinePositions : [startPos, endPos].filter(Boolean)

  const crimeData = useMemo(() => {
    const getPos = () => {
      if (polylinePositions.length > 0) return polylinePositions[Math.floor(Math.random() * polylinePositions.length)]
      if (startPos && endPos) {
        const t = Math.random(); return [startPos[0] + (endPos[0]-startPos[0])*t, startPos[1] + (endPos[1]-startPos[1])*t]
      }
      return defaultCenter
    }
    return Array.from({length: 400}).map(() => {
      const base = getPos()
      return [
        base[0] + (Math.random() - 0.5) * 0.15,
        base[1] + (Math.random() - 0.5) * 0.15,
        Math.random() * 0.8
      ]
    })
  }, [route])

  const crowdData = useMemo(() => {
    const getPos = () => {
      if (polylinePositions.length > 0) return polylinePositions[Math.floor(Math.random() * polylinePositions.length)]
      if (startPos && endPos) {
        const t = Math.random(); return [startPos[0] + (endPos[0]-startPos[0])*t, startPos[1] + (endPos[1]-startPos[1])*t]
      }
      return defaultCenter
    }
    return Array.from({length: 500}).map(() => {
      const base = getPos()
      return [
        base[0] + (Math.random() - 0.5) * 0.2,
        base[1] + (Math.random() - 0.5) * 0.2,
        Math.random() * 0.5
      ]
    })
  }, [route])

  // Weather Severity Zones spanning the route
  const weatherZones = useMemo(() => {
    const risk = weather?.riskLevel || 'medium'
    const colorMap = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' }
    
    let w1 = defaultCenter, w2 = defaultCenter, w3 = defaultCenter
    if (polylinePositions.length > 0) {
      w1 = polylinePositions[Math.floor(polylinePositions.length * 0.2)]
      w2 = polylinePositions[Math.floor(polylinePositions.length * 0.5)]
      w3 = polylinePositions[Math.floor(polylinePositions.length * 0.8)]
    } else if (startPos && endPos) {
      w1 = [startPos[0] + (endPos[0]-startPos[0])*0.2, startPos[1] + (endPos[1]-startPos[1])*0.2]
      w2 = [startPos[0] + (endPos[0]-startPos[0])*0.5, startPos[1] + (endPos[1]-startPos[1])*0.5]
      w3 = [startPos[0] + (endPos[0]-startPos[0])*0.8, startPos[1] + (endPos[1]-startPos[1])*0.8]
    }
    
    return [
      { pos: [w1[0] + 0.05, w1[1] + 0.05], color: colorMap[risk] || '#f59e0b', radius: 15000, label: 'Primary Weather Cell' },
      { pos: [w2[0] - 0.03, w2[1] - 0.04], color: '#10b981', radius: 25000, label: 'Clear Zone' },
      { pos: [w3[0] + 0.02, w3[1] - 0.06], color: '#ef4444', radius: 18000, label: 'High Turbulence' }
    ]
  }, [route, weather])

  const toggleLayer = (key) => setLayers(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="rounded-lg overflow-hidden border border-border relative">
      <div className="absolute top-4 right-4 z-[400] bg-[#111827] border border-white/10 rounded pt-2 pb-3 px-3 shadow-xl backdrop-blur-md">
        <h4 className="text-[11px] font-bold text-white/50 mb-2 uppercase tracking-wider">Tactical Overlays</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[12px] text-white cursor-pointer hover:text-blue-accent transition-colors">
             <input type="checkbox" checked={layers.crime} onChange={() => toggleLayer('crime')} className="accent-red-500 cursor-pointer" />
             Crime Density
          </label>
          <label className="flex items-center gap-2 text-[12px] text-white cursor-pointer hover:text-blue-accent transition-colors">
             <input type="checkbox" checked={layers.crowd} onChange={() => toggleLayer('crowd')} className="accent-purple-500 cursor-pointer" />
             Crowd Accumulation
          </label>
          <label className="flex items-center gap-2 text-[12px] text-white cursor-pointer hover:text-blue-accent transition-colors">
             <input type="checkbox" checked={layers.weather} onChange={() => toggleLayer('weather')} className="accent-amber-500 cursor-pointer" />
             Weather Severity
          </label>
        </div>
      </div>

      <div className="absolute bottom-6 left-4 z-[400] bg-[#111827]/90 border border-white/10 rounded py-2 px-3 shadow-xl backdrop-blur-md pointer-events-none">
        <h4 className="text-[10px] font-bold text-white/50 mb-1.5 uppercase tracking-wider">Map Legend</h4>
        <div className="space-y-1.5 text-[11px] text-white/80">
          {!layers.crime && !layers.crowd && !layers.weather && <p className="text-white/40 italic">No overlays active.</p>}
          
          {layers.crime && (
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-red-400">Crime Heat</span>
              <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-blue-500 via-yellow-500 to-red-600" />
            </div>
          )}
          {layers.crowd && (
            <div className="flex flex-col gap-1 mt-1">
              <span className="font-semibold text-purple-400">Crowd Heat</span>
              <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-fuchsia-600" />
            </div>
          )}
          {layers.weather && (
            <div className="flex flex-col gap-1 mt-1">
              <span className="font-semibold text-amber-400">Weather Severity</span>
              <div className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-red-500 border border-white/20"/> High</div>
              <div className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-amber-500 border border-white/20"/> Moderate</div>
              <div className="flex gap-2 items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 border border-white/20"/> Low</div>
            </div>
          )}
        </div>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={9}
        className="h-[400px] w-full z-0 font-sans"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {startPos && <Marker position={startPos} icon={redIcon} />}
        {endPos && <Marker position={endPos} icon={blueIcon} />}

        {polylinePositions.length > 0 && (
          <Polyline
            positions={polylinePositions}
            pathOptions={{ color: '#1A56DB', weight: 4, opacity: 0.8 }}
          />
        )}

        {bounds.length > 1 && <FitBounds positions={bounds} />}

        <LayerGroup>
          {heatLoaded && layers.crime && (
            <HeatmapLayer 
              points={crimeData} 
              options={{ radius: 25, blur: 15, maxZoom: 14, gradient: { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' } }} 
            />
          )}
        </LayerGroup>

        <LayerGroup>
          {heatLoaded && layers.crowd && (
            <HeatmapLayer 
              points={crowdData} 
              options={{ radius: 20, blur: 12, maxZoom: 14, gradient: { 0.4: 'navy', 0.6: 'blue', 0.8: 'purple', 1.0: 'fuchsia' } }} 
            />
          )}
        </LayerGroup>

        <LayerGroup>
          {layers.weather && weatherZones.map((zone, idx) => (
            <Circle
              key={idx}
              center={zone.pos}
              radius={zone.radius}
              pathOptions={{ fillColor: zone.color, color: zone.color, fillOpacity: 0.35, weight: 1 }}
            >
              <Tooltip sticky>{zone.label}</Tooltip>
            </Circle>
          ))}
        </LayerGroup>
      </MapContainer>
    </div>
  )
}
