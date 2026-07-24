import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase.js";
import { CheckCircle, Loader, Scissors } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Scissors size={22} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">
            Reset your password
          </h1>
          <p className="text-text-muted text-sm mt-2">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div className="card p-6 text-center">
            <CheckCircle size={36} className="text-success mx-auto mb-3" />
            <h2 className="font-bold text-text-primary mb-1">
              Check your inbox
            </h2>
            <p className="text-sm text-text-muted">
              We sent a link to <strong>{email}</strong>. Click it to set or
              reset your password.
            </p>
            <p className="text-xs text-text-dim mt-2">
              Signed up with Google? You can use this link to add a password to
              your account too.
            </p>
            <Link
              to="/login"
              className="btn-secondary text-sm py-2 px-4 inline-block mt-5"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <div className="card p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
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
                    <Loader size={16} className="animate-spin" /> Sending...
                  </>
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-text-muted mt-4">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
