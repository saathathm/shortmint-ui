import { useState, useEffect } from 'react'
import { Loader } from 'lucide-react'

const API = import.meta.env.VITE_API_BASE_URL
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('st_admin_token')}` })

export default function AdminOverview() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/admin/stats`, { headers: authHeaders() })
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader size={24} className="animate-spin text-primary" /></div>

  const cards = [
    { label: 'Total users', value: stats?.total_users ?? '—' },
    { label: 'Total videos', value: stats?.total_videos ?? '—' },
    { label: 'Total revenue', value: `$${((stats?.total_revenue_cents || 0) / 100).toFixed(2)}` },
    { label: 'Total commissions', value: `$${(stats?.total_commissions || 0).toFixed(2)}` },
    { label: 'Pending payouts', value: stats?.pending_payouts ?? '—' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Overview</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map(({ label, value }) => (
          <div key={label} className="card p-4">
            <p className="text-xs text-text-muted mb-1">{label}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
