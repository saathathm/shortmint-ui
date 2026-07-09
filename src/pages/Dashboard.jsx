import { useEffect, useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAuth } from '../hooks/useAuth.js'
import { startProcessing } from '../store/videoSlice.js'
import StylePicker from '../components/StylePicker.jsx'
import UsageBar from '../components/UsageBar.jsx'
import { Loader, AlertCircle, Sparkles } from 'lucide-react'
import { refreshClient } from '../store/authSlice.js'

const PLATFORM_TIERS = {
  trial: ['YouTube', 'Upload'],
  starter: ['YouTube', 'Upload'],
  growth: ['YouTube', 'Facebook', 'Instagram', 'Upload'],
  pro: ['YouTube', 'Facebook', 'Instagram', 'Vimeo', 'TikTok', 'Rumble', 'Loom', 'Dropbox', 'Upload'],
}

const ALL_PLATFORMS = [
  {
    name: 'YouTube',
    pattern: /(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  },
  {
    name: 'Facebook',
    pattern: /(?:https?:\/\/)?(?:www\.|web\.|m\.)?facebook\.com\/(?:.*\/videos\/|watch\/?\?v=|reel\/|share\/r\/|share\/v\/)([0-9a-zA-Z_-]+)|(?:https?:\/\/)?fb\.watch\/([0-9a-zA-Z_-]+)/
  },
  {
    name: 'Instagram',
    pattern: /instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/
  },
  {
    name: 'TikTok',
    pattern: /(?:tiktok\.com\/@[\w.]+\/video\/|vm\.tiktok\.com\/|vt\.tiktok\.com\/)([A-Za-z0-9]+)/
  },
  {
    name: 'Vimeo',
    pattern: /vimeo\.com\/(?:video\/)?(\d+)/
  },
  {
    name: 'Rumble',
    pattern: /rumble\.com\/(?:v|embed)\/([a-zA-Z0-9_-]+)/
  },
  {
    name: 'Loom',
    pattern: /loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/
  },
  {
    name: 'Dropbox',
    pattern: /dropbox\.com\/s\/([a-zA-Z0-9]+)/
  }
];


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

  const clientPlan = client?.plan || 'trial'
  const allowedPlatformNames = PLATFORM_TIERS[clientPlan] || PLATFORM_TIERS['trial']
  const allowedPlatforms = ALL_PLATFORMS.filter(p => allowedPlatformNames.includes(p.name))


  const isValidVideoUrl = (url) => {
    try {
      new URL(url)
      return allowedPlatforms.some(p => p.pattern.test(url))
    } catch { return false }
  }

  const detectPlatform = (url) => {
    return allowedPlatforms.find(p => p.pattern.test(url)) || null
  }

  // Check if URL is valid but on a locked platform
  const isLockedPlatform = (url) => {
    try {
      new URL(url)
      const matchesAny = ALL_PLATFORMS.some(p => p.pattern.test(url))
      const matchesAllowed = allowedPlatforms.some(p => p.pattern.test(url))
      return matchesAny && !matchesAllowed
    } catch { return false }
  }

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

    if (!isValidVideoUrl(url)) {
      if (isLockedPlatform(url)) {
        setError('This platform is not available on your current plan. Please upgrade.')
      } else {
        setError('Please enter a valid video URL from a supported platform.')
      }
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
    const result = await dispatch(startProcessing({ videoUrl: url, clientId: client.id, style }))
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
        <p className="text-text-muted mt-1">Paste a Video link and we'll find the best moments automatically.</p>
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
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2 block">Video URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input-field text-base"
            placeholder="https://youtu.be/..."
            required
          />
          {url && detectPlatform(url) && (
            <p className="text-xs text-success font-medium mt-1">
              ✓ {detectPlatform(url)?.name} link detected
            </p>
          )}
          {url && isLockedPlatform(url) && (
            <div className="mt-1 flex items-center gap-2">
              <p className="text-xs text-amber-600 font-medium">
                🔒 This platform requires a higher plan.
              </p>
              <Link to="/pricing" className="text-xs text-primary font-semibold hover:underline">
                Upgrade →
              </Link>
            </div>
          )}
          {url && !isValidVideoUrl(url) && !isLockedPlatform(url) && url.length > 10 && (
            <p className="text-xs text-error mt-1">
              URL not recognised. Please use a supported platform link.
            </p>
          )}
        </div>
        <div className="mt-3">
          <p className="text-xs text-text-muted mb-2">
            Supported on your <span className="font-semibold capitalize">{clientPlan}</span> plan:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {allowedPlatformNames.filter(p => p !== 'Upload').map(name => (
              <span key={name} className="text-xs bg-bg-secondary border border-blue-100 text-primary px-2 py-0.5 rounded-full font-medium">
                {name}
              </span>
            ))}
            {allowedPlatformNames.includes('Upload') && (
              <span className="text-xs bg-bg-surface border border-border text-text-muted px-2 py-0.5 rounded-full">
                File upload
              </span>
            )}
          </div>
          {clientPlan !== 'pro' && (
            <p className="text-xs text-text-dim mt-2">
              <Link to="/pricing" className="text-primary hover:underline font-medium">Upgrade</Link>
              {' '}to unlock more platforms
            </p>
          )}
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
