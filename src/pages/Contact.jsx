import { useState } from "react";
import { sendContactMessage } from "../lib/api.js";
import { CheckCircle, Loader, Mail } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await sendContactMessage({ name, email, message });
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Mail size={22} className="text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary">Get in touch</h1>
        <p className="text-text-muted mt-2">
          Have a question or need help? Send us a message and we'll reply as
          soon as possible.
        </p>
      </div>

      {success ? (
        <div className="card p-8 text-center">
          <CheckCircle size={40} className="text-success mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-primary mb-2">
            Message sent!
          </h2>
          <p className="text-text-muted">
            Thanks for reaching out. We'll get back to you as soon as possible.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="btn-secondary text-sm py-2 px-4 mt-6"
          >
            Send another message
          </button>
        </div>
      ) : (
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">
                Email
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

            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="input-field resize-none"
                placeholder="How can we help you?"
                required
              />
              <p className="text-xs text-text-dim mt-1 text-right">
                {message.length}/2000
              </p>
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
                "Send message"
              )}
            </button>

            <p className="text-xs text-text-dim text-center">
              We typically reply within a few hours.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}