import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto prose prose-sm">
      <h1 className="text-3xl font-bold text-text-primary mb-2">Terms of Service</h1>
      <p className="text-text-muted text-sm mb-8">Last updated: July 2026</p>

      <div className="space-y-8 text-text-muted leading-relaxed">

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or using ShortMint ("the Service"), operated by Addmora, you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">2. Description of Service</h2>
          <p>ShortMint is an AI-powered short-form video creation tool that processes video content to identify and extract highlight clips. The Service is provided on a subscription or one-time purchase basis.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">3. Account Responsibilities</h2>
          <p>You are responsible for maintaining the security of your account credentials. You agree not to share your account with others or use the Service for any unlawful purpose. You must provide accurate information when creating your account.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">4. Acceptable Use</h2>
          <p>You agree not to use ShortMint to process content that:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Infringes on any third party's copyright or intellectual property rights</li>
            <li>Contains illegal, harmful, or abusive material</li>
            <li>Violates any applicable laws or regulations</li>
            <li>Is used to harass, threaten, or harm others</li>
          </ul>
          <p className="mt-2">You are solely responsible for the content you process through the Service and for ensuring you have the necessary rights to do so.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">5. Payments and Plans</h2>
          <p>ShortMint offers monthly subscription plans and one-time purchase plans. Subscription plans auto-renew monthly until cancelled. One-time purchases grant a fixed number of processing hours that never expire.</p>
          <p className="mt-2">All payments are processed securely through Stripe. By making a purchase, you agree to Stripe's terms of service.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">6. Refunds</h2>
          <p>We offer a 7-day money-back guarantee on all plans. If you are not satisfied with the Service, contact us within 7 days of your purchase for a full refund. See our <Link to="/refunds" className="text-primary hover:underline">Refund Policy</Link> for full details.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">7. Intellectual Property</h2>
          <p>ShortMint and its original content, features, and functionality are owned by Addmora. You retain full ownership of any content you process through the Service. We do not claim any rights over your videos or clips.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">8. Limitation of Liability</h2>
          <p>The Service is provided "as is" without warranties of any kind. Addmora shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability to you shall not exceed the amount you paid us in the 30 days prior to the claim.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">9. Termination</h2>
          <p>We reserve the right to suspend or terminate your account if you violate these Terms. You may cancel your account at any time from the Settings page.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">10. Changes to Terms</h2>
          <p>We may update these Terms from time to time. We will notify you of significant changes by email. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">11. Governing Law</h2>
          <p>These Terms are governed by the laws of Sri Lanka. Any disputes shall be resolved in the courts of Sri Lanka.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">12. Contact</h2>
          <p>For any questions about these Terms, contact us at <a href="mailto:saadhath@addmora.com" className="text-primary hover:underline">saadhath@addmora.com</a>.</p>
        </section>

      </div>
    </div>
  )
}