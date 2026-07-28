import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadResults } from "../store/videoSlice.js";
import { useAuth } from "../hooks/useAuth.js";
import ClipCard from "../components/ClipCard.jsx";
import {
  ArrowLeft,
  Loader,
  AlertCircle,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { checkFeedback, submitFeedback } from "../lib/api.js";

function FeedbackBanner({ videoId }) {
  const [feedback, setFeedback] = useState(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check DB on mount
  useEffect(() => {
    const check = async () => {
      try {
        const { data } = await checkFeedback(videoId);
        if (data.exists) setSubmitted(true);
      } catch (e) {}
      setChecking(false);
    };
    check();
  }, [videoId]);

  const handleFeedback = async (type) => {
    setFeedback(type);
    if (type === "good") {
      try {
        await submitFeedback(videoId, "good", null);
      } catch (e) {}
      setShowThanks(true);
      setTimeout(() => setShowThanks(false), 3000);
      setSubmitted(true);
    } else {
      setShowComment(true);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitFeedback(videoId, "bad", comment);
    } catch (e) {}
    setLoading(false);
    setShowThanks(true);
    setTimeout(() => setShowThanks(false), 3000);
    setSubmitted(true);
  };

  const handleSkip = () => {
    setSubmitted(true);
  };

  if (checking) return null;

  if (showThanks) {
    if (feedback === "good") {
      return (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center animate-in fade-in">
          <p className="text-sm font-semibold text-green-600">
            Thanks for your feedback! 🙏
          </p>
        </div>
      );
    } else if (feedback === "bad") {
      return (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-center animate-in fade-in">
          <p className="text-sm font-semibold text-amber-700">
            Got it – thanks for sharing this with us. We'll reach out shortly 🙏
          </p>
        </div>
      );
    } else {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-center animate-in fade-in">
          <p className="text-sm font-semibold text-gray-700">
            Thanks for your feedback! 🙏
          </p>
        </div>
      );
    }
  }

  if (submitted) return null;

  return (
    <div className="bg-bg-surface border border-border rounded-xl p-4 mb-6">
      {!feedback ? (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-text-primary">
            How were your clips?
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFeedback("good")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-green-50 text-success hover:bg-green-100 transition-all"
            >
              <ThumbsUp size={14} /> Great
            </button>
            <button
              onClick={() => handleFeedback("bad")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 text-error hover:bg-red-100 transition-all"
            >
              <ThumbsDown size={14} /> Not great
            </button>
          </div>
        </div>
      ) : showComment ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-text-primary">
            What went wrong?
          </p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            className="input-field text-sm resize-none"
            placeholder="Wrong clips selected, bad quality, wrong language..."
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
            >
              {loading && <Loader size={12} className="animate-spin" />}
              Send feedback
            </button>
            <button
              onClick={handleSkip}
              className="text-xs text-text-dim hover:text-text-muted transition"
            >
              Skip
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function Results() {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { client } = useAuth();
  const { clips, title, style, status, loading, error } = useSelector(
    (s) => s.video,
  );

  useEffect(() => {
    if (videoId) dispatch(loadResults(videoId));
  }, [videoId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error || status === "failed") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <AlertCircle size={40} className="text-error mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-primary mb-2">
            Something went wrong
          </h2>
          <p className="text-text-muted text-sm mb-6">
            We couldn't process this video. This sometimes happens with very
            long videos or unstable connections.
          </p>
          <Link
            to="/dashboard"
            className="btn-primary inline-flex items-center gap-2"
          >
            <RefreshCw size={16} /> Try again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 hover:bg-bg-surface rounded-xl transition-all"
        >
          <ArrowLeft size={20} className="text-text-muted" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-text-primary truncate">
            {title || "Your Clips"}
          </h1>
          <p className="text-sm text-text-muted">
            {clips.length} clips · {style} style
          </p>
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 flex items-start gap-2">
        <span className="text-amber-500 text-sm shrink-0">⚠️</span>
        <p className="text-xs text-amber-700 leading-relaxed">
          ShortMint is AI-powered and can make mistakes. Please double check the clips before sharing.
        </p>
      </div>

      {clips.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-muted">
            No clips found. Try processing the video again.
          </p>
          <Link to="/dashboard" className="btn-primary inline-block mt-4">
            Back to Dashboard
          </Link>
        </div>
      ) : (
        <>
          <FeedbackBanner videoId={videoId} />
          <div className="space-y-6">
            {clips.map((clip, i) => (
              <ClipCard key={clip.id} clip={clip} clipIndex={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
