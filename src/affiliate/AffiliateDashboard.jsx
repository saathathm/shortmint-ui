import { useState, useEffect, useCallback } from 'react'
import { Copy, Check, ExternalLink, Loader } from 'lucide-react'

const API = import.meta.env.VITE_API_BASE_URL

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('st_affiliate_token')}`,
})

function useAffiliate() {
  const [affiliate, setAffiliate] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/affiliate/me`, { headers: authHeaders() }).then((r) => r.json()),
      fetch(`${API}/api/affiliate/stats`, { headers: authHeaders() }).then((r) => r.json()),
    ])
      .then(([meData, statsData]) => {
        setAffiliate(meData.affiliate)
        setStats(statsData)
      })
      .finally(() => setLoading(false))
  }, [])

  return { affiliate, stats, loading }
}

// --- Overview ---
function Overview({ affiliate, stats }) {
  const [copied, setCopied] = useState(false)
  const referralLink = affiliate
    ? `${window.location.origin}/?ref=${affiliate.referral_code}`
    : ''

  const copy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const statCards = [
    { label: 'Total earned', value: `$${(stats?.total_earned || 0).toFixed(2)}` },
    { label: 'Pending balance', value: `$${(stats?.payout_balance || 0).toFixed(2)}` },
    { label: 'Total referrals', value: stats?.referral_count ?? '—' },
    { label: 'This month', value: `$${(stats?.month_earned || 0).toFixed(2)}` },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Overview</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map(({ label, value }) => (
          <div key={label} className="card p-4">
            <p className="text-xs text-text-muted mb-1">{label}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <p className="text-sm font-semibold text-text-primary mb-3">Your referral link</p>
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={referralLink}
            className="input-field flex-1 text-sm font-mono"
          />
          <button
            onClick={copy}
            className="btn-primary flex items-center gap-1.5 px-4 py-2 whitespace-nowrap"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        {affiliate && (
          <p className="text-xs text-text-muted mt-2">
            Code: <span className="font-mono font-semibold text-text-primary">{affiliate.referral_code}</span>
          </p>
        )}
      </div>
    </div>
  )
}

// --- My Link ---
function MyLink({ affiliate }) {
  const [copied, setCopied] = useState(false)
  const referralLink = affiliate
    ? `${window.location.origin}/?ref=${affiliate.referral_code}`
    : ''

  const copy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">My Link</h1>
      <div className="card p-6 space-y-4">
        <div>
          <p className="text-sm font-semibold text-text-primary mb-2">Referral link</p>
          <div className="flex items-center gap-2">
            <input readOnly value={referralLink} className="input-field flex-1 font-mono text-sm" />
            <button onClick={copy} className="btn-primary flex items-center gap-1.5 px-4 py-2">
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary mb-2">Referral code</p>
          <p className="font-mono text-lg font-bold text-primary bg-primary/5 border border-primary/20 rounded-xl px-4 py-2 inline-block">
            {affiliate?.referral_code || '—'}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary mb-2">Share on social</p>
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://twitter.com/intent/tweet?text=I%20use%20ShortTrim%20to%20turn%20YouTube%20videos%20into%20viral%20Shorts.%20Try%20it%20free%3A%20${encodeURIComponent(referralLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm border border-border rounded-xl px-4 py-2 hover:bg-bg-surface transition-colors"
            >
              <ExternalLink size={14} />
              Twitter / X
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm border border-border rounded-xl px-4 py-2 hover:bg-bg-surface transition-colors"
            >
              <ExternalLink size={14} />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Earnings ---
function Earnings() {
  const [commissions, setCommissions] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`${API}/api/affiliate/commissions?page=${page}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { setCommissions(d.commissions || []); setTotal(d.total || 0) })
      .finally(() => setLoading(false))
  }, [page])

  const statusColor = (s) =>
    s === 'pending' ? 'text-yellow-600 bg-yellow-50' : s === 'paid' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Earnings</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-bg-surface">
              <tr>
                {['Date', 'Client', 'Type', 'Month', 'Amount', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-text-muted"><Loader size={20} className="animate-spin mx-auto" /></td></tr>
              ) : commissions.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-text-muted">No commissions yet</td></tr>
              ) : commissions.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-bg-surface/50">
                  <td className="px-4 py-3 text-text-muted">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-mono text-xs text-text-muted">{c.client_id}</td>
                  <td className="px-4 py-3 capitalize">{c.commission_type}</td>
                  <td className="px-4 py-3 text-text-muted">{c.month_number ?? '—'}</td>
                  <td className="px-4 py-3 font-semibold text-text-primary">${parseFloat(c.commission_amount).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(c.status)}`}>{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {total > 20 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border text-sm">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary px-3 py-1 text-sm disabled:opacity-40">Prev</button>
            <span className="text-text-muted">Page {page}</span>
            <button disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)} className="btn-secondary px-3 py-1 text-sm disabled:opacity-40">Next</button>
          </div>
        )}
      </div>
    </div>
  )
}

// --- Payouts ---
function Payouts({ stats, affiliate }) {
  const [payouts, setPayouts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [connectStatus, setConnectStatus] = useState(null)
  const [requesting, setRequesting] = useState(false)
  const [onboarding, setOnboarding] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`${API}/api/affiliate/payouts?page=${page}`, { headers: authHeaders() }).then((r) => r.json()),
      fetch(`${API}/api/affiliate/connect/status`, { headers: authHeaders() }).then((r) => r.json()),
    ])
      .then(([pd, cs]) => {
        setPayouts(pd.payouts || [])
        setTotal(pd.total || 0)
        setConnectStatus(cs)
      })
      .finally(() => setLoading(false))
  }, [page])

  const requestPayout = async () => {
    setRequesting(true)
    setMsg(null)
    try {
      const res = await fetch(`${API}/api/affiliate/payout/request`, { method: 'POST', headers: authHeaders() })
      const data = await res.json()
      if (!res.ok) return setMsg({ error: data.error })
      setMsg({ success: 'Payout requested! We\'ll process it shortly.' })
      setPayouts((p) => [data.payout, ...p])
    } catch {
      setMsg({ error: 'Something went wrong.' })
    } finally {
      setRequesting(false)
    }
  }

  const startOnboarding = async () => {
    setOnboarding(true)
    try {
      const res = await fetch(`${API}/api/affiliate/connect/onboard`, { headers: authHeaders() })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      setMsg({ error: 'Could not start Stripe onboarding.' })
    } finally {
      setOnboarding(false)
    }
  }

  const balance = stats?.payout_balance || 0
  const isActive = connectStatus?.status === 'active'
  const canPayout = balance >= 50 && isActive

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Payouts</h1>

      {/* Stripe Connect status */}
      <div className="card p-5">
        <p className="text-sm font-semibold text-text-primary mb-3">Stripe Connect</p>
        {loading ? (
          <div className="text-text-muted text-sm">Loading...</div>
        ) : isActive ? (
          <div className="flex items-center gap-2 text-green-600">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            <span className="text-sm font-medium">Connected and active</span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-yellow-600">
              <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
              <span className="text-sm font-medium">
                {connectStatus?.connected ? 'Setup incomplete' : 'Not connected'}
              </span>
            </div>
            <button onClick={startOnboarding} disabled={onboarding} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
              {onboarding && <Loader size={14} className="animate-spin" />}
              {connectStatus?.connected ? 'Complete Stripe setup' : 'Connect Stripe'}
            </button>
            <p className="text-xs text-text-muted">Connect Stripe to receive payouts directly to your bank account.</p>
          </div>
        )}
      </div>

      {/* Request payout */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-text-primary">Available balance</p>
            <p className="text-2xl font-bold text-text-primary mt-1">${balance.toFixed(2)}</p>
          </div>
          <button
            onClick={requestPayout}
            disabled={!canPayout || requesting}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {requesting && <Loader size={14} className="animate-spin" />}
            Request payout
          </button>
        </div>
        {!isActive && <p className="text-xs text-text-muted">Connect Stripe to request payouts.</p>}
        {isActive && balance < 50 && <p className="text-xs text-text-muted">Minimum payout is $50. Keep referring to earn more!</p>}
        {msg?.success && <p className="text-sm text-green-600 mt-2">{msg.success}</p>}
        {msg?.error && <p className="text-sm text-red-600 mt-2">{msg.error}</p>}
      </div>

      {/* Payout history */}
      <div className="card overflow-hidden">
        <p className="px-4 py-3 border-b border-border text-sm font-semibold text-text-primary">Payout history</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-bg-surface">
              <tr>
                {['Date', 'Amount', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payouts.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-8 text-text-muted text-sm">No payouts yet</td></tr>
              ) : payouts.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-text-muted">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-semibold">${parseFloat(p.amount).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      p.status === 'paid' ? 'text-green-600 bg-green-50' : p.status === 'pending' ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'
                    }`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// --- Settings ---
function AffiliateSettings({ affiliate }) {
  const [name, setName] = useState(affiliate?.name || '')
  const [email, setEmail] = useState(affiliate?.email || '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    if (affiliate) { setName(affiliate.name); setEmail(affiliate.email) }
  }, [affiliate])

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMsg(null)
    try {
      const res = await fetch(`${API}/api/affiliate/profile`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ name, email }),
      })
      const data = await res.json()
      if (!res.ok) return setMsg({ error: data.error })
      setMsg({ success: 'Profile updated.' })
    } catch {
      setMsg({ error: 'Something went wrong.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
      <div className="card p-6 max-w-md">
        <p className="text-sm font-semibold text-text-primary mb-4">Profile</p>
        <form onSubmit={save} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
          </div>
          {msg?.success && <p className="text-sm text-green-600">{msg.success}</p>}
          {msg?.error && <p className="text-sm text-red-600">{msg.error}</p>}
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving && <Loader size={14} className="animate-spin" />}
            Save changes
          </button>
        </form>
      </div>
    </div>
  )
}

// --- Main export ---
export default function AffiliateDashboard({ tab }) {
  const { affiliate, stats, loading } = useAffiliate()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size={28} className="animate-spin text-primary" />
      </div>
    )
  }

  if (tab === 'overview') return <Overview affiliate={affiliate} stats={stats} />
  if (tab === 'link') return <MyLink affiliate={affiliate} />
  if (tab === 'earnings') return <Earnings />
  if (tab === 'payouts') return <Payouts stats={stats} affiliate={affiliate} />
  if (tab === 'settings') return <AffiliateSettings affiliate={affiliate} />
  return null
}
