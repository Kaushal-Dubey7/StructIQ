import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — dark */}
      <div className="hidden lg:flex lg:w-[60%] bg-gradient-to-br from-sidebar to-[#111827] flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-2 mb-16">
            <Shield className="w-6 h-6 text-blue-accent" />
            <span className="text-white font-bold text-[22px] tracking-tight font-mono">
              STRUCT<span className="text-blue-accent">IQ</span>
            </span>
          </div>

          <h1 className="text-white text-[38px] font-bold leading-tight mb-4">
            Mission Intelligence.<br />Unified.
          </h1>
          <p className="text-slate-400 text-[16px] max-w-md leading-relaxed mb-10">
            Plan multi-agent operations with real-time weather, routing, and AI-generated tactics.
          </p>

          <div className="space-y-4">
            {[
              'Real-time weather threat assessment',
              'Intelligent route & budget planning',
              'AI-generated tactical itineraries',
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-blue-accent text-[10px]">●</span>
                <span className="text-slate-300 text-[15px]">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-[13px]">
          StructIQ v1.0 — Tactical Operations Platform
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Shield className="w-5 h-5 text-blue-accent" />
            <span className="font-bold text-[20px] tracking-tight font-mono">
              STRUCT<span className="text-blue-accent">IQ</span>
            </span>
          </div>

          <h2 className="text-[20px] font-semibold text-text-primary mb-1">Sign in to StructIQ</h2>
          <p className="text-[14px] text-muted mb-8">Welcome back, Agent.</p>

          {error && (
            <div className="bg-danger-tint border border-danger/20 text-danger text-[13px] px-4 py-3 rounded-[6px] mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="agent@structiq.gov"
              icon={Mail}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                icon={Lock}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-muted hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-[14px] text-muted">New to StructIQ? </span>
            <Link to="/register" className="text-[14px] font-medium text-blue-accent hover:text-blue-hover transition-colors">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
