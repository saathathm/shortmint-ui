import { Link } from "react-router-dom";

export default function Refunds() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-text-primary mb-2">
        Refund Policy
      </h1>
      <p className="text-text-muted text-sm mb-8">Last updated: August 2026</p>

      <div className="space-y-8 text-text-muted leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">
            Free Trial
          </h2>
          <p>
            ShortTrim offers a 7-day free trial. If you cancel before the 7-day
            trial period ends, you will not be charged anything. Once the trial
            converts to a paid subscription after 7 days, no refund is available
            for that charge.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">
            Subscriptions
          </h2>
          <p>
            All subscription payments are non-refundable. You can cancel your
            subscription at any time from your Settings page and you will retain
            access until the end of your current billing period. No partial
            refunds are issued for unused time or hours within a billing period.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">
            One-Time Purchases
          </h2>
          <p>
            One-time purchases are non-refundable. Hours purchased on a one-time
            basis never expire and remain on your account until used.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">
            Exceptions
          </h2>
          <p>
            In cases of duplicate charges or technical errors on our side,
            please contact us and we will resolve the issue promptly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Contact</h2>
          <p>
            For any billing questions, email us at{" "}
            <a
              href="mailto:hello@shorttrim.com"
              className="text-primary hover:underline"
            >
              hello@shorttrim.com
            </a>{" "}
            or use the chat on our site.
          </p>
        </section>
      </div>
    </div>
  );
}
