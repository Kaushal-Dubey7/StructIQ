import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import NewMission from './pages/NewMission'
import MissionDetail from './pages/MissionDetail'
import SavedMissions from './pages/SavedMissions'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-[13px] text-muted font-medium">Loading StructIQ...</p>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/missions/new" element={<ProtectedRoute><NewMission /></ProtectedRoute>} />
      <Route path="/missions/:id" element={<ProtectedRoute><MissionDetail /></ProtectedRoute>} />
      <Route path="/missions" element={<ProtectedRoute><SavedMissions /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><div className="min-h-screen flex items-center justify-center text-muted">Settings — Coming soon</div></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
