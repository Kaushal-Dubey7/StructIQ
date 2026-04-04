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
    console.warn('OpenAI API failed (likely billing/quota issue). Using dynamic fallback itinerary.', err.message)
    
    // Build a dynamic itinerary based on inputs
    const start = new Date(startDate)
    const end = new Date(endDate)
    const totalDays = Math.max(Math.ceil((end - start) / (1000 * 60 * 60 * 24)), 1)
    
    const lines = []
    
    // DAY 1: Deployment
    lines.push(`DAY 1 — DEPLOYMENT`)
    if (weather.summary && weather.summary.length > 0) {
      lines.push(`0500: Weather Intel: ${weather.summary[0].condition}, with temps ranging ${weather.summary[0].minTemp}°C to ${weather.summary[0].maxTemp}°C.`)
    }
    lines.push(`0600: Assembly of ${teamSize} agents for mission briefing.`)
    lines.push(`0700: Depart from ${origin} via ${travelMode}.`)
    
    if (totalDays > 1) {
      lines.push(`1800: Secure overnight location en route or upon initial arrival.`)
      lines.push('')
      
      // Middle days
      for (let i = 2; i < totalDays; i++) {
        lines.push(`DAY ${i} — TACTICAL OPERATIONS`)
        lines.push(`0800: Reconnaissance phase. Ensure all ${teamSize} agents maintain radio silence.`)
        lines.push(`1400: Execute objective tracking across local sectors.`)
        lines.push(`1900: Evening debrief and risk assessment.`)
        lines.push('')
      }
      
      // Final day
      lines.push(`DAY ${totalDays} — SECURE & EXTRACT`)
    }
    
    lines.push(`1000: Finalize intelligence gathering at ${destination}.`)
    lines.push(`1500: Conclude operation and initialize reporting protocol.`)
    lines.push(`1800: Stand down.${totalDays > 1 ? ' Return transit preparation.' : ''}`)
    lines.push('')
    lines.push(`BUDGET & LOGISTICS ADVISORY`)
    lines.push(`Total Distance: ${route.distanceText || 'Unknown'}. Estimated Transit Time: ${route.durationText || 'Unknown'}.`)
    lines.push(`Total Allocated Funds: $${budget.total} USD (Status: ${budget.budgetStatus === 'high' ? 'CRITICAL - strictly monitor spending' : 'NOMINAL'}).`)
    lines.push(`Ensure all ${teamSize} personnel log expense receipts with Command at mission end.`)
    
    return lines.join('\n')
  }
}
