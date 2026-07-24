import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.js";
import { Loader, CheckCircle, Scissors } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if this is a valid recovery session
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setValidSession(true);
      }
      setChecking(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!validSession) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-sm px-4">
          <h2 className="text-xl font-bold text-text-primary mb-2">
            Invalid or expired link
          </h2>
          <p className="text-text-muted text-sm mb-6">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <a
            href="/forgot-password"
            className="btn-primary text-sm py-2 px-5 inline-block"
          >
            Request new link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Scissors size={22} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">
            Set new password
          </h1>
          <p className="text-text-muted text-sm mt-2">
            Choose a strong password for your account.
          </p>
        </div>

        {success ? (
          <div className="card p-6 text-center">
            <CheckCircle size={36} className="text-success mx-auto mb-3" />
            <h2 className="font-bold text-text-primary mb-1">
              Password updated!
            </h2>
            <p className="text-sm text-text-muted">
              Redirecting you to login...
            </p>
          </div>
        ) : (
          <div className="card p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">
                  New password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="At least 8 characters"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="input-field"
                  placeholder="Repeat your password"
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-error bg-red-50 border border-red-100 rounded-xl p-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={16} className="animate-spin" /> Updating...
                  </>
                ) : (
                  "Update password"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
