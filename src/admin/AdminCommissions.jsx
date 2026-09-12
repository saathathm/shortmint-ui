import { useState, useEffect } from 'react'
import { Loader } from 'lucide-react'

const API = import.meta.env.VITE_API_BASE_URL
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('st_admin_token')}` })

export default function AdminCommissions() {
  const [commissions, setCommissions] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`${API}/api/admin/commissions?page=${page}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { setCommissions(d.commissions || []); setTotal(d.total || 0) })
      .finally(() => setLoading(false))
  }, [page])

  const statusColor = (s) =>
    s === 'paid' ? 'text-green-600 bg-green-50' : s === 'pending' ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Commissions</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-bg-surface">
              <tr>
                {['Date', 'Affiliate', 'Type', 'Month', 'Amount', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10"><Loader size={20} className="animate-spin mx-auto text-primary" /></td></tr>
              ) : commissions.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-text-muted">No commissions yet</td></tr>
              ) : commissions.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-bg-surface/50">
                  <td className="px-4 py-3 text-text-muted">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{c.affiliates?.name}</div>
                    <div className="text-xs text-text-muted">{c.affiliates?.email}</div>
                  </td>
                  <td className="px-4 py-3 capitalize">{c.event_type}</td>
                  <td className="px-4 py-3 text-text-muted">{c.month_number ?? '–'}</td>
                  <td className="px-4 py-3 font-semibold">${parseFloat(c.commission_amount).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(c.status)}`}>{c.status}</span>
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
