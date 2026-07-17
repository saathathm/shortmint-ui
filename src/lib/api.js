import axios from "axios";
import { supabase } from "./supabase";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://shortmint.addmora.com",
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sm_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && !err.config._retry) {
      err.config._retry = true;
      try {
        const { data } = await supabase.auth.refreshSession();
        if (data?.session) {
          localStorage.setItem("sm_token", data.session.access_token);
          err.config.headers.Authorization = `Bearer ${data.session.access_token}`;
          return api.request(err.config);
        }
      } catch (e) {}
      localStorage.removeItem("sm_token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

// Video
export const getVideoInfo = (url) =>
  api.get(`/api/video/info?url=${encodeURIComponent(url)}`);

export const processVideo = (
  videoUrl,
  clientId,
  style,
  startSeconds,
  endSeconds,
  videoInfo,
) =>
  api.post("/api/video/process", {
    video_url: videoUrl,
    client_id: clientId,
    style,
    start_seconds: startSeconds,
    end_seconds: endSeconds,
    video_info: videoInfo
      ? {
          title: videoInfo.title,
          duration: videoInfo.duration,
          id: videoInfo.id,
          thumbnail: videoInfo.thumbnail,
          webpage_url: videoInfo.webpage_url,
        }
      : null,
  });

export const checkStatus = (videoId) => api.get(`/api/video/status/${videoId}`);

export const getHistory = () => api.get("/api/video/history");

export const getResults = (videoId) => api.get(`/api/video/results/${videoId}`);

// Upload
export const uploadVideo = (formData) =>
  api.post("/api/upload/video", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteUpload = (uploadId) => api.delete(`/api/upload/${uploadId}`);

// Clips
export const publishClip = (clipId, clientId, platform) =>
  api.post("/api/clips/publish", {
    clip_id: clipId,
    client_id: clientId,
    platform,
  });

export const applyCustomBg = (clipId, clientId, bgImageBase64) =>
  api.post("/api/clips/custom-bg", {
    clip_id: clipId,
    client_id: clientId,
    bg_image: bgImageBase64,
  });

export const updateClip = (clipId, fields) =>
  api.patch(`/api/clips/${clipId}`, fields);

export const getBgStatus = (clipId) =>
  api.get(`/api/clips/${clipId}/bg-status`);

// Stripe
export const createCheckoutSession = (priceId) =>
  api.post("/api/stripe/checkout", { price_id: priceId });

// Settings
export const getYouTubeConnectUrl = () =>
  api.get("/api/settings/youtube-connect-url");

export const disconnectYouTube = () =>
  api.post("/api/settings/youtube-disconnect");

export default api;
