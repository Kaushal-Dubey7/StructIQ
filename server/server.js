import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import missionRoutes from './routes/missions.js'
import agentRoutes from './routes/agents.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL?.trim(), credentials: true }))
app.use(express.json())
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }))

app.use('/api/auth', authRoutes)
app.use('/api/missions', missionRoutes)
app.use('/api/agents', agentRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use(errorHandler)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    )
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  })
