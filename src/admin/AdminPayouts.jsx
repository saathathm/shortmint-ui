import { useState, useEffect } from 'react'
import { Loader } from 'lucide-react'

const API = import.meta.env.VITE_API_BASE_URL
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('st_admin_token')}`,
})

export default function AdminPayouts() {
  const [payouts, setPayouts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)
  const [msgs, setMsgs] = useState({})

  useEffect(() => {
    setLoading(true)
    fetch(`${API}/api/admin/payouts?page=${page}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { setPayouts(d.payouts || []); setTotal(d.total || 0) })
      .finally(() => setLoading(false))
  }, [page])

  const approve = async (id) => {
    setActionId(id)
    setMsgs((m) => ({ ...m, [id]: null }))
    try {
      const res = await fetch(`${API}/api/admin/payouts/${id}/approve`, { method: 'POST', headers: authHeaders() })
      const data = await res.json()
      if (!res.ok) {
        setMsgs((m) => ({ ...m, [id]: { error: data.error } }))
        return
      }
      setPayouts((prev) => prev.map((p) => p.id === id ? { ...p, status: 'paid' } : p))
      setMsgs((m) => ({ ...m, [id]: { success: 'Paid!' } }))
    } catch {
      setMsgs((m) => ({ ...m, [id]: { error: 'Failed' } }))
    } finally {
      setActionId(null)
    }
  }

  const statusColor = (s) =>
    s === 'paid' ? 'text-green-600 bg-green-50' : s === 'pending' ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Payouts</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-bg-surface">
              <tr>
                {['Date', 'Affiliate', 'Amount', 'Status', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10"><Loader size={20} className="animate-spin mx-auto text-primary" /></td></tr>
              ) : payouts.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-text-muted">No payout requests yet</td></tr>
              ) : payouts.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-bg-surface/50">
                  <td className="px-4 py-3 text-text-muted">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.affiliates?.name}</div>
                    <div className="text-xs text-text-muted">{p.affiliates?.email}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold">${parseFloat(p.amount).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(p.status)}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {p.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => approve(p.id)}
                          disabled={actionId === p.id}
                          className="text-xs bg-primary text-white rounded-lg px-3 py-1 hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          {actionId === p.id && <Loader size={11} className="animate-spin" />}
                          Approve & Pay
                        </button>
                        {msgs[p.id]?.error && <span className="text-xs text-red-600">{msgs[p.id].error}</span>}
                        {msgs[p.id]?.success && <span className="text-xs text-green-600">{msgs[p.id].success}</span>}
                      </div>
                    )}
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
