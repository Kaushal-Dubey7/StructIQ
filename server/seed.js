import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'
import Mission from './models/Mission.js'

dotenv.config()

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    // Clear existing data
    await User.deleteMany({})
    await Mission.deleteMany({})

    // Create demo user
    const user = await User.create({
      name: 'Agent Torres',
      email: 'torres@structiq.gov',
      password: 'Agent123!',
      badge: 'DTX-4471',
      department: 'Tactical Operations'
    })

    console.log('Demo user created:', user.email)

    const now = new Date()

    // Mission 1: Completed
    await Mission.create({
      userId: user._id,
      title: 'Operation Northfield',
      origin: 'Detroit, MI',
      destination: 'Cleveland, OH',
      startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      travelMode: 'driving',
      teamSize: 4,
      priority: 'routine',
      status: 'completed',
      riskLevel: 'low',
      result: {
        weather: {
          city: 'Cleveland',
          lat: 41.4993,
          lon: -81.6944,
          summary: [
            { date: '2026-03-28', minTemp: 8, maxTemp: 14, condition: 'Clear', icon: '01d', alert: false },
            { date: '2026-03-29', minTemp: 7, maxTemp: 13, condition: 'Clouds', icon: '03d', alert: false },
            { date: '2026-03-30', minTemp: 9, maxTemp: 15, condition: 'Clear', icon: '01d', alert: false }
          ],
          riskLevel: 'low'
        },
        route: {
          origin: 'Detroit, MI, USA',
          destination: 'Cleveland, OH, USA',
          distanceText: '170 mi',
          distanceValue: 273588,
          durationText: '2 hours 35 mins',
          durationValue: 9300,
          startLocation: { lat: 42.3314, lng: -83.0458 },
          endLocation: { lat: 41.4993, lng: -81.6944 },
          steps: [
            { instruction: 'Head east on Michigan Ave toward Shelby St', distance: '0.1 mi' },
            { instruction: 'Take I-75 S to I-80 E', distance: '85 mi' },
            { instruction: 'Continue on I-80 E/Ohio Turnpike to Cleveland', distance: '84 mi' }
          ],
          polyline: 'wnzmDtjvnN...'
        },
        budget: {
          breakdown: { fuel: 71.13, hotels: 240, meals: 540, misc: 57.11 },
          total: 908.24,
          currency: 'USD',
          budgetStatus: 'medium',
          perPerson: 227.06,
          days: 3,
          teamSize: 4
        },
        itinerary: 'DAY 1 — DEPLOYMENT\n0600: Team assembly at Detroit Field Office. Vehicle inspection and comms check.\n0630: Depart Detroit via I-75 S to I-80 E. Weather: Clear, 14°C. Optimal conditions.\n0900: Arrive Cleveland. Check into operational base.\n1000-1700: Field operations.\n1800: Debrief at base. Secure equipment.\n\nDAY 2 — OPERATIONS\n0700: Morning briefing.\n0800-1600: Continue field operations. Weather: Partly cloudy, 13°C.\n1700: Progress review and situation assessment.\n\nDAY 3 — EXTRACTION\n0700: Final sweep and evidence collection.\n1000: Depart Cleveland via I-80 W.\n1230: Arrive Detroit. Debrief and file reports.\n\nBUDGET NOTE: Total operational cost $908.24. Per-agent allocation: $227.06. Within standard parameters.'
      }
    })

    // Mission 2: Active with weather alert
    await Mission.create({
      userId: user._id,
      title: 'Operation Stormwatch',
      origin: 'Chicago, IL',
      destination: 'Milwaukee, WI',
      startDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      travelMode: 'driving',
      teamSize: 2,
      priority: 'urgent',
      status: 'active',
      riskLevel: 'high',
      result: {
        weather: {
          city: 'Milwaukee',
          lat: 43.0389,
          lon: -87.9065,
          summary: [
            { date: '2026-04-05', minTemp: 2, maxTemp: 6, condition: 'Thunderstorm', icon: '11d', alert: true },
            { date: '2026-04-06', minTemp: 0, maxTemp: 4, condition: 'Snow', icon: '13d', alert: true }
          ],
          riskLevel: 'high'
        },
        route: {
          origin: 'Chicago, IL, USA',
          destination: 'Milwaukee, WI, USA',
          distanceText: '92 mi',
          distanceValue: 148060,
          durationText: '1 hour 32 mins',
          durationValue: 5520,
          startLocation: { lat: 41.8781, lng: -87.6298 },
          endLocation: { lat: 43.0389, lng: -87.9065 },
          steps: [
            { instruction: 'Head north on I-90/I-94 W', distance: '12 mi' },
            { instruction: 'Continue on I-94 W toward Milwaukee', distance: '78 mi' },
            { instruction: 'Exit toward downtown Milwaukee', distance: '2 mi' }
          ],
          polyline: 'w`~uFd|{uO...'
        },
        budget: {
          breakdown: { fuel: 38.50, hotels: 120, meals: 180, misc: 53.85 },
          total: 392.35,
          currency: 'USD',
          budgetStatus: 'low',
          perPerson: 196.18,
          days: 2,
          teamSize: 2
        },
        itinerary: 'DAY 1 — DEPLOYMENT UNDER ADVERSE CONDITIONS\n** WEATHER ALERT: Thunderstorm activity expected. Exercise extreme caution. **\n0500: Early departure recommended to avoid peak storm activity.\n0500: Depart Chicago via I-94 W. Monitor weather radio on Channel 7.\n0640: Arrive Milwaukee. Secure vehicles in covered parking.\n0700-1200: Indoor operations only. Lightning risk.\n1400: Reassess weather conditions for afternoon field work.\n1800: Return to base. Double-check equipment for water damage.\n\nDAY 2 — OPERATIONS WITH SNOW ADVISORY\n** WEATHER ALERT: Snow expected. 0°C to 4°C. Icy roads possible. **\n0700: Delayed start. Road condition assessment required.\n0800: Begin operations with winter protocols.\n1400: Wrap-up. Begin return preparations.\n1500: Depart Milwaukee. Reduced speed on I-94 E.\n1700: Arrive Chicago.\n\nBUDGET NOTE: Total cost $392.35. Well within allocation. Consider additional cold-weather gear procurement ($50-80).'
      }
    })

    // Mission 3: Planning
    await Mission.create({
      userId: user._id,
      title: 'Operation Duskfall',
      origin: 'New York, NY',
      destination: 'Philadelphia, PA',
      startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
      travelMode: 'driving',
      teamSize: 6,
      priority: 'critical',
      status: 'planning',
      riskLevel: 'medium',
      result: null
    })

    console.log('3 sample missions created')
    console.log('\nDemo credentials:')
    console.log('Email: torres@structiq.gov')
    console.log('Password: Agent123!')

    process.exit(0)
  } catch (err) {
    console.error('Seed error:', err)
    process.exit(1)
  }
}

seedData()
