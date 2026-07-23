import { Link } from 'react-router-dom'

export default function Refunds() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-text-primary mb-2">Refund Policy</h1>
      <p className="text-text-muted text-sm mb-8">Last updated: July 2026</p>

      <div className="space-y-8 text-text-muted leading-relaxed">

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">7-Day Money-Back Guarantee</h2>
          <p>We stand behind ShortMint. If you're not satisfied with your purchase for any reason, contact us within 7 days of your payment and we'll issue a full refund — no questions asked.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">How to Request a Refund</h2>
          <p>Email us at <a href="mailto:saadhath@addmora.com" className="text-primary hover:underline">saadhath@addmora.com</a> with:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>The email address associated with your account</li>
            <li>Your reason for requesting a refund (optional but helpful)</li>
          </ul>
          <p className="mt-2">We'll process your refund within 3–5 business days. The refund will be returned to your original payment method.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Subscriptions</h2>
          <p>For monthly subscriptions, the 7-day guarantee applies to your most recent payment. If you cancel after 7 days, your subscription will remain active until the end of the current billing period — no further charges will be made.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">One-Time Purchases</h2>
          <p>The 7-day guarantee applies to one-time purchases as well. If you've used a significant portion of your hours, we reserve the right to issue a partial refund at our discretion.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Exceptions</h2>
          <p>Refunds will not be issued for accounts that have violated our <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Questions</h2>
          <p>If you have any questions about our refund policy, reach out via <a href="mailto:saadhath@addmora.com" className="text-primary hover:underline">saadhath@addmora.com</a> or use the chat widget on our site.</p>
        </section>

      </div>
    </div>
  )
}