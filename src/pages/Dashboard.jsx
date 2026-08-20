import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../hooks/useAuth.js";
import { startProcessing } from "../store/videoSlice.js";
import StylePicker from "../components/StylePicker.jsx";
import UsageBar from "../components/UsageBar.jsx";
import { getVideoInfo, deleteUpload, startTrial } from "../lib/api.js";
import api from "../lib/api.js";
import {
  AlertCircle,
  Sparkles,
  Clock,
  Loader,
  X,
  CheckCircle,
  Link2,
  Upload,
} from "lucide-react";

const PLATFORM_TIERS = {
  trial: [
    "youtube",
    "facebook",
    "instagram",
    "vimeo",
    "tiktok",
    "rumble",
    "loom",
    "dropbox",
    "upload",
  ],
  starter: [
    "youtube",
    "facebook",
    "instagram",
    "vimeo",
    "tiktok",
    "rumble",
    "loom",
    "dropbox",
    "upload",
  ],
  growth: [
    "youtube",
    "facebook",
    "instagram",
    "vimeo",
    "tiktok",
    "rumble",
    "loom",
    "dropbox",
    "upload",
  ],
  pro: [
    "youtube",
    "facebook",
    "instagram",
    "vimeo",
    "tiktok",
    "rumble",
    "loom",
    "dropbox",
    "upload",
  ],
};

const PLATFORM_PATTERNS = [
  {
    name: "youtube",
    pattern:
      /(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  },
  {
    name: "facebook",
    pattern:
      /(?:https?:\/\/)?(?:www\.|web\.|m\.)?facebook\.com\/(?:.*\/videos\/|watch\/?\?v=|reel\/|share\/r\/|share\/v\/)([0-9a-zA-Z_-]+)|(?:https?:\/\/)?fb\.watch\/([0-9a-zA-Z_-]+)/,
  },
  {
    name: "instagram",
    pattern: /instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/,
  },
  { name: "vimeo", pattern: /vimeo\.com\/(?:video\/)?(\d+)/ },
  {
    name: "tiktok",
    pattern:
      /(?:tiktok\.com\/@[\w.]+\/video\/|vm\.tiktok\.com\/|vt\.tiktok\.com\/)([A-Za-z0-9]+)/,
  },
  { name: "rumble", pattern: /rumble\.com\/(?:v|embed)\/([a-zA-Z0-9_-]+)/ },
  { name: "loom", pattern: /loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/ },
  { name: "dropbox", pattern: /dropbox\.com\/s\/([a-zA-Z0-9]+)/ },
];

const ACCEPTED_FORMATS = [
  "video/mp4",
  "video/quicktime",
  "video/x-matroska",
  "video/x-msvideo",
  "video/webm",
  "video/x-m4v",
];
const MAX_FILE_SIZE = 500 * 1024 * 1024;

const detectPlatform = (url) => {
  try {
    new URL(url);
  } catch {
    return null;
  }
  return PLATFORM_PATTERNS.find((p) => p.pattern.test(url))?.name || null;
};

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function RangeSlider({ duration, start, end, onChange }) {
  const trackRef = useRef(null);
  const dragging = useRef(null);
  const MIN_GAP = Math.min(120, duration);
  const getPercent = (val) => (val / duration) * 100;

  const handleMouseDown = (handle) => (e) => {
    e.preventDefault();
    dragging.current = handle;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!dragging.current || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const pct = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width),
      );
      const val = Math.round(pct * duration);
      if (dragging.current === "start")
        onChange(Math.min(val, end - MIN_GAP), end);
      else onChange(start, Math.max(val, start + MIN_GAP));
    },
    [start, end, duration, onChange, MIN_GAP],
  );

  const handleMouseUp = useCallback(() => {
    dragging.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const handleTouchMove = (handle) => (e) => {
    if (!trackRef.current) return;
    const touch = e.touches[0];
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(
      0,
      Math.min(1, (touch.clientX - rect.left) / rect.width),
    );
    const val = Math.round(pct * duration);
    if (handle === "start") onChange(Math.min(val, end - MIN_GAP), end);
    else onChange(start, Math.max(val, start + MIN_GAP));
  };

  return (
    <div className="py-3">
      <div
        ref={trackRef}
        className="relative h-2 bg-gray-200 rounded-full mx-3"
      >
        <div
          className="absolute h-2 bg-primary rounded-full"
          style={{
            left: `${getPercent(start)}%`,
            right: `${100 - getPercent(end)}%`,
          }}
        />
        <div
          className="absolute w-5 h-5 bg-white border-2 border-primary rounded-full shadow-md cursor-grab active:cursor-grabbing -translate-y-1.5 -translate-x-2.5 touch-none"
          style={{ left: `${getPercent(start)}%` }}
          onMouseDown={handleMouseDown("start")}
          onTouchMove={handleTouchMove("start")}
        />
        <div
          className="absolute w-5 h-5 bg-white border-2 border-primary rounded-full shadow-md cursor-grab active:cursor-grabbing -translate-y-1.5 -translate-x-2.5 touch-none"
          style={{ left: `${getPercent(end)}%` }}
          onMouseDown={handleMouseDown("end")}
          onTouchMove={handleTouchMove("end")}
        />
      </div>
      <div className="flex justify-between mt-2 px-1">
        <span className="text-xs font-mono text-text-muted">
          {formatTime(start)}
        </span>
        <span className="text-xs font-mono text-text-muted">
          {formatTime(end)}
        </span>
      </div>
    </div>
  );
}

function TrialButton() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const handleTrial = async () => {
    setLoading(true);
    setErr("");
    try {
      const { data } = await startTrial();
      window.location.href = data.checkout_url;
    } catch (e) {
      setErr(e.response?.data?.error || "Something went wrong.");
      setLoading(false);
    }
  };
  return (
    <div>
      <button
        onClick={handleTrial}
        disabled={loading}
        className="btn-primary text-sm py-2 px-4 flex items-center gap-2 whitespace-nowrap"
      >
        {loading && <Loader size={14} className="animate-spin" />}
        Start free trial
      </button>
      {err && <p className="text-xs text-error mt-1">{err}</p>}
    </div>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { client } = useAuth();
  const [searchParams] = useSearchParams();
  const trialStarted = searchParams.get("trial") === "started";

  const [inputMode, setInputMode] = useState("url");
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoError, setInfoError] = useState("");
  const [rangeStart, setRangeStart] = useState(0);
  const [rangeEnd, setRangeEnd] = useState(0);
  const debounceRef = useRef(null);

  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState("idle");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadDuration, setUploadDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const uploadAbortRef = useRef(null);

  const [style, setStyle] = useState("blur");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const clientPlan = client?.plan || "trial";
  const allowedPlatforms =
    PLATFORM_TIERS[clientPlan] || PLATFORM_TIERS["trial"];
  const hoursUsed = parseFloat(client?.usage_hours_used || 0);
  const hoursLimit =
    parseFloat(client?.usage_hours_limit || 0) +
    parseFloat(client?.credit_hours || 0);
  const hoursRemaining = Math.max(hoursLimit - hoursUsed, 0);
  const selectedDuration = rangeEnd - rangeStart;
  const selectedHours = selectedDuration / 3600;
  const hasEnoughHours = selectedHours <= hoursRemaining;
  const hasActivePlan = hoursLimit > 0;

  const getRangeStatus = () => {
    if (selectedDuration <= 120) return "too-short";
    if (selectedDuration <= 300) return "warning";
    return "ok";
  };
  const rangeStatus =
    videoInfo || uploadState === "done" ? getRangeStatus() : null;

  const canSubmit =
    inputMode === "upload"
      ? uploadState === "done" &&
        uploadDuration > 0 &&
        rangeStatus !== "too-short" &&
        hasEnoughHours &&
        !submitting
      : videoInfo &&
        rangeStatus !== "too-short" &&
        hasEnoughHours &&
        !infoLoading &&
        !submitting;

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setVideoInfo(null);
    setInfoError("");
    setError("");
    if (!url || url.length < 10) return;
    const platform = detectPlatform(url);
    if (!platform) {
      setInfoError("URL not recognised. Please use a supported platform link.");
      return;
    }
    if (!allowedPlatforms.includes(platform)) {
      setInfoError(
        `${platform.charAt(0).toUpperCase() + platform.slice(1)} is not available on your plan.`,
      );
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setInfoLoading(true);
      try {
        const { data } = await getVideoInfo(url);
        setVideoInfo(data);
        setRangeStart(0);
        setRangeEnd(data.duration || 0);
      } catch (e) {
        setInfoError(e.response?.data?.error || "Could not fetch video info.");
        setVideoInfo(null);
      } finally {
        setInfoLoading(false);
      }
    }, 800);
    return () => clearTimeout(debounceRef.current);
  }, [url]);

  const handleFileSelect = async (file) => {
    if (!file) return;
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      setError(
        "Unsupported format. Please upload MP4, MOV, MKV, AVI, or WEBM.",
      );
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File too large. Maximum size is 500MB.");
      return;
    }
    const clientDuration = await new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      const u = URL.createObjectURL(file);
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(u);
        resolve(Math.floor(video.duration));
      };
      video.onerror = () => {
        URL.revokeObjectURL(u);
        resolve(0);
      };
      video.src = u;
    });
    if (clientDuration > 0 && clientDuration < 120) {
      setError("Please upload a video longer than 2 minutes.");
      return;
    }
    setError("");
    setUploadPreview({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
    });
    setUploadProgress(0);
    setUploadState("uploading");
    setUploadedFile(null);
    setUploadDuration(0);
    try {
      const formData = new FormData();
      formData.append("video", file);
      const result = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        uploadAbortRef.current = xhr;
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable)
            setUploadProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
          else
            reject(
              new Error(JSON.parse(xhr.responseText)?.error || "Upload failed"),
            );
        };
        xhr.onerror = () =>
          reject(new Error("Upload failed. Check your connection."));
        xhr.onabort = () => reject(new Error("cancelled"));
        xhr.open(
          "POST",
          `${import.meta.env.VITE_API_BASE_URL}/api/upload/video`,
        );
        xhr.setRequestHeader(
          "Authorization",
          `Bearer ${localStorage.getItem("sm_token")}`,
        );
        xhr.send(formData);
      });
      setUploadedFile(result);
      setUploadDuration(result.duration || 0);
      setRangeStart(0);
      setRangeEnd(result.duration || 0);
      setUploadState("done");
      setUploadProgress(100);
    } catch (e) {
      if (e.message === "cancelled") {
        setUploadState("idle");
        setUploadPreview(null);
      } else {
        setUploadState("error");
        setError(e.message || "Upload failed. Please try again.");
      }
    }
  };

  const clearUpload = async () => {
    if (uploadAbortRef.current && uploadState === "uploading")
      uploadAbortRef.current.abort();
    if (uploadedFile?.upload_id) {
      try {
        await deleteUpload(uploadedFile.upload_id);
      } catch {}
    }
    setUploadPreview(null);
    setUploadProgress(0);
    setUploadState("idle");
    setUploadedFile(null);
    setUploadDuration(0);
    setRangeStart(0);
    setRangeEnd(0);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const switchMode = (mode) => {
    setInputMode(mode);
    setError("");
    if (mode === "url") clearUpload();
    else {
      setUrl("");
      setVideoInfo(null);
      setInfoError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    if (inputMode === "upload" && uploadedFile) {
      try {
        const { data } = await api.post("/api/video/process", {
          file_path: uploadedFile.file_path,
          upload_id: uploadedFile.upload_id,
          style,
          start_seconds: rangeStart,
          end_seconds: rangeEnd,
          video_info: {
            title: uploadedFile.title,
            duration: uploadedFile.duration,
            id: uploadedFile.upload_id,
          },
        });
        if (data?.video_id) {
          dispatch({
            type: "video/setUploadMeta",
            payload: { selectedDuration: rangeEnd - rangeStart, style },
          });
          navigate(`/processing/${data.video_id}`);
        } else setError("Something went wrong. Please try again.");
      } catch (e) {
        setError(e.response?.data?.error || "Failed to start processing.");
      } finally {
        setSubmitting(false);
      }
      return;
    }
    const result = await dispatch(
      startProcessing({
        videoUrl: url,
        clientId: client.id,
        style,
        startSeconds: rangeStart,
        endSeconds: rangeEnd,
        videoInfo,
      }),
    );
    setSubmitting(false);
    if (result.payload?.video_id)
      navigate(`/processing/${result.payload.video_id}`);
    else setError(result.payload || "Something went wrong. Please try again.");
  };

  const UsageEstimate = () => (
    <div
      className={`rounded-lg p-2.5 text-xs ${!hasEnoughHours ? "bg-red-50 border border-red-100" : rangeStatus === "warning" ? "bg-amber-50 border border-amber-100" : "bg-green-50 border border-green-100"}`}
    >
      {!hasEnoughHours ? (
        <p className="text-error">
          Not enough hours. This uses {selectedHours.toFixed(2)}hrs, you have{" "}
          {hoursRemaining.toFixed(2)}hrs left.{" "}
          <Link to="/pricing" className="underline font-semibold">
            Upgrade
          </Link>
        </p>
      ) : rangeStatus === "too-short" ? (
        <p className="text-error font-semibold">Select more than 2 minutes.</p>
      ) : rangeStatus === "warning" ? (
        <p className="text-amber-700">
          {selectedHours.toFixed(2)}hrs will be used. For best results select at
          least 5 minutes.
        </p>
      ) : (
        <p className="text-success font-medium">
          ✓ {selectedHours.toFixed(2)}hrs will be used ·{" "}
          {hoursRemaining.toFixed(2)}hrs remaining
        </p>
      )}
    </div>
  );

  return (
    <div className="max-w-lg mx-auto">
      {/* Trial started banner */}
      {trialStarted && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
          <CheckCircle size={16} className="text-success shrink-0" />
          <p className="text-sm text-text-primary">
            <strong>Trial active!</strong> 10 hours free, no charge until day 7.
          </p>
        </div>
      )}

      {/* No plan banners */}
      {!hasActivePlan && (
        <div className="mb-4">
          {!client?.has_used_trial ? (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-text-primary">
                  7-day free trial
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  10 hours free · no charge for 7 days
                </p>
              </div>
              <TrialButton />
            </div>
          ) : (
            <div className="bg-bg-secondary border border-blue-100 rounded-xl p-3 flex items-center justify-between gap-3">
              <p className="text-sm text-text-muted">
                Trial ended. Choose a plan to continue.
              </p>
              <Link
                to="/pricing"
                className="btn-primary text-xs py-1.5 px-3 whitespace-nowrap"
              >
                View plans
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Usage bar */}
      <div className="mb-4">
        <UsageBar />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mode toggle */}
        <div className="flex bg-bg-surface rounded-xl p-1 border border-border">
          <button
            type="button"
            onClick={() => switchMode("url")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${inputMode === "url" ? "bg-white shadow-sm text-text-primary" : "text-text-muted"}`}
          >
            <Link2 size={14} /> Paste URL
          </button>
          <button
            type="button"
            onClick={() => switchMode("upload")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${inputMode === "upload" ? "bg-white shadow-sm text-text-primary" : "text-text-muted"}`}
          >
            <Upload size={14} /> Upload File
          </button>
        </div>

        {/* URL MODE */}
        {inputMode === "url" && (
          <div className="space-y-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input-field"
              placeholder="Paste a YouTube, TikTok, Instagram link..."
            />
            {infoError && !infoLoading && (
              <p className="text-xs text-error flex items-center gap-1">
                <AlertCircle size={12} /> {infoError}
              </p>
            )}
            {infoLoading && (
              <div className="card p-3 animate-pulse flex gap-3">
                <div className="w-20 h-14 bg-gray-200 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-2 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            )}
            {videoInfo && !infoLoading && (
              <div className="card p-3 space-y-3">
                <div className="flex gap-3 items-center">
                  {videoInfo.thumbnail && (
                    <img
                      src={videoInfo.thumbnail}
                      alt={videoInfo.title}
                      className="w-20 h-14 object-cover rounded-lg shrink-0 bg-gray-100"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary text-sm leading-tight line-clamp-2">
                      {videoInfo.title}
                    </p>
                    <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                      <Clock size={11} /> {formatTime(videoInfo.duration)}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                      Range
                    </span>
                    <span className="text-xs font-mono text-primary font-semibold">
                      {formatTime(selectedDuration)}
                    </span>
                  </div>
                  <RangeSlider
                    duration={videoInfo.duration}
                    start={rangeStart}
                    end={rangeEnd}
                    onChange={(s, e) => {
                      setRangeStart(s);
                      setRangeEnd(e);
                    }}
                  />
                </div>
                <UsageEstimate />
              </div>
            )}
            {/* Supported platforms — collapsed, subtle */}
            <div className="flex flex-wrap gap-1">
              {allowedPlatforms
                .filter((p) => p !== "upload")
                .map((name) => (
                  <span
                    key={name}
                    className="text-xs bg-bg-secondary text-text-dim px-2 py-0.5 rounded-full capitalize"
                  >
                    {name}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* UPLOAD MODE */}
        {inputMode === "upload" && (
          <div className="space-y-3">
            {uploadState === "idle" && (
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFileSelect(e.dataTransfer.files[0]);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragging ? "border-primary bg-bg-secondary" : "border-border bg-bg-surface hover:border-primary"}`}
              >
                <div className="text-2xl mb-1">📁</div>
                <p className="text-sm font-semibold text-text-primary">
                  Drop video or <span className="text-primary">browse</span>
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  MP4, MOV, MKV, AVI, WEBM · Max 500MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime,video/x-matroska,video/x-msvideo,video/webm,video/x-m4v,.mp4,.mov,.mkv,.avi,.webm"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                />
              </div>
            )}
            {(uploadState === "uploading" || uploadState === "done") &&
              uploadPreview && (
                <div className="border border-border rounded-xl p-3 bg-bg-surface space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg shrink-0">🎬</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">
                          {uploadPreview.name}
                        </p>
                        <p className="text-xs text-text-muted">
                          {uploadPreview.size}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearUpload}
                      className="text-text-dim hover:text-error p-1"
                    >
                      <X size={15} />
                    </button>
                  </div>
                  {uploadState === "uploading" && (
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-xs text-text-muted">
                          Uploading...
                        </span>
                        <span className="text-xs font-semibold text-primary">
                          {uploadProgress}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {uploadState === "done" && (
                    <p className="text-xs text-success flex items-center gap-1">
                      <CheckCircle size={12} /> Uploaded ·{" "}
                      {formatTime(uploadDuration)}
                    </p>
                  )}
                </div>
              )}
            {uploadState === "error" && (
              <div
                onClick={() => {
                  setUploadState("idle");
                  setUploadPreview(null);
                  fileInputRef.current?.click();
                }}
                className="border-2 border-dashed border-red-200 bg-red-50 rounded-xl p-6 text-center cursor-pointer"
              >
                <p className="text-sm font-semibold text-error">
                  Upload failed — click to retry
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime,video/x-matroska,video/x-msvideo,video/webm,video/x-m4v,.mp4,.mov,.mkv,.avi,.webm"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                />
              </div>
            )}
            {uploadState === "done" && uploadDuration > 0 && (
              <div className="card p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                    Range
                  </span>
                  <span className="text-xs font-mono text-primary font-semibold">
                    {formatTime(selectedDuration)}
                  </span>
                </div>
                <RangeSlider
                  duration={uploadDuration}
                  start={rangeStart}
                  end={rangeEnd}
                  onChange={(s, e) => {
                    setRangeStart(s);
                    setRangeEnd(e);
                  }}
                />
                <UsageEstimate />
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-error text-sm rounded-xl p-3 flex items-center gap-2">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {/* Style picker */}
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
            Style
          </p>
          <StylePicker value={style} onChange={setStyle} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit || !hasActivePlan}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader size={17} className="animate-spin" /> Starting...
            </>
          ) : (
            <>
              <Sparkles size={17} /> Create Shorts
            </>
          )}
        </button>

        <p className="text-xs text-text-dim text-center">
          You'll receive 2–3 clips from your video.
        </p>
      </form>
    </div>
  );
}
