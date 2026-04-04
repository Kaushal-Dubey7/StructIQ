export const estimateBudget = ({ distanceKm, teamSize, days, travelMode }) => {
  const FUEL_COST_PER_KM = 0.13
  const HOTEL_PER_NIGHT = 120
  const MEAL_PER_DAY_PER_PERSON = 45
  const TRANSIT_FLAT = 25

  const fuel = travelMode === 'driving'
    ? parseFloat((distanceKm * FUEL_COST_PER_KM * 2).toFixed(2))
    : TRANSIT_FLAT * teamSize

  const hotels = HOTEL_PER_NIGHT * Math.max(days - 1, 1) * Math.ceil(teamSize / 2)
  const meals = MEAL_PER_DAY_PER_PERSON * days * teamSize
  const misc = parseFloat((fuel * 0.1 + 50).toFixed(2))
  const total = parseFloat((fuel + hotels + meals + misc).toFixed(2))

  const status = total > 2000 ? 'high' : total > 800 ? 'medium' : 'low'

  return {
    breakdown: { fuel, hotels, meals, misc },
    total,
    currency: 'USD',
    budgetStatus: status,
    perPerson: parseFloat((total / teamSize).toFixed(2)),
    days,
    teamSize
  }
}
