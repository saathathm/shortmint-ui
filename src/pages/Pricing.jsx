import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { PLANS } from '../lib/stripe.js'
import { createCheckoutSession } from '../lib/api.js'
import { Check, Loader, Zap } from 'lucide-react'

export default function Pricing() {
  const { client, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [loadingPlan, setLoadingPlan] = useState(null)

  const handleSelectPlan = async (plan) => {
    if (!isAuthenticated) { navigate('/signup'); return }
    setLoadingPlan(plan.id)
    try {
      const { data } = await createCheckoutSession(plan.priceId)
      window.location.href = data.checkout_url
    } catch (e) {
      alert('Could not start checkout. Please try again.')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-text-primary">Simple, honest pricing</h1>
        <p className="text-text-muted mt-2">Pay for what you use. Cancel anytime.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {PLANS.map((plan) => {
          const isCurrent = client?.plan === plan.id
          const isPopular = plan.popular

          return (
            <div
              key={plan.id}
              className={`card p-6 flex flex-col relative ${isPopular ? 'border-primary border-2 shadow-lg' : ''}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Zap size={11} /> Most popular
                  </span>
                </div>
              )}

              <div className="mb-5">
                <h2 className="font-bold text-text-primary text-lg">{plan.name}</h2>
                <p className="text-text-muted text-sm mt-0.5">{plan.description}</p>
              </div>

              <div className="mb-5">
                <span className="text-4xl font-extrabold text-text-primary">${plan.price}</span>
                <span className="text-text-muted text-sm">/month</span>
                <p className="text-sm font-semibold text-primary mt-1">{plan.hours} hours of video per month</p>
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text-muted">
                    <Check size={14} className="text-success shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mb-4">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Platforms</p>
                <div className="flex flex-wrap gap-1">
                  {plan.platforms.map(p => (
                    <span key={p} className="text-xs bg-bg-surface border border-border text-text-muted px-2 py-0.5 rounded-full">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={!!loadingPlan || isCurrent}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${isCurrent
                  ? 'bg-bg-surface text-text-muted cursor-default border border-border'
                  : isPopular
                    ? 'btn-primary'
                    : 'btn-secondary'
                  }`}
              >
                {loadingPlan === plan.id && <Loader size={15} className="animate-spin" />}
                {isCurrent ? 'Current plan' : `Get ${plan.name}`}
              </button>
            </div>
          )
        })}
      </div>

      <p className="text-center text-sm text-text-dim mt-8">
        All plans include a 7-day money-back guarantee. Questions?{' '}
        <a href="mailto:hello@addmora.com" className="text-primary hover:underline">Contact us</a>
      </p>
    </div>
  )
}
