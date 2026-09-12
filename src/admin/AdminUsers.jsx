import { useState, useEffect } from 'react'
import { Loader, Search } from 'lucide-react'

const API = import.meta.env.VITE_API_BASE_URL
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('st_admin_token')}` })

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page })
    if (search) params.set('q', search)
    fetch(`${API}/api/admin/users?${params}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { setUsers(d.users || []); setTotal(d.total || 0) })
      .finally(() => setLoading(false))
  }, [page, search])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Users</h1>
        <form onSubmit={(e) => { e.preventDefault(); setSearch(q); setPage(1) }} className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or email"
            className="input-field text-sm w-56"
          />
          <button type="submit" className="btn-secondary p-2"><Search size={16} /></button>
        </form>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-bg-surface">
              <tr>
                {['Name', 'Email', 'Plan', 'Credit hrs', 'Referred by', 'Joined'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10"><Loader size={20} className="animate-spin mx-auto text-primary" /></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-text-muted">No users found</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-bg-surface/50">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-text-muted">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.plan}</td>
                  <td className="px-4 py-3">{u.credit_hours}</td>
                  <td className="px-4 py-3 font-mono text-xs text-text-muted">{u.referred_by || '—'}</td>
                  <td className="px-4 py-3 text-text-muted">{new Date(u.created_at).toLocaleDateString()}</td>
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
