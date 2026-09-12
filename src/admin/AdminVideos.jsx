import { useState, useEffect } from 'react'
import { Loader } from 'lucide-react'

const API = import.meta.env.VITE_API_BASE_URL
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('st_admin_token')}` })

export default function AdminVideos() {
  const [videos, setVideos] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`${API}/api/admin/videos?page=${page}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { setVideos(d.videos || []); setTotal(d.total || 0) })
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Videos</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-bg-surface">
              <tr>
                {['Title', 'Status', 'Duration', 'Created'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center py-10"><Loader size={20} className="animate-spin mx-auto text-primary" /></td></tr>
              ) : videos.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-text-muted">No videos found</td></tr>
              ) : videos.map((v) => (
                <tr key={v.id} className="border-b border-border last:border-0 hover:bg-bg-surface/50">
                  <td className="px-4 py-3 max-w-xs truncate font-medium">{v.title || v.original_url || '–'}</td>
                  <td className="px-4 py-3 capitalize text-text-muted">{v.status}</td>
                  <td className="px-4 py-3 text-text-muted">{v.duration ? `${Math.round(v.duration / 60)}m` : '–'}</td>
                  <td className="px-4 py-3 text-text-muted">{new Date(v.created_at).toLocaleDateString()}</td>
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
