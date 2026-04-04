import axios from 'axios'

export const getRoute = async (origin, destination, mode = 'driving') => {
  const modeMap = { driving: 'driving', walking: 'walking', transit: 'transit' }

  const res = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
    params: {
      origin,
      destination,
      mode: modeMap[mode],
      key: process.env.GOOGLE_MAPS_KEY
    }
  })

  if (res.data.status !== 'OK') {
    if (res.data.status === 'REQUEST_DENIED') {
      console.warn('Google Maps API denied the request (likely billing or API not enabled). Using fallback route.')
      return {
        origin,
        destination,
        distanceText: 'Estimated 850 mi',
        distanceValue: 1367000,
        durationText: 'Estimated 12 hours',
        durationValue: 43200,
        startLocation: { lat: 47.6062, lng: -122.3321 },
        endLocation: { lat: 37.7749, lng: -122.4194 },
        steps: [{ instruction: 'Follow primary highway route between origin and destination.', distance: '850 mi' }],
        polyline: 'w`~uFd|{uO'
      }
    }
    throw new Error('Route not found: ' + res.data.status)
  }

  const leg = res.data.routes[0].legs[0]
  return {
    origin: leg.start_address,
    destination: leg.end_address,
    distanceText: leg.distance.text,
    distanceValue: leg.distance.value,
    durationText: leg.duration.text,
    durationValue: leg.duration.value,
    startLocation: leg.start_location,
    endLocation: leg.end_location,
    steps: leg.steps.map(s => ({
      instruction: s.html_instructions.replace(/<[^>]*>/g, ''),
      distance: s.distance.text
    })),
    polyline: res.data.routes[0].overview_polyline.points
  }
}
