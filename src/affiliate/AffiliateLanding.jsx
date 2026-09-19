import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { DollarSign, TrendingUp, Zap, RefreshCw, Shield, Clock, CheckCircle } from 'lucide-react'
import { MIN_PAYOUT } from './constants'

const earningsRows = [
  { refs: 5,  rev: 95,  earn: 28.5,  annual: 342  },
  { refs: 10, rev: 190, earn: 57,    annual: 684  },
  { refs: 25, rev: 475, earn: 142.5, annual: 1710 },
  { refs: 50, rev: 950, earn: 285,   annual: 3420 },
]

export default function AffiliateLanding() {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <Helmet>
        <title>Affiliate Program – Earn 30% Commission | ShortTrim</title>
        <meta name="description" content="Join ShortTrim's affiliate program and earn 30% recurring commission on every referral for up to 12 months. Free to join. Paid via Stripe." />
        <link rel="canonical" href="https://shorttrim.com/affiliate" />
        <meta property="og:title" content="Affiliate Program – Earn 30% Commission | ShortTrim" />
        <meta property="og:description" content="Earn 30% commission on every referral. Free to join. Paid via Stripe." />
        <meta property="og:url" content="https://shorttrim.com/affiliate" />
      </Helmet>

      {/* Nav */}
      <nav className="border-b border-border bg-bg-base/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-lg text-text-primary">ShortTrim</span>
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">Affiliates</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/affiliate/login" className="text-sm text-text-muted hover:text-text-primary transition-colors">Sign in</Link>
            <Link to="/affiliate/register" className="btn-primary text-sm px-4 py-2">Join free →</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          <DollarSign size={14} />
          Free to join · No approval needed
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-text-primary mb-6 leading-tight tracking-tight">
          Earn 30% every month.<br />
          <span className="text-primary">Forever.</span>
        </h1>
        <p className="text-lg text-text-muted max-w-2xl mx-auto mb-4 leading-relaxed">
          Refer creators to ShortTrim and earn 30% recurring commission on every payment – for up to 12 months per referral.
        </p>
        <p className="text-sm text-text-muted mb-10">
          10 referrals × $19/mo ={' '}
          <span className="font-semibold text-text-primary">$57/mo recurring</span>
          {' '}–{' '}
          <span className="font-semibold text-text-primary">$684/year</span>
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/affiliate/register" className="btn-primary px-8 py-3.5 text-base font-semibold">
            Start earning →
          </Link>
          <Link to="/affiliate/login" className="text-sm text-text-muted hover:text-text-primary transition-colors">
            Already an affiliate? <span className="text-primary font-medium">Sign in</span>
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-bg-card">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="grid grid-cols-3 divide-x divide-border text-center gap-0">
            <div className="px-6">
              <p className="text-4xl font-black text-primary">30%</p>
              <p className="text-sm text-text-muted mt-1">Commission rate</p>
            </div>
            <div className="px-6">
              <p className="text-4xl font-black text-primary">12</p>
              <p className="text-sm text-text-muted mt-1">Months recurring</p>
            </div>
            <div className="px-6">
              <p className="text-4xl font-black text-primary">${MIN_PAYOUT}</p>
              <p className="text-sm text-text-muted mt-1">Minimum payout</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-2xl font-bold mb-3">How it works</h2>
          <p className="text-text-muted">Start earning in 3 simple steps</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-10">
          {[
            { step: '01', title: 'Sign up free', desc: 'Create your affiliate account instantly and get your unique referral link. No approval, no waiting.' },
            { step: '02', title: 'Share your link', desc: 'Share with YouTubers, podcasters, and video creators via social media, email newsletters, or your blog.' },
            { step: '03', title: 'Get paid', desc: `Earn 30% on every payment. Withdraw when you reach $${MIN_PAYOUT} directly to your bank via Stripe.` },
          ].map(({ step, title, desc }) => (
            <div key={step}>
              <p className="text-5xl font-black text-primary/15 mb-3 leading-none">{step}</p>
              <h3 className="font-semibold text-base mb-2">{title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why ShortTrim */}
      <section className="bg-bg-card border-y border-border py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold mb-3">Why ShortTrim Affiliates?</h2>
            <p className="text-text-muted">Built for real earnings, not just referral credits</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Zap, title: 'Instant tracking', desc: 'See commissions credited in real time the moment your referrals pay.' },
              { icon: RefreshCw, title: 'Recurring income', desc: 'Earn month after month for up to 12 months on each referral subscription.' },
              { icon: Shield, title: 'Full transparency', desc: 'Real-time dashboard with complete visibility into earnings and payouts.' },
              { icon: Clock, title: 'Reliable payouts', desc: 'Paid via Stripe Connect directly to your bank. No delays, no excuses.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1.5">{title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings calculator */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-2xl font-bold mb-3">What can you earn?</h2>
          <p className="text-text-muted">Based on ShortTrim's Starter plan at $19/month</p>
        </div>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-surface border-b border-border">
                <tr>
                  {['Referrals', 'Monthly revenue', 'Your 30%', 'Annual earnings'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {earningsRows.map(({ refs, rev, earn, annual }) => (
                  <tr key={refs} className="border-b border-border last:border-0 hover:bg-bg-surface/60 transition-colors">
                    <td className="px-6 py-4 font-medium">{refs} creators</td>
                    <td className="px-6 py-4 text-text-muted">${rev}/mo</td>
                    <td className="px-6 py-4 font-semibold text-primary">${earn}/mo</td>
                    <td className="px-6 py-4 font-bold text-text-primary">${annual}/yr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="px-6 py-3 text-xs text-text-muted bg-bg-surface border-t border-border">
            Based on 12 months of recurring commissions per referral. Actual results may vary.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary py-20 px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to start earning?</h2>
        <p className="text-white/70 mb-10 text-lg">Free to join. No approval. Start sharing in minutes.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link
            to="/affiliate/register"
            className="bg-white text-primary font-semibold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-colors text-base"
          >
            Create your affiliate account →
          </Link>
          <Link to="/affiliate/login" className="text-white/80 hover:text-white text-sm transition-colors underline underline-offset-4">
            Already have an account? Sign in
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {['Free to join', 'No approval needed', 'Paid via Stripe', '$3 minimum payout'].map((item) => (
            <div key={item} className="flex items-center gap-1.5 text-white/80 text-sm">
              <CheckCircle size={14} className="text-white/50" />
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
