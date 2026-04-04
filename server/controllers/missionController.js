import Mission from '../models/Mission.js'

export const getMissions = async (req, res, next) => {
  try {
    const missions = await Mission.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(missions)
  } catch (err) {
    next(err)
  }
}

export const createMission = async (req, res, next) => {
  try {
    const mission = await Mission.create({ ...req.body, userId: req.user.id })
    res.status(201).json(mission)
  } catch (err) {
    next(err)
  }
}

export const getMission = async (req, res, next) => {
  try {
    const mission = await Mission.findOne({ _id: req.params.id, userId: req.user.id })
    if (!mission) return res.status(404).json({ message: 'Mission not found' })
    res.json(mission)
  } catch (err) {
    next(err)
  }
}

export const deleteMission = async (req, res, next) => {
  try {
    await Mission.deleteOne({ _id: req.params.id, userId: req.user.id })
    res.json({ message: 'Deleted' })
  } catch (err) {
    next(err)
  }
}

export const updateMissionStatus = async (req, res, next) => {
  try {
    const mission = await Mission.findOne({ _id: req.params.id, userId: req.user.id })
    if (!mission) return res.status(404).json({ message: 'Mission not found' })
    mission.status = req.body.status
    await mission.save()
    res.json(mission)
  } catch (err) {
    next(err)
  }
}
