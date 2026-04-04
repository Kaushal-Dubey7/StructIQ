import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('structiq_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)
  const [isFirstLogin, setIsFirstLogin] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('structiq_token')
    if (token) {
      api.get('/auth/me')
        .then(res => {
          setUser(res.data)
          localStorage.setItem('structiq_user', JSON.stringify(res.data))
        })
        .catch(() => {
          localStorage.removeItem('structiq_token')
          localStorage.removeItem('structiq_user')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('structiq_token', res.data.token)
    localStorage.setItem('structiq_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data
  }

  const register = async (data) => {
    const res = await api.post('/auth/register', data)
    localStorage.setItem('structiq_token', res.data.token)
    localStorage.setItem('structiq_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    setIsFirstLogin(true)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('structiq_token')
    localStorage.removeItem('structiq_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isFirstLogin, setIsFirstLogin }}>
      {children}
    </AuthContext.Provider>
  )
}
