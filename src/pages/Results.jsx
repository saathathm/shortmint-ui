import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadResults } from '../store/videoSlice.js'
import { useAuth } from '../hooks/useAuth.js'
import ClipCard from '../components/ClipCard.jsx'
import { ArrowLeft, Loader, AlertCircle, RefreshCw } from 'lucide-react'

export default function Results() {
  const { videoId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { client } = useAuth()
  const { clips, title, style, status, loading, error } = useSelector((s) => s.video)

  useEffect(() => {
    if (videoId) dispatch(loadResults(videoId))
  }, [videoId])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size={28} className="animate-spin text-primary" />
      </div>
    )
  }

  if (error || status === 'failed') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <AlertCircle size={40} className="text-error mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-primary mb-2">Something went wrong</h2>
          <p className="text-text-muted text-sm mb-6">
            We couldn't process this video. This sometimes happens with very long videos or unstable connections.
          </p>
          <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
            <RefreshCw size={16} /> Try again
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-bg-surface rounded-xl transition-all">
          <ArrowLeft size={20} className="text-text-muted" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-text-primary truncate">{title || 'Your Clips'}</h1>
          <p className="text-sm text-text-muted">{clips.length} clips · {style} style</p>
        </div>
      </div>

      {clips.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-muted">No clips found. Try processing the video again.</p>
          <Link to="/dashboard" className="btn-primary inline-block mt-4">Back to Dashboard</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {clips.map((clip, i) => (
            <ClipCard key={clip.id} clip={clip} clipIndex={i} />
          ))}
        </div>
      )}
    </div>
  )
}
