import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-text-primary mb-2">Privacy Policy</h1>
      <p className="text-text-muted text-sm mb-8">Last updated: July 2026</p>

      <div className="space-y-8 text-text-muted leading-relaxed">

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">1. About ShortTrim</h2>
          <p>
            ShortTrim (shorttrim.com) helps content creators turn long-form videos into short-form clips ready to post anywhere. This Privacy Policy explains how we collect, use, and protect your data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">2. Data We Collect</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>Account data:</strong> Your name and email address when you sign up.</li>
            <li><strong>Video data:</strong> Video URLs or files you submit for processing, video titles, and processing status.</li>
            <li><strong>Usage data:</strong> How many hours of video you have processed, for billing purposes.</li>
            <li><strong>Payment data:</strong> Billing is handled by Stripe. We do not store your card details – Stripe handles all payment data securely.</li>
            <li><strong>Technical data:</strong> Basic usage logs for debugging and service improvement.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">3. How We Use Your Data</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li>To provide the ShortTrim service – processing your videos and generating clips.</li>
            <li>To manage your subscription or one-time purchase and enforce usage limits.</li>
            <li>To send you important account or service emails such as welcome messages and payment confirmations.</li>
            <li>To respond to your support requests.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">4. Data Storage & Security</h2>
          <p>
            Your account data is stored securely in Supabase (EU region). Video clips are stored temporarily on our server and automatically deleted after a short period – save them locally if you need them long term. We never sell your data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">5. Data Retention</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>Video clips:</strong> Deleted automatically after 2 days – download them before then.</li>
            <li><strong>Account data:</strong> Retained until you delete your account.</li>
            <li><strong>Payment records:</strong> Retained as required by law.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">6. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal data at any time. To request full account deletion or a copy of your data, email us at{' '}
            <a href="mailto:hello@shorttrim.com" className="text-primary hover:underline">
              hello@shorttrim.com
            </a>.
          </p>
          <p className="mt-2">
            If you are based in the EU or UK, you have additional rights under GDPR including the right to data portability and the right to lodge a complaint with your local data protection authority.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">7. Third-Party Services</h2>
          <p>ShortTrim uses the following third-party services:</p>
          <ul className="space-y-2 list-disc pl-5 mt-2">
            <li><strong>Supabase</strong> – database and authentication (EU region)</li>
            <li><strong>Stripe</strong> – payment processing</li>
            <li><strong>Google Gemini API</strong> – AI transcription and video analysis</li>
            <li><strong>Resend</strong> – transactional email delivery</li>
            <li><strong>Crisp</strong> – customer support chat</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">8. Cookies</h2>
          <p>
            We use only essential cookies required for authentication – session tokens stored in your browser's local storage. We use Crisp for support chat which may set its own cookies. We do not use advertising or tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">9. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. We will notify you of significant changes by email. Continued use of the service after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">10. Contact</h2>
          <p>
            For any privacy-related questions, contact us at:{' '}
            <a href="mailto:hello@shorttrim.com" className="text-primary hover:underline">
              hello@shorttrim.com
            </a>
          </p>
        </section>

      </div>
    </div>
  )
}