import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePollStatus } from '../hooks/usePollStatus.js'

const STAGES = [
  { label: 'Downloading your video', range: [0, 20] },
  { label: 'Extracting audio', range: [20, 35] },
  { label: 'Finding the best moments', range: [35, 75] },
  { label: 'Creating your clips', range: [75, 95] },
  { label: 'Almost done', range: [95, 100] },
]

function getStageProgress(elapsed) {
  // Simulate progress over ~8 minutes (480s)
  const pct = Math.min((elapsed / 480) * 100, 98)
  const stage = STAGES.findIndex((s) => pct <= s.range[1]) 
  return { pct, stageIndex: Math.max(0, stage) }
}

export default function Processing() {
  const { videoId } = useParams()
  const navigate = useNavigate()
  const status = usePollStatus(videoId)
  const [elapsed, setElapsed] = useState(0)
  const [stageIndex, setStageIndex] = useState(0)
  const [displayPct, setDisplayPct] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((e) => {
        const next = e + 1
        const { pct, stageIndex: si } = getStageProgress(next)
        setDisplayPct(Math.round(pct))
        setStageIndex(si)
        return next
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (status === 'completed') navigate(`/results/${videoId}`)
    if (status === 'failed') navigate(`/results/${videoId}`)
  }, [status])

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-sm w-full">
        {/* Animated waveform */}
        <div className="flex items-end justify-center gap-1.5 h-16 mb-8">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="wave-bar bg-primary rounded-full"
              style={{ width: '6px', height: '100%', transformOrigin: 'bottom' }}
            />
          ))}
        </div>

        <h2 className="text-xl font-bold text-text-primary mb-1">
          {STAGES[stageIndex]?.label}…
        </h2>
        <p className="text-sm text-text-muted mb-6">
          This usually takes 5–10 minutes depending on the video length.
        </p>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-1000"
            style={{ width: `${displayPct}%` }}
          />
        </div>
        <p className="text-sm font-semibold text-primary">{displayPct}%</p>

        <p className="text-xs text-text-dim mt-6">
          You can leave this page — we'll keep working on it.<br />
          Check <a href="/history" className="text-primary hover:underline">History</a> to see when it's done.
        </p>
      </div>
    </div>
  )
}
