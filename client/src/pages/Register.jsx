import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { User, Mail, Lock, Shield, BadgeCheck, Building } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', badge: '', department: '', email: '', password: '', confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    if (!form.password) errs.password = 'Password is required'
    if (form.password.length < 6) errs.password = 'Minimum 6 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return
    setLoading(true)
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        badge: form.badge,
        department: form.department
      })
      toast.success('Account created successfully')
      navigate('/dashboard')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[60%] bg-gradient-to-br from-sidebar to-[#0f172a] flex-col justify-between p-12 lg:px-20 lg:pt-20">
        <div>
          <div className="flex items-center gap-2 mb-20">
            <Shield className="w-6 h-6 text-blue-accent" />
            <span className="text-white font-bold text-[22px] tracking-tight font-mono">
              STRUCT<span className="text-blue-accent">IQ</span>
            </span>
          </div>
          <h1 className="text-white text-[38px] font-bold leading-tight mb-6">
            Join the<br />Operations Network.
          </h1>
          <p className="text-slate-400 text-[16px] max-w-md leading-relaxed">
            Register your credentials to access the StructIQ tactical planning platform.
          </p>
        </div>
        <p className="text-slate-600 text-[13px]">StructIQ v1.0 — Tactical Operations Platform</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-950 p-8 sm:p-12">
        <div className="w-full max-w-[380px]">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <Shield className="w-5 h-5 text-blue-accent" />
            <span className="text-white font-bold text-[20px] tracking-tight font-mono">
              STRUCT<span className="text-blue-accent">IQ</span>
            </span>
          </div>

          <h2 className="text-[24px] font-semibold text-white mb-2">Create Account</h2>
          <p className="text-[14px] text-slate-400 mb-8">Register as a new agent.</p>

          {serverError && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-400 text-[13px] px-4 py-3 rounded-[6px] mb-6">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 [&_label]:text-slate-300">
            <Input label="Full Name" placeholder="Agent Torres" icon={User} value={form.name} onChange={e => handleChange('name', e.target.value)} error={errors.name} className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500" />
            <Input label="Badge ID" placeholder="DTX-4471" icon={BadgeCheck} value={form.badge} onChange={e => handleChange('badge', e.target.value)} className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500" />
            <Input label="Department" placeholder="Tactical Operations" icon={Building} value={form.department} onChange={e => handleChange('department', e.target.value)} className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500" />
            <Input label="Email" type="email" placeholder="agent@structiq.gov" icon={Mail} value={form.email} onChange={e => handleChange('email', e.target.value)} error={errors.email} className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500" />
            <Input label="Password" type="password" placeholder="Min 6 characters" icon={Lock} value={form.password} onChange={e => handleChange('password', e.target.value)} error={errors.password} className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500" />
            <Input label="Confirm Password" type="password" placeholder="Confirm password" icon={Lock} value={form.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)} error={errors.confirmPassword} className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500" />

            <div className="pt-4">
              <Button type="submit" className="w-full shadow-lg shadow-blue-accent/20" size="lg" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-slate-800 pt-6">
            <span className="text-[14px] text-slate-400">Already registered? </span>
            <Link to="/login" className="text-[14px] font-medium text-blue-accent hover:text-blue-400 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
