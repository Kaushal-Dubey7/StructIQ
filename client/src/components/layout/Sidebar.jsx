import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, MapPinPlus, FolderOpen, Settings, LogOut, X, Shield
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/missions/new', label: 'New Mission', icon: MapPinPlus },
  { to: '/missions', label: 'Saved Missions', icon: FolderOpen },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AG'

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed top-0 left-0 h-screen w-[240px] bg-gradient-to-b from-sidebar to-[#111827] flex flex-col z-50 transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="px-5 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-accent" />
            <span className="text-white font-bold text-[18px] tracking-tight font-mono">
              STRUCT<span className="text-blue-accent">IQ</span>
            </span>
          </div>
          <button className="text-sidebar-text hover:text-white" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 mb-4">
          <span className="text-[11px] font-medium text-sidebar-text/50 tracking-wider">v1.0 — TACTICAL OPS</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-0.5">
          <p className="text-[11px] font-medium text-sidebar-text/50 uppercase tracking-wider px-3 mb-2">Navigation</p>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-[14px] font-medium rounded-none transition-all duration-150 ${
                  isActive
                    ? 'text-sidebar-active bg-white/5 border-l-[3px] border-blue-accent'
                    : 'text-sidebar-text hover:text-white hover:bg-white/5 border-l-[3px] border-transparent'
                }`
              }
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-accent/20 text-blue-accent flex items-center justify-center text-[12px] font-bold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-white truncate">{user?.name || 'Agent'}</p>
              <p className="text-[11px] text-sidebar-text truncate">{user?.badge || 'No badge'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-sidebar-text hover:text-danger transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
