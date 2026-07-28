import { Link } from "react-router-dom";

export default function Refunds() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-text-primary mb-2">
        Refund Policy
      </h1>
      <p className="text-text-muted text-sm mb-8">Last updated: July 2026</p>

      <div className="space-y-8 text-text-muted leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">
            Our Commitment
          </h2>
          <p>
            We believe you should only pay for what you use. If you're not
            satisfied with ShortMint, you can cancel anytime and we'll refund
            the value of your unused hours.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">
            How Refunds Work
          </h2>
          <p>
            When you request a refund, we calculate how many hours you have
            remaining and refund the proportional value of those unused hours.
            For example:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-2">
            <li>You bought the Starter plan (10 hours, $29)</li>
            <li>You used 3 hours</li>
            <li>You have 7 hours remaining</li>
            <li>You receive a refund of approximately $20.30 (7/10 × $29)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">
            Subscriptions
          </h2>
          <p>
            For monthly subscriptions, you can cancel anytime from your Settings
            page. Your subscription will remain active until the end of the
            current billing period. If you'd like a refund for unused hours in
            the current period, contact us and we'll calculate and issue the
            refund.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">
            One-Time Purchases
          </h2>
          <p>
            One-time purchased hours never expire. If you'd like a refund for
            unused hours, contact us anytime and we'll refund the value of your
            remaining balance.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">
            How to Request a Refund
          </h2>
          <p>
            Email us at{" "}
            <a
              href="mailto:saadhath@addmora.com"
              className="text-primary hover:underline"
            >
              saadhath@addmora.com
            </a>{" "}
            with the email address on your account. We'll process your refund
            within 3–5 business days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">
            Questions
          </h2>
          <p>
            If you have any questions, reach out via email or use the chat on
            our site. We're happy to help.
          </p>
        </section>
      </div>
    </div>
  );
}
