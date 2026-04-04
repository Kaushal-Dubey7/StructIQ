import 'dotenv/config';
import { getWeatherForecast } from './services/weatherService.js';
import { getRoute } from './services/routeService.js';
import { generateItinerary } from './services/llmService.js';

async function test() {
  console.log("Testing Weather...");
  try {
    const weather = await getWeatherForecast('Seattle', '2026-05-01', '2026-05-03');
    console.log("Weather OK. Risk Level:", weather.riskLevel);
  } catch (e) {
    console.error("Weather Failed:", e.message);
  }

  console.log("\nTesting Route...");
  let route;
  try {
    route = await getRoute('Seattle', 'San Francisco', 'driving');
    console.log("Route OK. Distance:", route.distanceText);
  } catch (e) {
    console.error("Route Failed:", e.message);
  }

  console.log("\nTesting LLM...");
  try {
    const itinerary = await generateItinerary({
      origin: 'Seattle', destination: 'San Francisco',
      startDate: '2026-05-01', endDate: '2026-05-03',
      weather: { summary: [{ date: '2026-05-01', condition: 'Clear', minTemp: 10, maxTemp: 15 }] },
      route: { distanceText: '1300 km', durationText: '12 hours' },
      budget: { total: 1000 },
      teamSize: 4, travelMode: 'driving'
    });
    console.log("LLM Output preview:", itinerary.substring(0, 100));
  } catch (e) {
    console.error("LLM Failed:", e.message);
  }
}

test();
