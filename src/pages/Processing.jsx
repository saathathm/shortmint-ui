import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { pollStatus } from '../store/videoSlice.js'

const STAGES = [
  {
    status: 'pending',
    label: 'Getting things ready',
    detail: "We're preparing your video for processing.",
    pct: 5,
  },
  {
    status: 'downloading',
    label: 'Preparing your video',
    detail: "This can take a moment depending on the video length.",
    pct: 20,
  },
  {
    status: 'extracting',
    label: 'Understanding your content',
    detail: "We're listening and preparing it for smart analysis.",
    pct: 40,
  },
  {
    status: 'analysing',
    label: 'Finding the best moments',
    detail: "Our AI is picking the most engaging parts for you.",
    pct: 65,
  },
  {
    status: 'creating',
    label: 'Creating your clips',
    detail: "We're shaping everything into scroll-stopping videos.",
    pct: 85,
  },
  {
    status: 'completed',
    label: 'Your clips are ready 🎉',
    detail: "You can now view and download your clips.",
    pct: 100,
  },
]

const MESSAGES = [
  "Good clips take a moment 🤌",
  "We're finding moments people won't skip",
  "Almost there… this is the good part",
]

function getStage(status) {
  return STAGES.find(s => s.status === status) || STAGES[0]
}

export default function Processing() {
  const { videoId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { status, error } = useSelector(s => s.video)

  const [displayPct, setDisplayPct] = useState(5)
  const [targetPct, setTargetPct] = useState(5)
  const [messageIndex, setMessageIndex] = useState(0)

  // Poll every 5 seconds
  useEffect(() => {
    if (!videoId) return
    if (status === 'completed' || status === 'failed') return

    const poll = () => dispatch(pollStatus(videoId))
    poll()
    const interval = setInterval(poll, 5000)
    return () => clearInterval(interval)
  }, [videoId, status, dispatch])

  // Navigate when done
  useEffect(() => {
    if (status === 'completed') {
      setTimeout(() => navigate(`/results/${videoId}`), 800)
    }
  }, [status, navigate, videoId])

  // Update target progress
  useEffect(() => {
    const stage = getStage(status)
    setTargetPct(stage.pct)
  }, [status])

  // Animate progress smoothly
  useEffect(() => {
    if (displayPct < targetPct) {
      const timer = setTimeout(() => {
        setDisplayPct(prev => Math.min(prev + 1, targetPct))
      }, 20)
      return () => clearTimeout(timer)
    }
  }, [displayPct, targetPct])

  // Rotate reassurance messages
  useEffect(() => {
    if (status === 'completed' || status === 'failed') return

    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % MESSAGES.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [status])

  const stage = getStage(status)
  const isFailed = status === 'failed'

  // ❌ Failure UI (Improved)
  if (isFailed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-text-primary mb-2">
            We couldn’t finish this one
          </h2>
          <p className="text-text-muted text-sm mb-6">
            {error || "Something interrupted the process. Try again — it usually works on the second attempt."}
          </p>
          <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
            Try again
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-sm w-full px-4">

        {/* Wave animation */}
        <div className="flex items-end justify-center gap-1.5 h-12 mb-8">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="wave-bar bg-primary rounded-full"
              style={{ width: '6px', height: '100%', transformOrigin: 'bottom' }}
            />
          ))}
        </div>

        {/* Stage */}
        <h2 className="text-xl font-bold text-text-primary mb-1">
          {stage.label}
        </h2>

        <p className="text-sm text-text-muted mb-2 leading-relaxed">
          {stage.detail}
        </p>

        {/* Rotating message */}
        {status !== 'completed' && (
          <p className="text-xs text-text-dim mb-6 italic">
            {MESSAGES[messageIndex]}
          </p>
        )}

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${displayPct}%` }}
          />
        </div>

        {/* Friendly status instead of raw % */}
        <p className="text-sm font-semibold text-primary">
          {displayPct < 100 ? 'Processing…' : 'Done'}
        </p>

        {/* Time expectation */}
        {status !== 'completed' && (
          <p className="text-xs text-text-dim mt-2">
            Usually takes 2–5 minutes
          </p>
        )}

        {/* Step indicators */}
        <div className="flex justify-between mt-6 mb-6">
          {STAGES.filter(s => s.status !== 'completed').map((s) => {
            const currentIdx = STAGES.findIndex(st => st.status === status)
            const thisIdx = STAGES.findIndex(st => st.status === s.status)
            const isDone = thisIdx < currentIdx
            const isActive = s.status === status

            return (
              <div key={s.status} className="flex flex-col items-center gap-1">
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isDone ? 'bg-primary' :
                  isActive ? 'bg-primary ring-2 ring-primary ring-offset-2' :
                  'bg-gray-200'
                }`} />
              </div>
            )
          })}
        </div>

        {/* Leave reassurance */}
        <p className="text-xs text-text-dim mt-6">
          You can safely leave — we’ll keep working in the background.<br />
          Check <Link to="/history" className="text-primary hover:underline">History</Link> anytime.
        </p>

      </div>
    </div>
  )
}