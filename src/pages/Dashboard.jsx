import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAuth } from '../hooks/useAuth.js'
import { startProcessing } from '../store/videoSlice.js'
import StylePicker from '../components/StylePicker.jsx'
import UsageBar from '../components/UsageBar.jsx'
import { getVideoInfo } from '../lib/api.js'
import { AlertCircle, Sparkles, Clock, Loader, AlertTriangle } from 'lucide-react'

// Platform validation
const PLATFORM_TIERS = {
  trial: ['youtube', 'upload'],
  starter: ['youtube', 'upload'],
  growth: ['youtube', 'facebook', 'instagram', 'upload'],
  pro: ['youtube', 'facebook', 'instagram', 'vimeo', 'tiktok', 'rumble', 'loom', 'dropbox', 'upload'],
}

const PLATFORM_PATTERNS = [
  { name: 'youtube', pattern: /(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/ },
  { name: 'facebook', pattern: /(?:https?:\/\/)?(?:www\.|web\.|m\.)?facebook\.com\/(?:.*\/videos\/|watch\/?\?v=|reel\/|share\/r\/|share\/v\/)([0-9a-zA-Z_-]+)|(?:https?:\/\/)?fb\.watch\/([0-9a-zA-Z_-]+)/ },
  { name: 'instagram', pattern: /instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/ },
  { name: 'vimeo', pattern: /vimeo\.com\/(?:video\/)?(\d+)/ },
  { name: 'tiktok', pattern: /(?:tiktok\.com\/@[\w.]+\/video\/|vm\.tiktok\.com\/|vt\.tiktok\.com\/)([A-Za-z0-9]+)/ },
  { name: 'rumble', pattern: /rumble\.com\/(?:v|embed)\/([a-zA-Z0-9_-]+)/ },
  { name: 'loom', pattern: /loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/ },
  { name: 'dropbox', pattern: /dropbox\.com\/s\/([a-zA-Z0-9]+)/ },
]

const detectPlatform = (url) => {
  try { new URL(url) } catch { return null }
  return PLATFORM_PATTERNS.find(p => p.pattern.test(url))?.name || null
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function RangeSlider({ duration, start, end, onChange }) {
  const trackRef = useRef(null)
  const dragging = useRef(null)

  const getPercent = (val) => (val / duration) * 100

  const handleMouseDown = (handle) => (e) => {
    e.preventDefault()
    dragging.current = handle
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = useCallback((e) => {
    if (!dragging.current || !trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const val = Math.round(pct * duration)
    if (dragging.current === 'start') {
      onChange(Math.min(val, end - 120), end)
    } else {
      onChange(start, Math.max(val, start + 120))
    }
  }, [start, end, duration, onChange])

  const handleMouseUp = useCallback(() => {
    dragging.current = null
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove])

  // Touch support
  const handleTouchMove = (handle) => (e) => {
    if (!trackRef.current) return
    const touch = e.touches[0]
    const rect = trackRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width))
    const val = Math.round(pct * duration)
    if (handle === 'start') onChange(Math.min(val, end - 120), end)
    else onChange(start, Math.max(val, start + 120))
  }

  return (
    <div className="py-4">
      <div ref={trackRef} className="relative h-2 bg-gray-200 rounded-full mx-3">
        {/* Selected range */}
        <div
          className="absolute h-2 bg-primary rounded-full"
          style={{ left: `${getPercent(start)}%`, right: `${100 - getPercent(end)}%` }}
        />
        {/* Start handle */}
        <div
          className="absolute w-5 h-5 bg-white border-2 border-primary rounded-full shadow-md cursor-grab active:cursor-grabbing -translate-y-1.5 -translate-x-2.5 touch-none"
          style={{ left: `${getPercent(start)}%` }}
          onMouseDown={handleMouseDown('start')}
          onTouchMove={handleTouchMove('start')}
        />
        {/* End handle */}
        <div
          className="absolute w-5 h-5 bg-white border-2 border-primary rounded-full shadow-md cursor-grab active:cursor-grabbing -translate-y-1.5 -translate-x-2.5 touch-none"
          style={{ left: `${getPercent(end)}%` }}
          onMouseDown={handleMouseDown('end')}
          onTouchMove={handleTouchMove('end')}
        />
      </div>
      <div className="flex justify-between mt-3">
        <span className="text-xs font-mono text-text-muted">{formatTime(start)}</span>
        <span className="text-xs font-mono text-text-muted">{formatTime(end)}</span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { client } = useAuth()

  const [url, setUrl] = useState('')
  const [style, setStyle] = useState('blur')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [videoInfo, setVideoInfo] = useState(null)
  const [infoLoading, setInfoLoading] = useState(false)
  const [infoError, setInfoError] = useState('')
  const [rangeStart, setRangeStart] = useState(0)
  const [rangeEnd, setRangeEnd] = useState(0)

  const debounceRef = useRef(null)

  const clientPlan = client?.plan || 'trial'
  const allowedPlatforms = PLATFORM_TIERS[clientPlan] || PLATFORM_TIERS['trial']
  const hoursUsed = parseFloat(client?.usage_hours_used || 0)
  const hoursLimit = parseFloat(client?.usage_hours_limit || 0)
  const hoursRemaining = Math.max(hoursLimit - hoursUsed, 0)

  const selectedDuration = rangeEnd - rangeStart
  const selectedHours = selectedDuration / 3600
  const hasEnoughHours = selectedHours <= hoursRemaining

  const getRangeStatus = () => {
    if (selectedDuration <= 120) return 'too-short'
    if (selectedDuration <= 300) return 'warning'
    return 'ok'
  }

  const rangeStatus = videoInfo ? getRangeStatus() : null
  const canSubmit = videoInfo && rangeStatus !== 'too-short' && hasEnoughHours && !infoLoading

  // Auto-fetch video info on URL change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setVideoInfo(null)
    setInfoError('')
    setError('')

    if (!url || url.length < 10) return

    const platform = detectPlatform(url)
    if (!platform) {
      setInfoError('URL not recognised. Please use a supported platform link.')
      return
    }

    if (!allowedPlatforms.includes(platform)) {
      setInfoError(`${platform.charAt(0).toUpperCase() + platform.slice(1)} is not available on your ${clientPlan} plan. Upgrade to unlock it.`)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setInfoLoading(true)
      setInfoError('')
      try {
        const { data } = await getVideoInfo(url)
        setVideoInfo(data)
        setRangeStart(0)
        setRangeEnd(data.duration || 0)
      } catch (e) {
        setInfoError(e.response?.data?.error || 'Could not fetch video info. Please check the URL.')
        setVideoInfo(null)
      } finally {
        setInfoLoading(false)
      }
    }, 800)

    return () => clearTimeout(debounceRef.current)
  }, [url])

  const handleRangeChange = (start, end) => {
    setRangeStart(start)
    setRangeEnd(end)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError('')

    const result = await dispatch(startProcessing({
      videoUrl: url,
      clientId: client.id,
      style,
      startSeconds: rangeStart,
      endSeconds: rangeEnd
    }))

    setSubmitting(false)

    if (result.payload?.video_id) {
      navigate(`/processing/${result.payload.video_id}`)
    } else {
      setError(result.payload || 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Create Shorts</h1>
        <p className="text-text-muted mt-1 text-sm">Paste a video link and we'll find the best moments automatically.</p>
      </div>

      <UsageBar />

      {!client?.usage_hours_limit && (
        <div className="mt-4 bg-bg-secondary border border-blue-100 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-text-primary">Choose a plan to get started</p>
            <p className="text-sm text-text-muted mt-0.5">Your account is free but you need a plan to process videos.</p>
            <Link to="/pricing" className="text-sm font-semibold text-primary hover:underline mt-2 inline-block">View plans →</Link>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* URL Input */}
        <div>
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2 block">Video URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input-field text-base"
            placeholder="https://youtu.be/..."
          />
          {/* Platform error */}
          {infoError && !infoLoading && (
            <p className="text-xs text-error mt-1.5 flex items-center gap-1">
              <AlertCircle size={12} /> {infoError}
            </p>
          )}
        </div>

        {/* Video info skeleton */}
        {infoLoading && (
          <div className="card p-4 animate-pulse">
            <div className="flex gap-3">
              <div className="w-24 h-16 bg-gray-200 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-100 rounded-full" />
            <div className="flex justify-between mt-3">
              <div className="h-3 bg-gray-100 rounded w-12" />
              <div className="h-3 bg-gray-100 rounded w-12" />
            </div>
          </div>
        )}

        {/* Video info card */}
        {videoInfo && !infoLoading && (
          <div className="card p-4 space-y-4">
            {/* Thumbnail + title */}
            <div className="flex gap-3">
              {videoInfo.thumbnail && (
                <img
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  className="w-24 h-16 object-cover rounded-lg shrink-0 bg-gray-100"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary text-sm leading-tight line-clamp-2">{videoInfo.title}</p>
                <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                  <Clock size={11} />
                  {formatTime(videoInfo.duration)} total
                </p>
              </div>
            </div>

            {/* Time range slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Select range</label>
                <span className="text-xs font-mono text-primary font-semibold">
                  {formatTime(selectedDuration)} selected
                </span>
              </div>
              <RangeSlider
                duration={videoInfo.duration}
                start={rangeStart}
                end={rangeEnd}
                onChange={handleRangeChange}
              />
            </div>

            {/* Usage estimate */}
            <div className={`rounded-xl p-3 text-sm ${!hasEnoughHours ? 'bg-red-50 border border-red-100' :
                rangeStatus === 'warning' ? 'bg-amber-50 border border-amber-100' :
                  'bg-green-50 border border-green-100'
              }`}>
              {!hasEnoughHours ? (
                <div>
                  <p className="font-semibold text-error text-xs">Not enough hours remaining</p>
                  <p className="text-error text-xs mt-0.5">
                    This selection uses {selectedHours.toFixed(2)} hrs but you only have {hoursRemaining.toFixed(2)} hrs left.
                    Adjust the range or <Link to="/pricing" className="underline font-semibold">upgrade your plan</Link>.
                  </p>
                </div>
              ) : rangeStatus === 'too-short' ? (
                <div>
                  <p className="font-semibold text-error text-xs">Selection too short</p>
                  <p className="text-error text-xs mt-0.5">Please select at least 2 minutes for the AI to find good clips.</p>
                </div>
              ) : rangeStatus === 'warning' ? (
                <div>
                  <p className="font-semibold text-amber-700 text-xs">Short selection</p>
                  <p className="text-amber-700 text-xs mt-0.5">
                    {selectedHours.toFixed(2)} hrs will be used. For best results, select at least 5 minutes.
                  </p>
                </div>
              ) : (
                <p className="text-success text-xs font-medium">
                  ✓ {selectedHours.toFixed(2)} hrs will be used · {hoursRemaining.toFixed(2)} hrs remaining after this
                </p>
              )}
            </div>
          </div>
        )}

        {/* Style picker */}
        <div>
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2 block">Video style</label>
          <StylePicker value={style} onChange={setStyle} />
        </div>

        {/* Global error */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-error text-sm rounded-xl p-3 flex items-center gap-2">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit || submitting || !client?.usage_hours_limit}
          className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <><Loader size={18} className="animate-spin" /> Starting...</>
          ) : (
            <><Sparkles size={18} /> Create Shorts</>
          )}
        </button>

        {/* Supported platforms */}
        <div className="mt-1">
          <p className="text-xs text-text-dim mb-1.5">
            Supported on <span className="font-semibold capitalize">{clientPlan}</span> plan:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {allowedPlatforms.filter(p => p !== 'upload').map(name => (
              <span key={name} className="text-xs bg-bg-secondary border border-blue-100 text-primary px-2 py-0.5 rounded-full font-medium capitalize">
                {name}
              </span>
            ))}
            {clientPlan !== 'pro' && (
              <Link to="/pricing" className="text-xs text-text-dim hover:text-primary transition-colors">
                + more with upgrade
              </Link>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}