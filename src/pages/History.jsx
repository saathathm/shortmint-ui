import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../hooks/useAuth.js'
import { loadHistory } from '../store/historySlice.js'
import { Loader, Clock, CheckCircle, XCircle, Film } from 'lucide-react'

function groupByDate(videos) {
  const now = new Date()
  const today = now.toDateString()
  const yesterday = new Date(now - 86400000).toDateString()
  const thisWeekStart = new Date(now - 7 * 86400000)

  const groups = { Today: [], Yesterday: [], 'This Week': [], Earlier: [] }
  videos.forEach((v) => {
    const d = new Date(v.created_at)
    if (d.toDateString() === today) groups.Today.push(v)
    else if (d.toDateString() === yesterday) groups.Yesterday.push(v)
    else if (d >= thisWeekStart) groups['This Week'].push(v)
    else groups.Earlier.push(v)
  })
  return groups
}

const STYLE_LABELS = { blur: 'Blur BG', crop: '9:16 Crop', custom: 'Custom BG' }
const STATUS_COLORS = {
  completed: 'bg-green-50 text-success',
  processing: 'bg-blue-50 text-primary',
  failed: 'bg-red-50 text-error',
  pending: 'bg-gray-100 text-text-muted',
}

export default function History() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { client } = useAuth()
  const { videos, loading } = useSelector((s) => s.history)

  useEffect(() => {
    if (client?.id) dispatch(loadHistory(client.id))
  }, [client?.id])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size={28} className="animate-spin text-primary" />
      </div>
    )
  }

  if (!videos.length) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <Film size={48} className="text-text-dim mb-4" />
        <h2 className="text-xl font-bold text-text-primary mb-2">No videos yet</h2>
        <p className="text-text-muted text-sm mb-6">Your processed videos will appear here.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">Create your first Short</button>
      </div>
    )
  }

  const groups = groupByDate(videos)

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">History</h1>
        <p className="text-text-muted mt-1 text-sm">{videos.length} videos processed</p>
      </div>

      <div className="space-y-6">
        {Object.entries(groups).map(([group, items]) => {
          if (!items.length) return null
          return (
            <div key={group}>
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">{group}</h3>
              <div className="space-y-2">
                {items.map((video) => {
                  const totalClips = video.clips?.length || 0
                  const publishedClips = video.clips?.filter((c) => c.publish_status === 'published').length || 0
                  return (
                    <button
                      key={video.id}
                      onClick={() => navigate(`/results/${video.id}`)}
                      className="card w-full text-left p-4 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-text-primary text-sm truncate group-hover:text-primary transition-colors">
                            {video.title || 'Untitled video'}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="text-xs bg-bg-surface text-text-muted px-2 py-0.5 rounded-md font-medium">
                              {STYLE_LABELS[video.style] || video.style}
                            </span>
                            {video.duration_minutes && (
                              <span className="text-xs text-text-dim flex items-center gap-1">
                                <Clock size={11} />
                                {Math.round(video.duration_minutes)} min
                              </span>
                            )}
                            {totalClips > 0 && (
                              <span className="text-xs text-text-dim">
                                {publishedClips}/{totalClips} published
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-lg capitalize shrink-0 ${STATUS_COLORS[video.status]}`}>
                          {video.status}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
