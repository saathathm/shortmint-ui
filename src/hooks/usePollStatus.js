import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { pollStatus } from '../store/videoSlice.js'

export const usePollStatus = (videoId) => {
  const dispatch = useDispatch()
  const status = useSelector((s) => s.video.status)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!videoId || status === 'completed' || status === 'failed') return

    const poll = () => dispatch(pollStatus(videoId))
    poll() // immediate first check

    intervalRef.current = setInterval(poll, 10000)
    return () => clearInterval(intervalRef.current)
  }, [videoId, status, dispatch])

  useEffect(() => {
    if (status === 'completed' || status === 'failed') {
      clearInterval(intervalRef.current)
    }
  }, [status])

  return status
}
