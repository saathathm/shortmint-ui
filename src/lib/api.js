import axios from 'axios'

const n8n = axios.create({
  baseURL: import.meta.env.VITE_N8N_BASE_URL,
})

// Attach JWT token to every request
n8n.interceptors.request.use((config) => {
  const token = localStorage.getItem('sm_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-logout on 401
n8n.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sm_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Process a YouTube video
export const processVideo = (youtubeUrl, clientId, style) =>
  n8n.post('/webhook/process-video', {
    youtube_url: youtubeUrl,
    client_id: clientId,
    style,
  })

// Check processing status
export const checkStatus = (videoId) =>
  n8n.get(`/webhook/check-status?video_id=${videoId}`)

// Publish a clip to YouTube/Facebook
export const publishClip = (clipId, clientId, platform) =>
  n8n.post('/webhook/publish-clip', {
    clip_id: clipId,
    client_id: clientId,
    platform,
  })

// Apply custom background to a clip
export const applyCustomBg = (clipId, clientId, bgImageBase64) =>
  n8n.post('/webhook/apply-custom-bg', {
    clip_id: clipId,
    client_id: clientId,
    bg_image: bgImageBase64,
  })

export default n8n
