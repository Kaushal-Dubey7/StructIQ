import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY })

export const generateItinerary = async ({ origin, destination, startDate, endDate, weather, route, budget, teamSize, travelMode }) => {
  const weatherSummary = weather.summary
    .map(d => `${d.date}: ${d.condition}, ${d.minTemp}°C–${d.maxTemp}°C${d.alert ? ' ⚠ ALERT' : ''}`)
    .join('\n')

  const prompt = `You are a tactical mission planner for a law enforcement team.

MISSION PARAMETERS:
- Origin: ${origin}
- Destination: ${destination}
- Start Date: ${startDate}
- End Date: ${endDate}
- Team Size: ${teamSize} agents
- Travel Mode: ${travelMode}
- Distance: ${route.distanceText}, estimated ${route.durationText}
- Total Budget: $${budget.total} USD

WEATHER FORECAST:
${weatherSummary}

Generate a concise, professional day-by-day mission itinerary. Include:
- Departure time recommendations based on weather
- Rest stops and fuel stops for long routes
- Risk notes for bad weather days
- Operational tips for each day
- A final budget advisory

Format as a numbered day-by-day plan. Keep it tactical, professional, and actionable. No filler. No emojis.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 900,
      temperature: 0.6
    })
    return response.choices[0].message.content.trim()
  } catch (err) {
    console.warn('OpenAI API failed (likely billing/quota issue). Using fallback itinerary.', err.message)
    return `DAY 1 — DEPLOYMENT
0600: Team assembly and briefing.
0700: Depart from ${origin}.
1500: Arrive at ${destination} and secure operational base.

DAY 2 — OPERATIONS
0800: Begin tactical tracking and investigation.
1800: Debrief and file status report.

BUDGET ADVISORY
Total allocated: $${budget.total}. Ensure all receipts are logged with Command.`
  }
}
