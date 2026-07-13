import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAuth } from '../hooks/useAuth.js'
import { startProcessing } from '../store/videoSlice.js'
import StylePicker from '../components/StylePicker.jsx'
import UsageBar from '../components/UsageBar.jsx'
import { getVideoInfo, deleteUpload } from '../lib/api.js'
import api from '../lib/api.js'
import { AlertCircle, Sparkles, Clock, Loader, X, CheckCircle } from 'lucide-react'

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

const ACCEPTED_FORMATS = [
  'video/mp4', 'video/quicktime', 'video/x-matroska',
  'video/x-msvideo', 'video/webm', 'video/x-m4v'
]
const MAX_FILE_SIZE = 500 * 1024 * 1024

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
  const MIN_GAP = Math.min(120, duration)
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
    if (dragging.current === 'start') onChange(Math.min(val, end - MIN_GAP), end)
    else onChange(start, Math.max(val, start + MIN_GAP))
  }, [start, end, duration, onChange, MIN_GAP])

  const handleMouseUp = useCallback(() => {
    dragging.current = null
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove])

  const handleTouchMove = (handle) => (e) => {
    if (!trackRef.current) return
    const touch = e.touches[0]
    const rect = trackRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width))
    const val = Math.round(pct * duration)
    if (handle === 'start') onChange(Math.min(val, end - MIN_GAP), end)
    else onChange(start, Math.max(val, start + MIN_GAP))
  }

  return (
    <div className="py-4">
      <div ref={trackRef} className="relative h-2 bg-gray-200 rounded-full mx-3">
        <div
          className="absolute h-2 bg-primary rounded-full"
          style={{ left: `${getPercent(start)}%`, right: `${100 - getPercent(end)}%` }}
        />
        <div
          className="absolute w-5 h-5 bg-white border-2 border-primary rounded-full shadow-md cursor-grab active:cursor-grabbing -translate-y-1.5 -translate-x-2.5 touch-none"
          style={{ left: `${getPercent(start)}%` }}
          onMouseDown={handleMouseDown('start')}
          onTouchMove={handleTouchMove('start')}
        />
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

  // Mode
  const [inputMode, setInputMode] = useState('url')

  // URL mode state
  const [url, setUrl] = useState('')
  const [videoInfo, setVideoInfo] = useState(null)
  const [infoLoading, setInfoLoading] = useState(false)
  const [infoError, setInfoError] = useState('')
  const [rangeStart, setRangeStart] = useState(0)
  const [rangeEnd, setRangeEnd] = useState(0)
  const debounceRef = useRef(null)

  // Upload mode state
  const [uploadPreview, setUploadPreview] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadState, setUploadState] = useState('idle') // 'idle' | 'uploading' | 'done' | 'error'
  const [uploadedFile, setUploadedFile] = useState(null) // { upload_id, file_path, duration, title }
  const [uploadDuration, setUploadDuration] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const uploadAbortRef = useRef(null)

  // Shared state
  const [style, setStyle] = useState('blur')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const clientPlan = client?.plan || 'trial'
  const allowedPlatforms = PLATFORM_TIERS[clientPlan] || PLATFORM_TIERS['trial']
  const hoursUsed = parseFloat(client?.usage_hours_used || 0)
  const hoursLimit = parseFloat(client?.usage_hours_limit || 0)
  const hoursRemaining = Math.max(hoursLimit - hoursUsed, 0)
  const selectedDuration = rangeEnd - rangeStart
  const selectedHours = selectedDuration / 3600
  const hasEnoughHours = selectedHours <= hoursRemaining
  const hasActivePlan = client?.usage_hours_limit > 0

  const getRangeStatus = () => {
    if (selectedDuration <= 120) return 'too-short'
    if (selectedDuration <= 300) return 'warning'
    return 'ok'
  }

  const rangeStatus = (videoInfo || uploadState === 'done') ? getRangeStatus() : null

  const canSubmit = inputMode === 'upload'
    ? uploadState === 'done' && uploadDuration > 0 && rangeStatus !== 'too-short' && hasEnoughHours && !submitting
    : videoInfo && rangeStatus !== 'too-short' && hasEnoughHours && !infoLoading && !submitting

  // Auto-fetch video info on URL change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setVideoInfo(null)
    setInfoError('')
    setError('')
    if (!url || url.length < 10) return
    const platform = detectPlatform(url)
    if (!platform) { setInfoError('URL not recognised. Please use a supported platform link.'); return }
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

  // Upload handlers
  const handleFileSelect = async (file) => {
    if (!file) return
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      setError('Unsupported format. Please upload MP4, MOV, MKV, AVI, or WEBM.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Maximum size is 500MB.')
      return
    }

    setError('')
    setUploadPreview({ name: file.name, size: (file.size / (1024 * 1024)).toFixed(1) + ' MB' })
    setUploadProgress(0)
    setUploadState('uploading')
    setUploadedFile(null)
    setUploadDuration(0)

    try {
      const formData = new FormData()
      formData.append('video', file)

      const result = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        uploadAbortRef.current = xhr

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100))
        }
        xhr.onload = () => {
          if (xhr.status === 200) resolve(JSON.parse(xhr.responseText))
          else reject(new Error(JSON.parse(xhr.responseText)?.error || 'Upload failed'))
        }
        xhr.onerror = () => reject(new Error('Upload failed. Check your connection.'))
        xhr.onabort = () => reject(new Error('cancelled'))

        xhr.open('POST', `${import.meta.env.VITE_API_BASE_URL}/api/upload/video`)
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('sm_token')}`)
        xhr.send(formData)
      })

      setUploadedFile(result)
      setUploadDuration(result.duration || 0)
      setRangeStart(0)
      setRangeEnd(result.duration || 0)
      setUploadState('done')
      setUploadProgress(100)

    } catch (e) {
      if (e.message === 'cancelled') {
        setUploadState('idle')
        setUploadPreview(null)
      } else {
        setUploadState('error')
        setError(e.message || 'Upload failed. Please try again.')
      }
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)

  const clearUpload = async () => {
    // Cancel in-progress upload
    if (uploadAbortRef.current && uploadState === 'uploading') {
      uploadAbortRef.current.abort()
    }
    // Delete file from server if already uploaded
    if (uploadedFile?.upload_id) {
      try { await deleteUpload(uploadedFile.upload_id) } catch { }
    }
    setUploadPreview(null)
    setUploadProgress(0)
    setUploadState('idle')
    setUploadedFile(null)
    setUploadDuration(0)
    setRangeStart(0)
    setRangeEnd(0)
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const switchMode = (mode) => {
    setInputMode(mode)
    setError('')
    if (mode === 'url') {
      clearUpload()
    } else {
      setUrl('')
      setVideoInfo(null)
      setInfoError('')
    }
  }

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError('')

    // Upload mode
    if (inputMode === 'upload' && uploadedFile) {
      try {
        const { data } = await api.post('/api/video/process', {
          file_path: uploadedFile.file_path,
          upload_id: uploadedFile.upload_id,
          style,
          start_seconds: rangeStart,
          end_seconds: rangeEnd,
          video_info: {
            title: uploadedFile.title,
            duration: uploadedFile.duration,
            id: uploadedFile.upload_id,
          }
        })
        if (data?.video_id) {
          navigate(`/processing/${data.video_id}`)
        } else {
          setError('Something went wrong. Please try again.')
        }
      } catch (e) {
        setError(e.response?.data?.error || 'Failed to start processing.')
      } finally {
        setSubmitting(false)
      }
      return
    }

    // URL mode
    const result = await dispatch(startProcessing({
      videoUrl: url,
      clientId: client.id,
      style,
      startSeconds: rangeStart,
      endSeconds: rangeEnd,
      videoInfo
    }))
    setSubmitting(false)
    if (result.payload?.video_id) {
      navigate(`/processing/${result.payload.video_id}`)
    } else {
      setError(result.payload || 'Something went wrong. Please try again.')
    }
  }

  // Usage estimate JSX — shared between URL and upload
  const UsageEstimate = () => (
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
          <p className="text-error text-xs mt-0.5">Please select at least 2 minutes.</p>
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
  )

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Create Shorts</h1>
        <p className="text-text-muted mt-1 text-sm">Paste a link or upload a video — we'll find the best moments automatically.</p>
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

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">

        {/* Mode toggle */}
        <div className="flex bg-bg-surface rounded-xl p-1 border border-border">
          <button
            type="button"
            onClick={() => switchMode('url')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${inputMode === 'url' ? 'bg-white shadow-sm text-text-primary' : 'text-text-muted hover:text-text-primary'
              }`}
          >
            🔗 Paste URL
          </button>
          <button
            type="button"
            onClick={() => switchMode('upload')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${inputMode === 'upload' ? 'bg-white shadow-sm text-text-primary' : 'text-text-muted hover:text-text-primary'
              }`}
          >
            📁 Upload File
          </button>
        </div>

        {/* ── URL MODE ── */}
        {inputMode === 'url' && (
          <>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2 block">Video URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="input-field text-base"
                placeholder="https://youtu.be/..."
              />
              {infoError && !infoLoading && (
                <p className="text-xs text-error mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> {infoError}
                </p>
              )}
            </div>

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
              </div>
            )}

            {videoInfo && !infoLoading && (
              <div className="card p-4 space-y-4">
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
                      <Clock size={11} /> {formatTime(videoInfo.duration)} total
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Select range</label>
                    <span className="text-xs font-mono text-primary font-semibold">{formatTime(selectedDuration)} selected</span>
                  </div>
                  <RangeSlider duration={videoInfo.duration} start={rangeStart} end={rangeEnd} onChange={handleRangeChange} />
                </div>
                <UsageEstimate />
              </div>
            )}

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
          </>
        )}

        {/* ── UPLOAD MODE ── */}
        {inputMode === 'upload' && (
          <div className="space-y-4">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide block">Video File</label>

            {/* Drop zone */}
            {uploadState === 'idle' && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${isDragging ? 'border-primary bg-bg-secondary' : 'border-border bg-bg-surface hover:border-primary hover:bg-bg-secondary'
                  }`}
              >
                <div className="text-3xl mb-2">📁</div>
                <p className="text-sm font-semibold text-text-primary">
                  Drop your video here or <span className="text-primary">browse</span>
                </p>
                <p className="text-xs text-text-muted mt-1">MP4, MOV, MKV, AVI, WEBM · Max 500MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime,video/x-matroska,video/x-msvideo,video/webm,video/x-m4v,.mp4,.mov,.mkv,.avi,.webm"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                />
              </div>
            )}

            {/* Uploading / done */}
            {(uploadState === 'uploading' || uploadState === 'done') && uploadPreview && (
              <div className="border border-border rounded-xl p-4 bg-bg-surface space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 text-lg">🎬</div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{uploadPreview.name}</p>
                      <p className="text-xs text-text-muted">{uploadPreview.size}</p>
                    </div>
                  </div>
                  <button type="button" onClick={clearUpload} className="text-text-dim hover:text-error transition-colors shrink-0 p-1">
                    <X size={16} />
                  </button>
                </div>

                {uploadState === 'uploading' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-muted">Uploading to server...</span>
                      <span className="text-xs font-semibold text-primary">{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-text-dim">Please keep this page open until upload completes.</p>
                  </div>
                )}

                {uploadState === 'done' && (
                  <div className="flex items-center gap-1.5 text-success text-xs font-medium">
                    <CheckCircle size={13} />
                    Uploaded · {formatTime(uploadDuration)} duration detected
                  </div>
                )}
              </div>
            )}

            {/* Error state */}
            {uploadState === 'error' && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => { setUploadState('idle'); setUploadPreview(null); fileInputRef.current?.click() }}
                className="border-2 border-dashed border-red-200 bg-red-50 rounded-xl p-8 text-center cursor-pointer"
              >
                <p className="text-sm font-semibold text-error mb-1">Upload failed</p>
                <p className="text-xs text-text-muted">Click to try again</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime,video/x-matroska,video/x-msvideo,video/webm,video/x-m4v,.mp4,.mov,.mkv,.avi,.webm"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                />
              </div>
            )}

            {/* Range slider — only after upload complete */}
            {uploadState === 'done' && uploadDuration > 0 && (
              <div className="card p-4 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Select range</label>
                    <span className="text-xs font-mono text-primary font-semibold">{formatTime(selectedDuration)} selected</span>
                  </div>
                  <RangeSlider duration={uploadDuration} start={rangeStart} end={rangeEnd} onChange={handleRangeChange} />
                </div>
                <UsageEstimate />
              </div>
            )}
          </div>
        )}

        {/* Style picker */}
        <div>
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2 block">Video style</label>
          <StylePicker value={style} onChange={setStyle} />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-error text-sm rounded-xl p-3 flex items-center gap-2">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit || !hasActivePlan}
          className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <><Loader size={18} className="animate-spin" /> Starting...</>
          ) : (
            <><Sparkles size={18} /> Create Shorts</>
          )}
        </button>

      </form>
    </div>
  )
}