import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Bell, Menu } from 'lucide-react'

export function TopBar({ title, onMenuClick }) {
  const { user } = useAuth()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AG'

  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden text-muted hover:text-text-primary"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-[18px] font-semibold text-text-primary">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <time className="text-[13px] text-muted font-mono tabular-nums hidden sm:block">
          {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          {' '}
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </time>

        <button className="relative text-muted hover:text-text-primary transition-colors">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-danger rounded-full" />
        </button>

        <div className="w-8 h-8 rounded-full bg-card border border-border text-[12px] font-bold text-text-primary flex items-center justify-center">
          {initials}
        </div>
      </div>
    </header>
  )
}
