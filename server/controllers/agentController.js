import { getWeatherForecast } from '../services/weatherService.js'
import { getRoute } from '../services/routeService.js'
import { estimateBudget } from '../services/budgetService.js'
import { generateItinerary } from '../services/llmService.js'
import Mission from '../models/Mission.js'

export const planMission = async (req, res, next) => {
  try {
    const { missionId } = req.params
    const mission = await Mission.findOne({ _id: missionId, userId: req.user.id })
    if (!mission) return res.status(404).json({ message: 'Mission not found' })

    const { origin, destination, startDate, endDate, travelMode, teamSize } = mission

    const [weather, route] = await Promise.all([
      getWeatherForecast(destination, startDate, endDate),
      getRoute(origin, destination, travelMode)
    ])

    const days = Math.max(
      Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)),
      1
    )
    const distanceKm = Math.round(route.distanceValue / 1000)
    const budget = estimateBudget({ distanceKm, teamSize, days, travelMode })

    const itinerary = await generateItinerary({
      origin, destination, startDate, endDate,
      weather, route, budget, teamSize, travelMode
    })

    const riskLevel = weather.riskLevel === 'high' || budget.budgetStatus === 'high'
      ? 'high'
      : weather.riskLevel === 'medium' || budget.budgetStatus === 'medium'
        ? 'medium' : 'low'

    mission.result = { weather, route, budget, itinerary }
    mission.riskLevel = riskLevel
    mission.status = 'active'
    await mission.save()

    res.json({ success: true, mission })
  } catch (err) {
    next(err)
  }
}
