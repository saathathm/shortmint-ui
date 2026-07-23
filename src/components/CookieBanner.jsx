import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-white border border-border rounded-2xl shadow-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-text-primary mb-0.5">
            We use cookies 🍪
          </p>
          <p className="text-xs text-text-muted leading-relaxed">
            We use essential cookies to keep you logged in and improve your experience.
            See our{' '}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>{' '}
            for details.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDecline}
            className="btn-secondary text-xs py-2 px-4"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="btn-primary text-xs py-2 px-4"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}