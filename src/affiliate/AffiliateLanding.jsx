import { Link } from 'react-router-dom'
import { DollarSign, Users, TrendingUp, Zap } from 'lucide-react'

export default function AffiliateLanding() {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Link to="/" className="font-bold text-lg text-primary">ShortTrim</Link>
        <div className="flex items-center gap-3">
          <Link to="/affiliate/login" className="text-sm text-text-muted hover:text-text-primary transition-colors">Sign in</Link>
          <Link to="/affiliate/register" className="btn-primary text-sm px-4 py-2">Join affiliate program</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          <DollarSign size={14} />
          Earn 30% recurring commission
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-6 leading-tight">
          Refer creators.<br />Earn every month.
        </h1>
        <p className="text-lg text-text-muted max-w-2xl mx-auto mb-10">
          Join the ShortTrim affiliate program. Earn 30% of every payment your referrals make — for up to 12 months on subscriptions and once on one-time purchases.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/affiliate/register" className="btn-primary px-8 py-3 text-base font-semibold">
            Start earning →
          </Link>
          <Link to="/affiliate/login" className="text-sm text-text-muted hover:text-text-primary underline underline-offset-4 transition-colors">
            Already an affiliate? Sign in
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: DollarSign, label: '30% commission', desc: 'On every payment from your referrals' },
            { icon: TrendingUp, label: 'Up to 12 months', desc: 'Recurring commission on subscriptions' },
            { icon: Zap, label: '$50 minimum payout', desc: 'Paid via Stripe Connect to your bank' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="card p-6 text-center">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Icon size={20} className="text-primary" />
              </div>
              <p className="font-semibold text-text-primary mb-1">{label}</p>
              <p className="text-sm text-text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-center mb-10">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Sign up free', desc: 'Create your affiliate account and get your unique referral link instantly.' },
            { step: '2', title: 'Share your link', desc: 'Share your link with creators, YouTubers, and podcasters in your audience.' },
            { step: '3', title: 'Get paid', desc: 'Earn 30% on every payment. Withdraw when you reach $50 via Stripe.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">{step}</div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bg-card border-t border-border py-16 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to start earning?</h2>
        <p className="text-text-muted mb-8">Free to join. No approval process. Start sharing in minutes.</p>
        <Link to="/affiliate/register" className="btn-primary px-8 py-3 text-base font-semibold">
          Create your affiliate account →
        </Link>
      </section>
    </div>
  )
}
