import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { getMissions, createMission, getMission, deleteMission, updateMissionStatus } from '../controllers/missionController.js'

const router = express.Router()

router.use(protect)

router.get('/', getMissions)
router.post('/', createMission)
router.get('/:id', getMission)
router.delete('/:id', deleteMission)
router.patch('/:id/status', updateMissionStatus)

export default router
