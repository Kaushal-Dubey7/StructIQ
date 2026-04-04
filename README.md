# StructIQ — AI-Powered Mission Planning Dashboard

A full-stack MERN application for law enforcement mission planning, integrating weather forecasting, route planning, budget estimation, and AI-generated tactical itineraries.

## Tech Stack

- **Frontend:** React 18 (Vite), Tailwind CSS, React Router, Leaflet.js, Recharts
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Auth:** JWT (jsonwebtoken + bcryptjs)
- **External APIs:** OpenWeatherMap, Google Maps Directions, OpenAI GPT-3.5

## Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- API keys for:
  - [OpenWeatherMap](https://openweathermap.org/api) (free tier)
  - [Google Maps Directions API](https://developers.google.com/maps/documentation/directions)
  - [OpenAI API](https://platform.openai.com/api-keys)

## Setup

### 1. Clone the repository
```bash
git clone <repo-url>
cd StructIQ
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file (see `.env.example`):
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/structiq
JWT_SECRET=your_super_secret_key_here
OPENWEATHER_KEY=your_openweather_api_key
GOOGLE_MAPS_KEY=your_google_maps_api_key
OPENAI_KEY=your_openai_api_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd client
npm install
```

### 4. Seed Demo Data (optional)
```bash
cd server
npm run seed
```

Demo credentials: `torres@structiq.gov` / `Agent123!`

### 5. Run Locally
```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:5000`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/missions` | List user missions |
| POST | `/api/missions` | Create mission |
| GET | `/api/missions/:id` | Get single mission |
| DELETE | `/api/missions/:id` | Delete mission |
| POST | `/api/agents/plan/:missionId` | Trigger full agent orchestration |

## Deployment

- **Frontend:** Vercel — connect client directory
- **Backend:** Render — connect server directory
- **Database:** MongoDB Atlas

Set `CLIENT_URL` in backend env to your Vercel URL for production CORS.

## License

MIT
