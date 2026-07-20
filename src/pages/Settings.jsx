import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../hooks/useAuth.js";
import { refreshClient } from "../store/authSlice.js";
import { supabase } from "../lib/supabase.js";
import { getYouTubeConnectUrl, cancelSubscription } from "../lib/api.js";
import {
  Youtube,
  Facebook,
  CheckCircle,
  ExternalLink,
  User,
  Lock,
  Loader,
  AlertTriangle,
} from "lucide-react";

export default function Settings() {
  const { user, client } = useAuth();
  const dispatch = useDispatch();
  const [savingProfile, setSavingProfile] = useState(false);
  const [name, setName] = useState(client?.name || "");
  const [profileSaved, setProfileSaved] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [pwSent, setPwSent] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const youtubeStatus = searchParams.get("youtube");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    await supabase.from("clients").update({ name }).eq("id", user.id);
    await dispatch(refreshClient());
    setSavingProfile(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handlePasswordReset = async () => {
    setChangingPassword(true);
    await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/settings`,
    });
    setChangingPassword(false);
    setPwSent(true);
  };

  const handleConnectYoutube = async () => {
    try {
      const { data } = await getYouTubeConnectUrl();
      window.location.href = data.auth_url;
    } catch {
      alert("Could not connect YouTube. Please try again.");
    }
  };

  const handleConnectFacebook = () => {
    alert("Facebook connection will be available once publishing is set up.");
  };

  const handleCancelSubscription = async () => {
    setCancelling(true);
    setCancelError("");
    try {
      await cancelSubscription();
      setCancelSuccess(true);
      setShowCancelModal(false);
      await dispatch(refreshClient());
    } catch (e) {
      setCancelError(
        e.response?.data?.error || "Failed to cancel. Please try again.",
      );
    } finally {
      setCancelling(false);
    }
  };

  const planLabels = {
    trial: "Free Trial",
    starter: "Starter",
    growth: "Growth",
    pro: "Pro",
  };

  const isSubscription =
    client?.plan_type === "subscription" &&
    !!client?.stripe_subscription_id &&
    client?.plan !== "trial";

  const isCancelling =
    isSubscription && client?.subscription_cancel_at_period_end;
  const hasActivePlan = client?.plan && client.plan !== "trial";

  useEffect(() => {
    if (youtubeStatus) {
      if (youtubeStatus === "connected") {
        dispatch(refreshClient());
      }
      setSearchParams({});
    }
  }, [youtubeStatus]);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Settings</h1>

      {/* Profile */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <User size={16} className="text-text-muted" />
          <h2 className="font-semibold text-text-primary">Profile</h2>
        </div>
        <form onSubmit={handleSaveProfile} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="input-field opacity-60 cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
          >
            {savingProfile ? (
              <Loader size={14} className="animate-spin" />
            ) : null}
            {profileSaved ? "✓ Saved" : "Save changes"}
          </button>
        </form>
      </div>

      {/* Password */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={16} className="text-text-muted" />
          <h2 className="font-semibold text-text-primary">Password</h2>
        </div>
        {pwSent ? (
          <div className="flex items-center gap-2 text-success text-sm">
            <CheckCircle size={16} />
            Password reset link sent to {user?.email}
          </div>
        ) : (
          <button
            onClick={handlePasswordReset}
            disabled={changingPassword}
            className="btn-secondary text-sm py-2 flex items-center gap-2"
          >
            {changingPassword ? (
              <Loader size={14} className="animate-spin" />
            ) : null}
            Send password reset email
          </button>
        )}
      </div>

      {/* Connected accounts */}
      <div className="card p-5">
        <h2 className="font-semibold text-text-primary mb-4">
          Connected accounts
        </h2>
        <div className="space-y-3">
          {/* YouTube */}
          <div className="flex items-center justify-between p-3 bg-bg-surface rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Youtube size={16} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  YouTube
                </p>
                <p className="text-xs text-text-muted">
                  {client?.youtube_channel_id ? "Connected" : "Not connected"}
                </p>
              </div>
            </div>
            {client?.youtube_channel_id ? (
              <span className="flex items-center gap-1 text-xs text-success font-medium">
                <CheckCircle size={13} /> Connected
              </span>
            ) : (
              <button
                onClick={handleConnectYoutube}
                className="btn-primary text-xs py-1.5 px-3"
              >
                Connect
              </button>
            )}
          </div>
          {youtubeStatus === "connected" && (
            <div className="bg-green-50 border border-green-200 text-success text-sm rounded-xl p-3 flex items-center gap-2">
              <CheckCircle size={16} /> YouTube connected successfully!
            </div>
          )}
          {youtubeStatus === "error" && (
            <div className="bg-red-50 border border-red-100 text-error text-sm rounded-xl p-3">
              Could not connect YouTube. Please try again.
            </div>
          )}

          {/* Facebook */}
          <div className="flex items-center justify-between p-3 bg-bg-surface rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Facebook size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  Facebook
                </p>
                <p className="text-xs text-text-muted">
                  {client?.facebook_page_id ? "Connected" : "Not connected"}
                </p>
              </div>
            </div>
            {client?.facebook_page_id ? (
              <span className="flex items-center gap-1 text-xs text-success font-medium">
                <CheckCircle size={13} /> Connected
              </span>
            ) : (
              <button
                onClick={handleConnectFacebook}
                className="btn-primary text-xs py-1.5 px-3"
              >
                Connect
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Plan */}
      <div className="card p-5">
        <h2 className="font-semibold text-text-primary mb-3">Your plan</h2>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-text-primary text-lg">
                {planLabels[client?.plan] || "Free Trial"}
              </p>
              {isSubscription && (
                <span className="text-xs bg-blue-50 text-primary border border-blue-100 px-2 py-0.5 rounded-full font-medium">
                  Monthly
                </span>
              )}
              {hasActivePlan && !isSubscription && (
                <span className="text-xs bg-bg-surface text-text-muted border border-border px-2 py-0.5 rounded-full font-medium">
                  One-time
                </span>
              )}
            </div>
            <p className="text-sm text-text-muted mt-0.5">
              {parseFloat(client?.usage_hours_used || 0).toFixed(1)} of{" "}
              {client?.usage_hours_limit || 0} hours used
              {isSubscription ? " this month" : ""}
            </p>
            {client?.plan_expires_at && isSubscription && !isCancelling && (
              <p className="text-xs text-text-dim mt-0.5">
                Renews{" "}
                {new Date(client.plan_expires_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
          <Link to="/pricing" className="btn-primary text-sm py-2 px-4">
            {hasActivePlan ? "Buy more" : "Upgrade"}
          </Link>
        </div>

        {client && client.usage_hours_limit > 0 && (
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all ${
                client.usage_hours_used / client.usage_hours_limit > 0.8
                  ? "bg-error"
                  : client.usage_hours_used / client.usage_hours_limit > 0.6
                    ? "bg-amber-400"
                    : "bg-primary"
              }`}
              style={{
                width: `${Math.min((client.usage_hours_used / client.usage_hours_limit) * 100, 100)}%`,
              }}
            />
          </div>
        )}

        {/* Cancel subscription */}
        {isSubscription && !isCancelling && !cancelSuccess && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="text-xs text-text-dim hover:text-error transition-colors mt-1"
          >
            Cancel subscription
          </button>
        )}

        {isCancelling && (
          <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
            ⚠️ Subscription cancels on{" "}
            {new Date(client.plan_expires_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            . You still have full access until then.
          </p>
        )}

        {cancelSuccess && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-xl p-3 mt-3">
            Your subscription has been cancelled. You'll keep access until the
            end of your billing period.
          </div>
        )}
      </div>

      {/* Cancel modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <AlertTriangle size={32} className="text-amber-500 mx-auto mb-3" />
            <h3 className="font-bold text-center text-text-primary mb-2">
              Cancel subscription?
            </h3>
            <p className="text-sm text-text-muted text-center mb-2">
              You'll keep access to your current plan until the end of your
              billing period.
            </p>
            <p className="text-sm text-text-muted text-center mb-5">
              After that, your account will be downgraded to the free trial.
            </p>
            {cancelError && (
              <p className="text-xs text-error text-center mb-3">
                {cancelError}
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelError("");
                }}
                className="btn-secondary flex-1 text-sm py-2"
              >
                Keep plan
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="flex-1 text-sm py-2 rounded-xl font-semibold bg-error text-white hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {cancelling && <Loader size={14} className="animate-spin" />}
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
