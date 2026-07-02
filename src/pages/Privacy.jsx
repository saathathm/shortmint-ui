export default function Privacy() {
    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Privacy Policy</h1>
            <p className="text-text-muted text-sm mb-8">Last updated: July 2, 2026</p>

            <div className="prose space-y-8">

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">1. About ShortMint</h2>
                    <p className="text-text-muted leading-relaxed">
                        ShortMint is a product by Addmora (addmora.com). We help content creators turn long-form speech videos into short-form clips for YouTube Shorts, Instagram Reels, and Facebook Reels. This Privacy Policy explains how we collect, use, and protect your data.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">2. Data We Collect</h2>
                    <ul className="space-y-2 text-text-muted leading-relaxed list-disc pl-5">
                        <li><strong>Account data:</strong> Your name, email address, and encrypted password when you sign up.</li>
                        <li><strong>YouTube data:</strong> If you connect your YouTube account, we store your YouTube access token, refresh token, and channel ID to enable publishing on your behalf.</li>
                        <li><strong>Facebook data:</strong> If you connect your Facebook account, we store your Facebook access token and page ID to enable publishing on your behalf.</li>
                        <li><strong>Video data:</strong> YouTube URLs you submit for processing, video titles, and processing status.</li>
                        <li><strong>Usage data:</strong> How many hours of video you have processed, for billing purposes.</li>
                        <li><strong>Payment data:</strong> Billing is handled by Stripe. We do not store your card details — Stripe handles all payment data securely.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">3. How We Use Your Data</h2>
                    <ul className="space-y-2 text-text-muted leading-relaxed list-disc pl-5">
                        <li>To provide the ShortMint service — processing your videos and generating clips.</li>
                        <li>To publish clips to YouTube or Facebook on your behalf, only when you explicitly click Publish.</li>
                        <li>To manage your subscription and enforce usage limits.</li>
                        <li>To send you important account or service emails.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">4. YouTube API Services</h2>
                    <p className="text-text-muted leading-relaxed">
                        ShortMint uses the YouTube API Services. By connecting your YouTube account, you agree to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">YouTube Terms of Service</a>. We use your YouTube credentials solely to upload clips to your channel when you request it. We do not read, modify, or delete your existing YouTube content.
                    </p>
                    <p className="text-text-muted leading-relaxed mt-2">
                        Google's privacy policy is available at <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://policies.google.com/privacy</a>.
                    </p>
                    <p className="text-text-muted leading-relaxed mt-2">
                        You can revoke ShortMint's access to your Google account at any time by visiting <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Account Permissions</a>.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">5. Data Storage & Security</h2>
                    <p className="text-text-muted leading-relaxed">
                        Your data is stored securely in Supabase (EU region). Video clips are stored temporarily on our server for up to 2 days, then automatically deleted. OAuth tokens are encrypted at rest. We never sell your data to third parties.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">6. Data Retention</h2>
                    <ul className="space-y-2 text-text-muted leading-relaxed list-disc pl-5">
                        <li>Video clips: deleted automatically after 2 days - save them to Drive or local storage if needed</li>
                        <li>Account data: retained until you delete your account</li>
                        <li>OAuth tokens: deleted immediately when you disconnect your account</li>
                        <li>Payment records: retained as required by law</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">7. Your Rights</h2>
                    <p className="text-text-muted leading-relaxed">
                        You have the right to access, correct, or delete your personal data at any time. You can disconnect your YouTube or Facebook account from the Settings page. To request full account deletion, email us at <a href="mailto:saadhath@addmora.com" className="text-primary hover:underline">saadhath@addmora.com</a>.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">8. Third-Party Services</h2>
                    <p className="text-text-muted leading-relaxed">
                        ShortMint uses the following third-party services:
                    </p>
                    <ul className="space-y-2 text-text-muted leading-relaxed list-disc pl-5 mt-2">
                        <li><strong>Supabase</strong> — database and authentication</li>
                        <li><strong>Stripe</strong> — payment processing</li>
                        <li><strong>Google Gemini API</strong> — AI transcription and analysis</li>
                        <li><strong>YouTube API</strong> — publishing clips to YouTube</li>
                        <li><strong>Facebook Graph API</strong> — publishing clips to Facebook</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">9. Cookies</h2>
                    <p className="text-text-muted leading-relaxed">
                        We use only essential cookies required for authentication (session tokens stored in localStorage). We do not use tracking or advertising cookies.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-text-primary mb-3">10. Contact</h2>
                    <p className="text-text-muted leading-relaxed">
                        For any privacy-related questions, contact us at:<br />
                        <a href="mailto:saadhath@addmora.com" className="text-primary hover:underline">saadhath@addmora.com</a><br />
                        Addmora, addmora.com
                    </p>
                </section>

            </div>
        </div>
    )
}