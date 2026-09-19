import { useState, useEffect } from 'react'
import { Copy, Check, ExternalLink, Loader, DollarSign, Wallet, Users, TrendingUp } from 'lucide-react'
import { MIN_PAYOUT } from './constants'

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

// --- Empty state ---
function EmptyReferrals({ referralCode }) {
  const [copied, setCopied] = useState(false)
  const link = `${window.location.origin}/?ref=${referralCode}`
  const copy = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="card p-6 border-2 border-dashed border-border text-center">
      <div className="w-12 h-12 rounded-full bg-bg-surface flex items-center justify-center mx-auto mb-3">
        <Users size={22} className="text-text-dim" />
      </div>
      <p className="font-semibold text-text-primary mb-1">No referrals yet</p>
      <p className="text-sm text-text-muted mb-5">Share your link to start earning 30% recurring commissions.</p>
      <div className="flex items-center gap-2 max-w-sm mx-auto">
        <input readOnly value={link} className="input-field flex-1 text-sm font-mono" />
        <button onClick={copy} className="btn-primary flex items-center gap-1.5 px-4 py-2 whitespace-nowrap shrink-0">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  )
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

  const clearingBalance = stats?.clearing_balance || 0
  const clearingDays = stats?.next_available_at
    ? Math.max(0, Math.ceil((new Date(stats.next_available_at) - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  const statCards = [
    { label: 'Total earned', value: `$${(stats?.total_earned || 0).toFixed(2)}`, icon: DollarSign, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
    {
      label: 'Available',
      value: `$${(stats?.available_balance || 0).toFixed(2)}`,
      sub: clearingBalance > 0 ? `+ $${clearingBalance.toFixed(2)} clearing · next in ${clearingDays}d` : null,
      icon: Wallet, iconBg: 'bg-blue-50', iconColor: 'text-blue-600',
    },
    { label: 'Total referrals', value: stats?.referral_count ?? '–', icon: Users, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
    { label: 'This month', value: `$${(stats?.month_earned || 0).toFixed(2)}`, icon: TrendingUp, iconBg: 'bg-orange-50', iconColor: 'text-orange-600' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Overview</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map(({ label, value, sub, icon: Icon, iconBg, iconColor }) => (
          <div key={label} className="card p-4">
            <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center mb-3`}>
              <Icon size={16} className={iconColor} />
            </div>
            <p className="text-xs text-text-muted mb-1">{label}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
            {sub && <p className="text-xs text-text-muted mt-1">{sub}</p>}
          </div>
        ))}
      </div>

      {stats?.referral_count === 0 && affiliate && (
        <EmptyReferrals referralCode={affiliate.referral_code} />
      )}

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
            {affiliate?.referral_code || '–'}
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

  const daysLeft = (createdAt) =>
    Math.max(0, Math.ceil((new Date(createdAt).getTime() + 9 * 24 * 60 * 60 * 1000 - Date.now()) / (1000 * 60 * 60 * 24)))

  const statusBadge = (c) => {
    if (c.status === 'paid') return <span className="text-xs font-medium px-2 py-0.5 rounded-full text-green-600 bg-green-50">Paid</span>
    const days = daysLeft(c.created_at)
    if (days === 0) return <span className="text-xs font-medium px-2 py-0.5 rounded-full text-green-600 bg-green-50">Available</span>
    return <span className="text-xs font-medium px-2 py-0.5 rounded-full text-yellow-600 bg-yellow-50">{days}d left</span>
  }

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
                  <td className="px-4 py-3 text-text-muted">{c.month_number ?? '–'}</td>
                  <td className="px-4 py-3 font-semibold text-text-primary">${parseFloat(c.commission_amount).toFixed(2)}</td>
                  <td className="px-4 py-3">{statusBadge(c)}</td>
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

  const available = stats?.available_balance || 0
  const clearing = stats?.clearing_balance || 0
  const isActive = connectStatus?.status === 'active'
  const canPayout = available >= MIN_PAYOUT && isActive
  const clearingDays = stats?.next_available_at
    ? Math.max(0, Math.ceil((new Date(stats.next_available_at) - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

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
      <div className="card p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-text-primary">Available balance</p>
            <p className="text-2xl font-bold text-text-primary mt-1">${available.toFixed(2)}</p>
            {clearing > 0 && (
              <p className="text-xs text-text-muted mt-1">
                + ${clearing.toFixed(2)} clearing{clearingDays !== null ? ` · next in ${clearingDays} day${clearingDays !== 1 ? 's' : ''}` : ''}
              </p>
            )}
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
        {isActive && (
          <div className="space-y-1.5 border-t border-border pt-3">
            <div className="flex justify-between text-xs text-text-muted">
              <span>Progress to payout</span>
              <span>${Math.min(available, MIN_PAYOUT).toFixed(2)} / ${MIN_PAYOUT}</span>
            </div>
            <div className="h-1.5 bg-bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (available / MIN_PAYOUT) * 100)}%` }}
              />
            </div>
          </div>
        )}
        <p className="text-xs text-text-muted border-t border-border pt-3">
          Commissions are held for 9 days after a subscription to allow for payment processing.
        </p>
        {!isActive && <p className="text-xs text-text-muted">Connect Stripe to request payouts.</p>}
        {isActive && available < MIN_PAYOUT && available === 0 && clearing > 0 && (
          <p className="text-xs text-text-muted">
            Your ${clearing.toFixed(2)} is still clearing.{clearingDays !== null ? ` Next available in ${clearingDays} day${clearingDays !== 1 ? 's' : ''}.` : ''}
          </p>
        )}
        {isActive && available < MIN_PAYOUT && clearing === 0 && (
          <p className="text-xs text-text-muted">Minimum payout is ${MIN_PAYOUT}. Keep referring to earn more!</p>
        )}
        {msg?.success && <p className="text-sm text-green-600">{msg.success}</p>}
        {msg?.error && <p className="text-sm text-red-600">{msg.error}</p>}
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
