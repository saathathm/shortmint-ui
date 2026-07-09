import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://shortmint.addmora.com',
})

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sm_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sm_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Video
export const processVideo = (videoUrl, clientId, style) =>
  api.post('/api/video/process', { video_url: videoUrl, client_id: clientId, style })

export const checkStatus = (videoId) =>
  api.get(`/api/video/status/${videoId}`)

export const getHistory = () =>
  api.get('/api/video/history')

export const getResults = (videoId) =>
  api.get(`/api/video/results/${videoId}`)

// Upload
export const uploadVideo = (formData) =>
  api.post('/api/upload/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

// Clips
export const publishClip = (clipId, clientId, platform) =>
  api.post('/api/clips/publish', { clip_id: clipId, client_id: clientId, platform })

export const applyCustomBg = (clipId, clientId, bgImageBase64) =>
  api.post('/api/clips/custom-bg', { clip_id: clipId, client_id: clientId, bg_image: bgImageBase64 })

export const updateClip = (clipId, fields) =>
  api.patch(`/api/clips/${clipId}`, fields)

export const getBgStatus = (clipId) =>
  api.get(`/api/clips/${clipId}/bg-status`)

// Stripe
export const createCheckoutSession = (priceId) =>
  api.post('/api/stripe/checkout', { price_id: priceId })

// Settings
export const getYouTubeConnectUrl = () =>
  api.get('/api/settings/youtube-connect-url')

export const disconnectYouTube = () =>
  api.post('/api/settings/youtube-disconnect')

export default api