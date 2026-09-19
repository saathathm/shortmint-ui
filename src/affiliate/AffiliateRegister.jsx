import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader, CheckCircle } from 'lucide-react'

const API = import.meta.env.VITE_API_BASE_URL

const benefits = [
  '30% recurring commission',
  'Real-time earnings dashboard',
  'Stripe payouts to your bank',
  'Up to 12 months per referral',
]

export default function AffiliateRegister() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/api/affiliate/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) return setError(data.error || 'Registration failed')
      localStorage.setItem('st_affiliate_token', data.token)
      if (data.affiliate) {
        localStorage.setItem('st_affiliate_name', data.affiliate.name || '')
        localStorage.setItem('st_affiliate_email', data.affiliate.email || '')
      }
      navigate('/affiliate/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-surface flex">
      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Link to="/affiliate" className="inline-flex items-center gap-2 mb-6">
              <span className="font-bold text-lg text-text-primary">ShortTrim</span>
              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">Affiliates</span>
            </Link>
            <h1 className="text-2xl font-bold text-text-primary">Join as an affiliate</h1>
            <p className="text-text-muted mt-1 text-sm">Free to join. Start earning today.</p>
          </div>

          <div className="card p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Min. 8 characters"
                  minLength={8}
                  required
                />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-3">{error}</div>
              )}
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading && <Loader size={16} className="animate-spin" />}
                {loading ? 'Creating account...' : 'Create affiliate account'}
              </button>
            </form>
            <p className="text-xs text-text-dim text-center">
              By joining you agree to our{' '}
              <Link to="/terms" className="hover:underline">Terms of Service</Link>.
            </p>
          </div>

          <p className="text-center text-sm text-text-muted mt-4">
            Already an affiliate?{' '}
            <Link to="/affiliate/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-center px-12 w-[420px] bg-gradient-to-br from-primary to-blue-800 text-white shrink-0">
        <div className="mb-8">
          <span className="font-bold text-2xl">ShortTrim</span>
          <span className="text-xs font-medium bg-white/20 text-white px-2 py-0.5 rounded-full ml-2">Affiliates</span>
        </div>
        <h2 className="text-3xl font-bold mb-3">Earn 30% every month</h2>
        <p className="text-white/70 mb-8 text-sm leading-relaxed">
          Refer creators to ShortTrim and earn recurring commissions for up to 12 months per referral.
        </p>
        <ul className="space-y-3">
          {benefits.map((b) => (
            <li key={b} className="flex items-center gap-3 text-sm">
              <CheckCircle size={16} className="text-white/60 shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
