import { useEffect, useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAuth } from '../hooks/useAuth.js'
import { startProcessing } from '../store/videoSlice.js'
import StylePicker from '../components/StylePicker.jsx'
import UsageBar from '../components/UsageBar.jsx'
import { Loader, AlertCircle, Sparkles } from 'lucide-react'
import { refreshClient } from '../store/authSlice.js'

function isValidYouTubeUrl(url) {
  return /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(url)
}

export default function Dashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { client } = useAuth()
  const [url, setUrl] = useState('')
  const [style, setStyle] = useState('blur')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const hasActivePlan = client && client.usage_hours_limit > 0
  const isOverLimit = client && client.usage_hours_used >= client.usage_hours_limit

  // Inside the Dashboard component:
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('upgraded') === 'true' && client?.id) {
      // Wait 2 seconds for Stripe webhook to process, then refresh
      setTimeout(() => {
        dispatch(refreshClient(client.id))
        setSearchParams({}) // remove the query param
      }, 2000)
    }
  }, [searchParams, client])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!isValidYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL.')
      return
    }
    if (!hasActivePlan) {
      navigate('/pricing')
      return
    }
    if (isOverLimit) {
      setError('You have reached your monthly limit. Please upgrade your plan.')
      return
    }

    setLoading(true)
    const result = await dispatch(startProcessing({ youtubeUrl: url, clientId: client.id, style }))
    setLoading(false)

    if (result.payload?.video_id) {
      navigate(`/processing/${result.payload.video_id}`)
    } else {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Create Shorts</h1>
        <p className="text-text-muted mt-1">Paste a YouTube link and we'll find the best moments automatically.</p>
      </div>

      <UsageBar />

      {!hasActivePlan && (
        <div className="mt-4 bg-bg-secondary border border-blue-100 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-text-primary">Choose a plan to get started</p>
            <p className="text-sm text-text-muted mt-0.5">Your account is free but you need a plan to process videos.</p>
            <Link to="/pricing" className="text-sm font-semibold text-primary hover:underline mt-2 inline-block">View plans →</Link>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2 block">YouTube URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input-field text-base"
            placeholder="https://youtu.be/..."
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2 block">Video style</label>
          <StylePicker value={style} onChange={setStyle} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-error text-sm rounded-xl p-3 flex items-center gap-2">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !hasActivePlan || isOverLimit}
          className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3.5"
        >
          {loading ? (
            <><Loader size={18} className="animate-spin" /> Starting...</>
          ) : (
            <><Sparkles size={18} /> Create Shorts</>
          )}
        </button>
      </form>
    </div>
  )
}
