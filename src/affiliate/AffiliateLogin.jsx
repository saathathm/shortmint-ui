import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader } from 'lucide-react'

const API = import.meta.env.VITE_API_BASE_URL

export default function AffiliateLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/api/affiliate/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) return setError(data.error || 'Login failed')
      localStorage.setItem('st_affiliate_token', data.token)
      navigate('/affiliate/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/affiliate" className="font-bold text-xl text-primary">ShortTrim Affiliates</Link>
          <h1 className="text-2xl font-bold text-text-primary mt-4">Sign in</h1>
          <p className="text-text-muted mt-1 text-sm">Access your affiliate dashboard</p>
        </div>

        <div className="card p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
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
                placeholder="Your password"
                required
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-3">{error}</div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading && <Loader size={16} className="animate-spin" />}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-muted mt-4">
          Not an affiliate yet?{' '}
          <Link to="/affiliate/register" className="text-primary font-semibold hover:underline">Join now</Link>
        </p>
      </div>
    </div>
  )
}
