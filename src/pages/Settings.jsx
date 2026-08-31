import {
  // useEffect,
  useState,
} from "react";
import {
  Link,
  // useSearchParams
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../hooks/useAuth.js";
import { refreshClient, setClient } from "../store/authSlice.js";
import { supabase } from "../lib/supabase.js";
import {
  // getYouTubeConnectUrl,
  cancelSubscription,
  updateProfile,
} from "../lib/api.js";
import {
  // Youtube,
  // Facebook,
  CheckCircle,
  // ExternalLink,
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
  // const [searchParams, setSearchParams] = useSearchParams();
  // const youtubeStatus = searchParams.get("youtube");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const providers = user?.app_metadata?.providers || [];
  const hasPassword = providers.includes("email");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(name);
      await dispatch(refreshClient());
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (e) {
      alert("Could not save profile. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setChangingPassword(true);
    try {
      // Verify current password by signing in first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (signInError) {
        setPasswordError("Current password is incorrect.");
        return;
      }

      // Update to new password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;

      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(
        err.message || "Failed to change password. Please try again.",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // const handleConnectYoutube = async () => {
  //   try {
  //     const { data } = await getYouTubeConnectUrl();
  //     window.location.href = data.auth_url;
  //   } catch {
  //     alert("Could not connect YouTube. Please try again.");
  //   }
  // };

  // const handleConnectFacebook = () => {
  //   alert("Facebook connection will be available once publishing is set up.");
  // };

  const handleCancelSubscription = async () => {
    setCancelling(true);
    setCancelError("");
    try {
      await cancelSubscription();
      setShowCancelModal(false);
      setCancelSuccess(true);

      if (isOnTrial) {
        // Trial cancel – immediate, zero hours now
        dispatch(
          setClient({
            ...client,
            usage_hours_limit: 0,
            subscription_status: "inactive",
            stripe_subscription_id: null,
            trial_ends_at: null,
            subscription_cancel_at_period_end: false,
          }),
        );
      } else {
        // Regular cancel – keep access until period end, just mark as cancelling
        dispatch(
          setClient({
            ...client,
            subscription_cancel_at_period_end: true,
          }),
        );
        // Refresh from DB to get accurate state
        await dispatch(refreshClient());
      }
    } catch (e) {
      setCancelError(
        e.response?.data?.error || "Failed to cancel. Please try again.",
      );
    } finally {
      setCancelling(false);
    }
  };

  const isSubscription =
    client?.plan_type === "subscription" &&
    !!client?.stripe_subscription_id &&
    client?.plan !== "trial" &&
    client?.subscription_status !== "inactive";

  const isCancelling =
    isSubscription && client?.subscription_cancel_at_period_end;
  const hasActivePlan =
    parseFloat(client?.usage_hours_limit || 0) +
      parseFloat(client?.credit_hours || 0) >
    0;

  const isOnTrial =
    isSubscription &&
    !!client?.trial_ends_at &&
    new Date(client.trial_ends_at) > new Date();

  const planLabels = {
    trial: "No active plan",
    starter: isOnTrial ? "Starter – Free Trial" : "Starter",
    growth: "Growth",
    pro: "Pro",
  };

  // useEffect(() => {
  //   if (youtubeStatus) {
  //     if (youtubeStatus === "connected") {
  //       dispatch(refreshClient());
  //     }
  //     setSearchParams({});
  //   }
  // }, [youtubeStatus]);

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
      {hasPassword && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={16} className="text-text-muted" />
            <h2 className="font-semibold text-text-primary">Change password</h2>
          </div>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">
                Current password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input-field"
                placeholder="Your current password"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field"
                placeholder="At least 8 characters"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="Repeat new password"
                required
              />
            </div>

            {passwordError && (
              <p className="text-xs text-error bg-red-50 border border-red-100 rounded-xl p-3">
                {passwordError}
              </p>
            )}

            {passwordSuccess && (
              <div className="flex items-center gap-2 text-success text-sm">
                <CheckCircle size={14} />
                Password changed successfully.
              </div>
            )}

            <button
              type="submit"
              disabled={changingPassword}
              className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
            >
              {changingPassword ? (
                <Loader size={14} className="animate-spin" />
              ) : null}
              Update password
            </button>
          </form>
        </div>
      )}

      {/* Connected accounts */}
      {/* <div className="card p-5">
        <h2 className="font-semibold text-text-primary mb-4">
          Connected accounts
        </h2>
        <div className="space-y-3"> */}
      {/* YouTube */}
      {/* <div className="flex items-center justify-between p-3 bg-bg-surface rounded-xl">
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
          )} */}

      {/* Facebook */}
      {/* <div className="flex items-center justify-between p-3 bg-bg-surface rounded-xl">
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
      </div> */}

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
              {(
                parseFloat(client?.usage_hours_limit || 0) +
                parseFloat(client?.credit_hours || 0)
              ).toFixed(1)}{" "}
              hours used
              {isSubscription ? " this month" : ""}
            </p>
            {parseFloat(client?.credit_hours || 0) > 0 && (
              <p className="text-xs text-text-dim mt-0.5">
                Includes {parseFloat(client.credit_hours).toFixed(1)}hrs
                one-time credit (never expires)
              </p>
            )}
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
            {hasActivePlan
              ? "Buy more"
              : client?.has_used_trial
                ? "View plans"
                : "Start trial"}
          </Link>
        </div>

        {client &&
          parseFloat(client.usage_hours_limit || 0) +
            parseFloat(client.credit_hours || 0) >
            0 && (
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all ${
                  parseFloat(client.usage_hours_used || 0) /
                    (parseFloat(client.usage_hours_limit || 0) +
                      parseFloat(client.credit_hours || 0)) >
                  0.8
                    ? "bg-error"
                    : parseFloat(client.usage_hours_used || 0) /
                          (parseFloat(client.usage_hours_limit || 0) +
                            parseFloat(client.credit_hours || 0)) >
                        0.6
                      ? "bg-amber-400"
                      : "bg-primary"
                }`}
                style={{
                  width: `${Math.min((parseFloat(client.usage_hours_used || 0) / (parseFloat(client.usage_hours_limit || 0) + parseFloat(client.credit_hours || 0))) * 100, 100)}%`,
                }}
              />
            </div>
          )}

        {client?.subscription_status === "past_due" && (
          <div className="bg-red-50 border border-red-200 text-error text-xs rounded-xl p-3 mb-3">
            ⚠️ Your last payment failed. Please update your payment method to
            keep access.
          </div>
        )}

        {isOnTrial && !isCancelling && (
          <div className="bg-blue-50 border border-blue-200 text-primary text-xs rounded-xl p-3 mb-3">
            🎁 Trial ends{" "}
            <strong>
              {new Date(client.trial_ends_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </strong>
            . Cancel before then and you won't be charged.
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
            ⚠️{" "}
            {isOnTrial
              ? "Trial cancelled – you won't be charged."
              : `Subscription cancels on ${new Date(
                  client.current_period_end || client.plan_expires_at,
                ).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}. You still have full access until then.`}
          </p>
        )}

        {cancelSuccess && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-xl p-3 mt-3">
            {isOnTrial
              ? "Your trial has been cancelled. You have not been charged."
              : "Your subscription has been cancelled. You'll keep access until the end of your billing period."}
          </div>
        )}
      </div>

      {/* Cancel modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <AlertTriangle size={32} className="text-amber-500 mx-auto mb-3" />
            <h3 className="font-bold text-center text-text-primary mb-2">
              {isOnTrial ? "Cancel free trial?" : "Cancel subscription?"}
            </h3>
            <p className="text-sm text-text-muted text-center mb-2">
              {isOnTrial
                ? "You won't be charged anything. Your access will end immediately."
                : "You'll keep access to your current plan until the end of your billing period."}
            </p>
            <p className="text-sm text-text-muted text-center mb-5">
              {isOnTrial
                ? "You have already used your free trial – to regain access you'll need to subscribe to a plan."
                : "After that, your account will be moved to the free tier with no access."}
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
