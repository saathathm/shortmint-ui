import { useState, useEffect } from 'react'
import { Loader } from 'lucide-react'

const API = import.meta.env.VITE_API_BASE_URL
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('st_admin_token')}`,
})

export default function AdminAffiliates() {
  const [affiliates, setAffiliates] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch(`${API}/api/admin/affiliates?page=${page}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { setAffiliates(d.affiliates || []); setTotal(d.total || 0) })
      .finally(() => setLoading(false))
  }, [page])

  const toggleSuspend = async (id, currentStatus) => {
    setActionId(id)
    const action = currentStatus === 'suspended' ? 'unsuspend' : 'suspend'
    try {
      await fetch(`${API}/api/admin/affiliates/${id}/${action}`, { method: 'POST', headers: authHeaders() })
      setAffiliates((prev) =>
        prev.map((a) => a.id === id ? { ...a, status: action === 'suspend' ? 'suspended' : 'active' } : a)
      )
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Affiliates</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-bg-surface">
              <tr>
                {['Name', 'Email', 'Code', 'Stripe', 'Earned', 'Balance', 'Status', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-10"><Loader size={20} className="animate-spin mx-auto text-primary" /></td></tr>
              ) : affiliates.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-text-muted">No affiliates yet</td></tr>
              ) : affiliates.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-bg-surface/50">
                  <td className="px-4 py-3 font-medium">{a.name}</td>
                  <td className="px-4 py-3 text-text-muted">{a.email}</td>
                  <td className="px-4 py-3 font-mono text-xs font-semibold">{a.referral_code}</td>
                  <td className="px-4 py-3 capitalize text-text-muted">{a.stripe_account_status}</td>
                  <td className="px-4 py-3">${parseFloat(a.total_earned || 0).toFixed(2)}</td>
                  <td className="px-4 py-3">${parseFloat(a.payout_balance || 0).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      a.status === 'active' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                    }`}>{a.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleSuspend(a.id, a.status)}
                      disabled={actionId === a.id}
                      className="text-xs border border-border rounded-lg px-3 py-1 hover:bg-bg-surface transition-colors disabled:opacity-50"
                    >
                      {actionId === a.id ? <Loader size={12} className="animate-spin inline" /> : a.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {total > 25 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border text-sm">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary px-3 py-1 text-sm disabled:opacity-40">Prev</button>
            <span className="text-text-muted">{total} total · Page {page}</span>
            <button disabled={page * 25 >= total} onClick={() => setPage(p => p + 1)} className="btn-secondary px-3 py-1 text-sm disabled:opacity-40">Next</button>
          </div>
        )}
      </div>
    </div>
  )
}
