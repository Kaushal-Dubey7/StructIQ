import { useState, useCallback } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

export function useMission() {
  const [missions, setMissions] = useState([])
  const [currentMission, setCurrentMission] = useState(null)
  const [loading, setLoading] = useState(false)
  const [planning, setPlanning] = useState(false)
  const [planSteps, setPlanSteps] = useState([])

  const fetchMissions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/missions')
      setMissions(res.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch missions')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchMission = useCallback(async (id) => {
    setLoading(true)
    try {
      const res = await api.get(`/missions/${id}`)
      setCurrentMission(res.data)
      return res.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Mission not found')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createMission = useCallback(async (data) => {
    try {
      const res = await api.post('/missions', data)
      toast.success('Mission created successfully')
      return res.data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create mission')
      return null
    }
  }, [])

  const deleteMission = useCallback(async (id) => {
    try {
      await api.delete(`/missions/${id}`)
      setMissions(prev => prev.filter(m => m._id !== id))
      toast.success('Mission deleted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete mission')
    }
  }, [])

  const planMissionAction = useCallback(async (missionId) => {
    setPlanning(true)
    setPlanSteps([])

    const steps = [
      { label: 'Fetching weather data...', delay: 800 },
      { label: 'Calculating route...', delay: 600 },
      { label: 'Estimating budget...', delay: 400 },
      { label: 'Generating AI tactical brief...', delay: 0 }
    ]

    // Animate steps
    for (let i = 0; i < steps.length - 1; i++) {
      setPlanSteps(prev => [...prev, { label: steps[i].label, status: 'loading' }])
      await new Promise(r => setTimeout(r, steps[i].delay))
      setPlanSteps(prev =>
        prev.map((s, idx) => idx === i ? { ...s, status: 'done' } : s)
      )
    }

    // Last step stays loading while API call happens
    setPlanSteps(prev => [...prev, { label: steps[3].label, status: 'loading' }])

    try {
      const res = await api.post(`/agents/plan/${missionId}`)
      setPlanSteps(prev =>
        prev.map((s, idx) => idx === 3 ? { ...s, status: 'done' } : s)
      )
      setCurrentMission(res.data.mission)
      toast.success('Mission plan generated successfully')
      return res.data.mission
    } catch (err) {
      setPlanSteps(prev =>
        prev.map((s, idx) => idx === 3 ? { ...s, status: 'error' } : s)
      )
      toast.error(err.response?.data?.message || 'Planning failed. Check API keys.')
      return null
    } finally {
      setPlanning(false)
    }
  }, [])

  return {
    missions, currentMission, loading, planning, planSteps,
    fetchMissions, fetchMission, createMission, deleteMission, planMissionAction,
    setCurrentMission
  }
}
