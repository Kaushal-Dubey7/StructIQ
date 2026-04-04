import 'dotenv/config'
import mongoose from 'mongoose'
import { getWeatherForecast } from './services/weatherService.js'
import { getRoute } from './services/routeService.js'
import { generateItinerary } from './services/llmService.js'

async function runTests() {
  console.log('--- STRUCTIQ EXT API TEST RUNNER ---')
  console.log(`OpenWeather Key config: ${process.env.OPENWEATHER_KEY ? '✔ Loaded' : '✖ Missing'}`)
  console.log(`Google Maps Key config: ${process.env.GOOGLE_MAPS_KEY ? '✔ Loaded' : '✖ Missing'}`)
  console.log(`OpenAI Key config: ${process.env.OPENAI_KEY ? '✔ Loaded' : '✖ Missing'}`)
  console.log('------------------------------------')

  const origin = 'Seattle, WA'
  const destination = 'Portland, OR'

  try {
    console.log('[1/3] Testing OpenWeatherMap API...')
    // We get lat/lon for Seattle for the test
    const weather = await getWeatherForecast(origin, new Date().toISOString(), new Date(Date.now() + 86400000).toISOString())
    console.log(`   ✔ Success! Retrieved ${weather.summary.length} days of forecast.`)
    console.log(`   Sample condition: ${weather.summary[0].condition}`)

    console.log('[2/3] Testing Google Maps API...')
    const route = await getRoute(origin, destination, 'driving')
    console.log(`   ✔ Success! Calculated distance: ${route.distanceText}, duration: ${route.durationText}`)

    console.log('[3/3] Testing OpenAI API (GPT-3.5-turbo)...')
    const budgetMock = { total: 1000 }
    const itinerary = await generateItinerary({
      origin,
      destination,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      weather,
      route,
      budget: budgetMock,
      teamSize: 4,
      travelMode: 'driving'
    })
    console.log(`   ✔ Success! Generated itinerary of length: ${itinerary.length} chars.`)
    
    console.log('------------------------------------')
    console.log('🎉 ALL APIs WORKING PERFECTLY!')
  } catch (error) {
    console.error(`\n❌ API TEST FAILED: ${error.message}`)
    console.error(error)
  }
}

runTests()
