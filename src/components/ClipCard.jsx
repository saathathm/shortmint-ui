import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Loader,
  Sparkles,
  Copy,
  X,
  // Youtube,
  // Facebook,
} from "lucide-react";
import { updateClipField } from "../store/videoSlice.js";
import {
  //  publishClip,
  applyCustomBg,
  getBgStatus,
} from "../lib/api.js";
import { useAuth } from "../hooks/useAuth.js";

function formatDuration(seconds) {
  if (!seconds) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function ClipCard({ clip, clipIndex }) {
  const dispatch = useDispatch();
  const { client } = useAuth();
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  // const [publishingYT, setPublishingYT] = useState(false);
  // const [publishingFB, setPublishingFB] = useState(false);
  // const [publishedYT, setPublishedYT] = useState(clip.youtube_post_url);
  // const [publishedFB, setPublishedFB] = useState(clip.facebook_post_url);
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState(clip.preview_url);
  const [applyingBg, setApplyingBg] = useState(false);
  const [bgApplied, setBgApplied] = useState(false);
  // const [showLandscapeWarning, setShowLandscapeWarning] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const fileInputRef = useRef(null);
  const pollRef = useRef(null);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [promptTopText, setPromptTopText] = useState(clip.title || "");
  const [promptBottomText, setPromptBottomText] = useState("");
  const [promptSituation, setPromptSituation] = useState("");
  const [promptCopied, setPromptCopied] = useState(false);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = currentPreviewUrl || clip.preview_url;
    a.download = clip.file_name || `clip_${clipIndex + 1}.mp4`;
    a.click();
  };

  useEffect(() => {
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, []);

  // const handlePublish = async (platform) => {
  //   if (!client) return;
  //   if (platform === "youtube") setPublishingYT(true);
  //   else setPublishingFB(true);

  //   try {
  //     await publishClip(clip.id, client.id, platform);
  //     if (platform === "youtube") setPublishedYT(true);
  //     else setPublishedFB(true);
  //   } catch (e) {
  //     alert("Publishing failed. Please try again.");
  //   } finally {
  //     setPublishingYT(false);
  //     setPublishingFB(false);
  //   }
  // };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1080;
        canvas.height = 1920;
        const ctx = canvas.getContext("2d");
        const scale = Math.max(1080 / img.width, 1920 / img.height);
        const x = (1080 - img.width * scale) / 2;
        const y = (1920 - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.85);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    });
  };

  const handleBgUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !client) return;
    setApplyingBg(true);

    try {
      const compressed = await compressImage(file);

      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target.result.split(",")[1];
        try {
          await applyCustomBg(clip.id, client.id, base64);

          // Poll Supabase every 5 seconds for custom_bg_url to be set
          pollRef.current = setInterval(async () => {
            const { data } = await getBgStatus(clip.id);
            if (data?.custom_bg_url) {
              clearInterval(pollRef.current);
              setApplyingBg(false);
              setBgApplied(true);
              setSuccessMsg(true);
              setCurrentPreviewUrl(data.preview_url + "?t=" + Date.now());
              setTimeout(() => setSuccessMsg(false), 5000);
            }
          }, 5000);

          // Safety stop after 5 minutes
          setTimeout(() => {
            clearInterval(pollRef.current);
            setApplyingBg(false);
          }, 300000);
        } catch {
          alert("Could not apply background. Please try again.");
          setApplyingBg(false);
        }
      };
      reader.readAsDataURL(compressed);
    } catch {
      alert("Could not process image. Please try again.");
      setApplyingBg(false);
    }
  };

  const generatePrompt = () => {
    const situation = promptSituation.trim() || clip.description || "";

    const topSection = promptTopText.trim()
      ? `Top / top-center section: Display this text prominently and beautifully — "${promptTopText.trim()}".`
      : `Top / top-center section: Leave empty or use a subtle visual element that naturally matches the subject. No text.`;

    const bottomSection = promptBottomText.trim()
      ? `Bottom-center to bottom section: Display this text clearly — "${promptBottomText.trim()}". Make sure the text is not too close to the edge.`
      : `Bottom-center to bottom section: Leave empty or use subtle visual elements that naturally match the subject. No text.`;

    const situationLine = situation
      ? `CONTENT CONTEXT (use this to understand the subject and meaning of the design):
"${situation}"

Automatically choose the appropriate colors, shapes, patterns, illustrations, decorative elements, typography style, and overall visual appearance based on the meaning and subject of this content.`
      : `Automatically choose the colors, visual elements, and overall design based on the text provided in the top section.`;

    return `Create a 9:16 background image for overlaying a 16:9 video (to convert it into a 9:16 format).

${situationLine}

LAYOUT (strictly follow this):

${topSection}

Middle section (landscape-center): Leave this area completely empty and visually clean — no text, no objects, no important subjects, no patterns, and no design elements that would interfere with the 16:9 video overlay.

${bottomSection}

DESIGN STYLE:
Create a clean, attractive, modern background that visually matches the subject of the content.

The background should feel like a professionally designed social media background, not a cinematic scene or realistic environment.

Use simple but visually appealing colors, shapes, patterns, illustrations, gradients, textures, or decorative elements when appropriate. Automatically choose the design based on the content.

Do not create a generic wallpaper. The design should clearly feel relevant to the subject and emotion of the provided content.

Do not force a specific color palette or visual style. Make the creative decisions automatically based on the content.

Keep the design clean and balanced so the central 16:9 video remains the main focus.

Image size: 1080 x 1920 pixels (9:16 ratio)

Make it suitable for YouTube Shorts or Instagram Reels. The final composition should feel cohesive from top to bottom, with the background naturally supporting and framing the central 16:9 video area.`;
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatePrompt());
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  const isCustomStyle = clip.style === "custom";
  // const isConnectedYT = client?.youtube_access_token;
  // const isConnectedFB = client?.facebook_access_token;
  // const isPublished = clip.publish_status === "published";

  return (
    <div className="card overflow-hidden">
      {/* Video player */}
      <div
        className="relative bg-gray-100 flex items-center justify-center"
        style={{ aspectRatio: "9/16", maxHeight: "480px" }}
      >
        <video
          key={currentPreviewUrl || clip.preview_url}
          ref={videoRef}
          src={currentPreviewUrl || clip.preview_url}
          className="w-full h-full object-contain"
          onPlay={() => {
            // Pause all other videos on the page
            document.querySelectorAll("video").forEach((v) => {
              if (v !== videoRef.current) v.pause();
            });
            setPlaying(true);
          }}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          playsInline
          controls
        />

        {/* Published badge */}
        {/* {isPublished && (
          <div className="absolute top-3 left-3 bg-success text-white text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
            <CheckCircle size={12} /> Published
          </div>
        )} */}
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Timestamps */}
        <div className="text-xs font-mono text-text-muted">
          {clip.start_raw} → {clip.end_raw}
        </div>

        {/* Reason */}
        <p className="text-sm text-text-muted leading-relaxed italic">
          "{clip.reason}"
        </p>

        {/* Editable title */}
        <div>
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">
            Title
          </label>
          <input
            type="text"
            value={clip.title || ""}
            onChange={(e) =>
              dispatch(
                updateClipField({
                  clipId: clip.id,
                  field: "title",
                  value: e.target.value,
                }),
              )
            }
            className="input-field text-sm"
            placeholder="Add a title..."
          />
        </div>

        {/* Editable description */}
        <div>
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">
            Description
          </label>
          <textarea
            value={clip.description || ""}
            onChange={(e) =>
              dispatch(
                updateClipField({
                  clipId: clip.id,
                  field: "description",
                  value: e.target.value,
                }),
              )
            }
            rows={3}
            className="input-field text-sm resize-none"
            placeholder="Add a description..."
          />
        </div>

        {/* Custom style banner */}
        {isCustomStyle && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle
                size={16}
                className="text-amber-500 mt-0.5 shrink-0"
              />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  This clip has no background yet
                </p>
                {/* <p className="text-xs text-amber-700 mt-0.5">
                  You can add a custom background image, publish as landscape
                  (16:9), or download it as-is.
                </p> */}
                <p className="text-xs text-amber-700 mt-0.5">
                  Add a custom background image or download it as-is.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={applyingBg}
                className="flex items-center gap-1.5 bg-white border border-amber-300 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-all"
              >
                {applyingBg ? (
                  <Loader size={13} className="animate-spin" />
                ) : (
                  <Upload size={13} />
                )}
                {applyingBg ? "Applying..." : "Add Background"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBgUpload}
              />
              <button
                onClick={() => setShowPromptModal(true)}
                className="flex items-center gap-1.5 bg-white border border-amber-300 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-all"
              >
                <Sparkles size={13} />
                Get Background Prompt
              </button>
              {/* <button
                onClick={() => setShowLandscapeWarning(true)}
                className="text-xs font-semibold text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-all"
              >
                Publish as-is
              </button> */}
              {/* <button
                onClick={handleDownload}
                className="text-xs font-semibold text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-all"
              >
                Download as-is
              </button> */}
            </div>
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-success text-sm font-semibold">
            <CheckCircle size={16} />
            {/* Background applied successfully! Your clip is ready to publish. */}
            Background applied successfully! Your clip is ready to download.
          </div>
        )}

        {/* Landscape warning modal */}
        {/* {showLandscapeWarning && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
              <AlertTriangle
                size={32}
                className="text-amber-500 mx-auto mb-3"
              />
              <h3 className="font-bold text-center text-text-primary mb-2">
                Publishing in landscape format
              </h3>
              <p className="text-sm text-text-muted text-center mb-4">
                This clip will be published in 16:9 landscape format. For best
                results on Shorts and Reels, we recommend adding a background
                first.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLandscapeWarning(false)}
                  className="btn-secondary flex-1 text-sm py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLandscapeWarning(false);
                  }}
                  className="btn-primary flex-1 text-sm py-2"
                >
                  Publish anyway
                </button>
              </div>
            </div>
          </div>
        )} */}

        {/* Action buttons - download + publish */}
        <div className="flex flex-wrap gap-2 pt-1">
          {/* Download */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 btn-secondary text-sm py-2 px-3"
          >
            <Download size={15} />
            Download
          </button>

          {/* YouTube */}
          {/* {(!isCustomStyle || bgApplied) && (
            <button
              onClick={() => handlePublish("youtube")}
              disabled={publishingYT || publishedYT || !isConnectedYT}
              title={!isConnectedYT ? "Connect YouTube in Settings first" : ""}
              className={`flex items-center gap-1.5 text-sm py-2 px-3 rounded-xl font-semibold transition-all ${
                publishedYT
                  ? "bg-green-50 text-success border border-green-200"
                  : !isConnectedYT
                    ? "bg-bg-surface text-text-dim border border-border cursor-not-allowed"
                    : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
              }`}
            >
              {publishingYT ? (
                <Loader size={15} className="animate-spin" />
              ) : (
                <Youtube size={15} />
              )}
              {publishedYT
                ? "Published"
                : !isConnectedYT
                  ? "Connect YouTube"
                  : "YouTube"}
            </button>
          )} */}

          {/* Facebook */}
          {/* {(!isCustomStyle || bgApplied) && (
            <button
              onClick={() => handlePublish("facebook")}
              disabled={publishingFB || publishedFB || !isConnectedFB}
              title={!isConnectedFB ? "Connect Facebook in Settings first" : ""}
              className={`flex items-center gap-1.5 text-sm py-2 px-3 rounded-xl font-semibold transition-all ${
                publishedFB
                  ? "bg-green-50 text-success border border-green-200"
                  : !isConnectedFB
                    ? "bg-bg-surface text-text-dim border border-border cursor-not-allowed"
                    : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
              }`}
            >
              {publishingFB ? (
                <Loader size={15} className="animate-spin" />
              ) : (
                <Facebook size={15} />
              )}
              {publishedFB
                ? "Published"
                : !isConnectedFB
                  ? "Connect Facebook"
                  : "Facebook"}
            </button>
          )} */}
        </div>

        {/* Connect reminder */}
        {/* {(!isConnectedYT || !isConnectedFB) && (
          <p className="text-xs text-text-dim">
            <a
              href="/settings"
              className="text-primary hover:underline font-medium"
            >
              Connect your accounts
            </a>{" "}
            in Settings to publish directly.
          </p>
        )} */}
      </div>

      {/* Background Prompt Modal */}
      {showPromptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h3 className="font-bold text-text-primary">
                  Create Background
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Generate a cinematic background based on your clip's content —
                  paste the prompt into ChatGPT, Gemini, or Midjourney
                </p>
              </div>
              <button
                onClick={() => setShowPromptModal(false)}
                className="p-1.5 hover:bg-bg-surface rounded-lg transition"
              >
                <X size={18} className="text-text-muted" />
              </button>
            </div>

            {/* Fields */}
            <div className="p-5 space-y-4">
              {/* Top text */}
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">
                  Text on top{" "}
                  <span className="text-text-dim font-normal normal-case">
                    (clear to remove)
                  </span>
                </label>
                <input
                  type="text"
                  value={promptTopText}
                  onChange={(e) => setPromptTopText(e.target.value)}
                  className="input-field text-sm"
                  placeholder="Leave empty for no text on top..."
                />
              </div>

              {/* Bottom text */}
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">
                  Text on bottom{" "}
                  <span className="text-text-dim font-normal normal-case">
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  value={promptBottomText}
                  onChange={(e) => setPromptBottomText(e.target.value)}
                  className="input-field text-sm"
                  placeholder="e.g. Link in bio, Subscribe now..."
                />
              </div>

              {/* Situation */}
              {/* <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">
                  Context{" "}
                  <span className="text-text-dim font-normal normal-case">
                    (what is this clip about? — auto-filled from description)
                  </span>
                </label>
                <textarea
                  value={promptSituation}
                  onChange={(e) => setPromptSituation(e.target.value)}
                  rows={2}
                  className="input-field text-sm resize-none"
                  placeholder={
                    clip.description || "Describe what this clip is about..."
                  }
                />
                {!promptSituation.trim() && clip.description && (
                  <p className="text-xs text-text-dim mt-1">
                    Using clip description as context.
                  </p>
                )}
              </div> */}

              {/* Generated prompt preview */}
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">
                  Generated prompt
                </label>
                <div className="bg-bg-surface border border-border rounded-xl p-3 text-xs text-text-muted leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {generatePrompt()}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-border flex gap-2">
              <button
                onClick={handleCopyPrompt}
                className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm py-2.5"
              >
                {promptCopied ? (
                  <>
                    <CheckCircle size={15} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={15} /> Copy Prompt
                  </>
                )}
              </button>
              <button
                onClick={() => setShowPromptModal(false)}
                className="btn-secondary text-sm py-2.5 px-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
