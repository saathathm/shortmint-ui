import { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Link2, TrendingUp, Wallet, Settings2, Menu, X, LogOut, HelpCircle } from 'lucide-react'
import AffiliateDashboard from './AffiliateDashboard.jsx'

const navItems = [
  { to: '/affiliate/dashboard', end: true, icon: LayoutDashboard, label: 'Overview' },
  { to: '/affiliate/dashboard/link', icon: Link2, label: 'My Link' },
  { to: '/affiliate/dashboard/earnings', icon: TrendingUp, label: 'Earnings' },
  { to: '/affiliate/dashboard/payouts', icon: Wallet, label: 'Payouts' },
  { to: '/affiliate/dashboard/settings', icon: Settings2, label: 'Settings' },
]

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
    isActive
      ? 'bg-primary/10 text-primary font-semibold'
      : 'text-text-muted hover:text-text-primary hover:bg-bg-surface'
  }`

function Sidebar({ onClose }) {
  const navigate = useNavigate()
  const affiliateName = localStorage.getItem('st_affiliate_name') || ''
  const affiliateEmail = localStorage.getItem('st_affiliate_email') || ''

  const handleLogout = () => {
    localStorage.removeItem('st_affiliate_token')
    localStorage.removeItem('st_affiliate_name')
    localStorage.removeItem('st_affiliate_email')
    navigate('/affiliate/login')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-text-primary">ShortTrim</span>
          <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">Affiliates</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-text-muted hover:text-text-primary lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Profile chip */}
      {(affiliateName || affiliateEmail) && (
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary">
                {(affiliateName || affiliateEmail).charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              {affiliateName && <p className="text-sm font-semibold text-text-primary truncate">{affiliateName}</p>}
              {affiliateEmail && <p className="text-xs text-text-muted truncate">{affiliateEmail}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ to, end, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={end} className={linkClass} onClick={onClose}>
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-border space-y-0.5">
        <a
          href="mailto:support@shorttrim.com"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:text-text-primary hover:bg-bg-surface transition-colors"
        >
          <HelpCircle size={17} />
          Help & support
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:text-text-primary hover:bg-bg-surface w-full transition-colors"
        >
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </div>
  )
}

export default function AffiliateLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bg-base flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-bg-card border-r border-border fixed top-0 left-0 h-full z-30">
        <Sidebar />
      </aside>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-bg-card border-r border-border z-50 transform transition-transform duration-200 lg:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setDrawerOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-bg-card sticky top-0 z-20">
          <button onClick={() => setDrawerOpen(true)} className="text-text-muted hover:text-text-primary">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-text-primary text-sm">ShortTrim</span>
            <span className="text-xs font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">Affiliates</span>
          </div>
          <div className="w-6" />
        </header>

        <main className="p-6 max-w-5xl mx-auto">
          <Routes>
            <Route index element={<AffiliateDashboard tab="overview" />} />
            <Route path="link" element={<AffiliateDashboard tab="link" />} />
            <Route path="earnings" element={<AffiliateDashboard tab="earnings" />} />
            <Route path="payouts" element={<AffiliateDashboard tab="payouts" />} />
            <Route path="settings" element={<AffiliateDashboard tab="settings" />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
