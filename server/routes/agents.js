import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { planMission } from '../controllers/agentController.js'

const router = express.Router()

router.post('/plan/:missionId', protect, planMission)

export default router
