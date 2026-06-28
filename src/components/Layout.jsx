import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAuth } from '../hooks/useAuth.js'
import { signOut } from '../store/authSlice.js'
import { Home, Clock, Settings, LogOut, Scissors } from 'lucide-react'

export default function Layout({ children }) {
  const { isAuthenticated, client } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await dispatch(signOut())
    navigate('/login')
  }

  const navLinks = [
    { to: '/dashboard', label: 'Create', icon: Home },
    { to: '/history', label: 'History', icon: Clock },
    { to: '/settings', label: 'Settings', icon: Settings },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Top nav */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Scissors size={14} className="text-white" />
            </div>
            <span className="font-bold text-text-primary text-lg tracking-tight">ShortMint</span>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive(to)
                      ? 'bg-bg-secondary text-primary'
                      : 'text-text-muted hover:text-text-primary hover:bg-bg-surface'
                  }`}
                >
                  <Icon size={15} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              ))}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-text-muted hover:text-error hover:bg-red-50 transition-all ml-2"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
              <Link to="/signup" className="btn-primary text-sm py-2 px-4">Get started</Link>
            </div>
          )}
        </div>
      </header>

      {/* Usage bar for authenticated users with active plan */}
      {isAuthenticated && client && client.usage_hours_limit > 0 && (
        <div className="bg-bg-surface border-b border-border">
          <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
            <span className="text-xs text-text-muted">
              {parseFloat(client.usage_hours_used).toFixed(1)} of {client.usage_hours_limit} hours used this month
            </span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min((client.usage_hours_used / client.usage_hours_limit) * 100, 100)}%` }}
                />
              </div>
              <span className="text-xs font-medium text-text-muted capitalize">{client.plan}</span>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
