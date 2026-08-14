import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { PLANS } from "../lib/stripe.js";
import { createCheckoutSession, startTrial } from "../lib/api.js";
import { Check, Loader, Zap, RefreshCw, ShoppingBag } from "lucide-react";

export default function Pricing() {
  const { client, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [paymentType, setPaymentType] = useState("subscription"); // 'subscription' | 'one_time'

  function TrialButton() {
    const [loading, setLoading] = useState(false);

    const handleTrial = async () => {
      setLoading(true);
      try {
        const { data } = await startTrial();
        window.location.href = data.checkout_url;
      } catch (e) {
        alert(e.response?.data?.error || "Something went wrong.");
        setLoading(false);
      }
    };

    return (
      <button
        onClick={handleTrial}
        disabled={loading}
        className="btn-primary text-sm py-2 px-5 whitespace-nowrap flex items-center gap-2"
      >
        {loading ? <Loader size={14} className="animate-spin" /> : null}
        Start free trial
      </button>
    );
  }

  const handleSelectPlan = async (plan) => {
    if (!isAuthenticated) {
      navigate("/signup");
      return;
    }
    setLoadingPlan(plan.id);
    try {
      const priceId =
        paymentType === "subscription"
          ? plan.monthlyPriceId
          : plan.oneTimePriceId;
      const { data } = await createCheckoutSession(priceId, paymentType);
      window.location.href = data.checkout_url;
    } catch (e) {
      alert("Could not start checkout. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-text-primary">
          Simple, honest pricing
        </h1>
        <p className="text-text-muted mt-2">
          Choose how you want to pay – no surprises.
        </p>
      </div>

      {/* Payment type toggle */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-bg-surface border border-border rounded-xl p-1 gap-1">
          <button
            onClick={() => setPaymentType("subscription")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              paymentType === "subscription"
                ? "bg-white shadow-sm text-text-primary"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <RefreshCw size={14} />
            Monthly
            <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-md font-semibold">
              Save 15%
            </span>
          </button>
          <button
            onClick={() => setPaymentType("one_time")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              paymentType === "one_time"
                ? "bg-white shadow-sm text-text-primary"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <ShoppingBag size={14} />
            One-time
          </button>
        </div>
      </div>

      {/* Payment type description */}
      <p className="text-center text-sm text-text-muted mb-8">
        {paymentType === "subscription"
          ? "🔄 Auto-renews monthly. Hours reset each month. Cancel anytime."
          : "🛍️ Pay once, use whenever. Hours never expire. Buy again when you need more."}
      </p>

      {/* Free trial banner */}
      <div className="card p-5 mb-8 border-dashed border-2 border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-bold text-text-primary">7-Day Free Trial</h2>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
              No charge for 7 days
            </span>
          </div>
          <p className="text-sm text-text-muted">
            Add your card and get instant access. Cancel before day 7 – no
            charge.
          </p>
          <ul className="mt-2 space-y-1">
            {[
              "10 hours of processing",
              "AI picks your 2–3 best clips",
              "All platforms included",
              "Cancel before day 7 – completely free",
            ].map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-sm text-text-muted"
              >
                <Check size={13} className="text-success shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="shrink-0">
          {!isAuthenticated ? (
            <button
              onClick={() => navigate("/signup")}
              className="btn-primary text-sm py-2 px-5 whitespace-nowrap"
            >
              Sign up to start trial
            </button>
          ) : client?.has_used_trial ? (
            <span className="text-xs text-text-dim">Trial already used</span>
          ) : client?.subscription_status === "active" ? (
            <span className="text-xs font-semibold text-success bg-green-50 border border-green-200 px-3 py-2 rounded-xl">
              ✓ Active plan
            </span>
          ) : (
            <TrialButton />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {PLANS.map((plan) => {
          const isCurrent = client?.plan === plan.id;
          const isPopular = plan.popular;
          const price =
            paymentType === "subscription"
              ? plan.monthlyPrice
              : plan.oneTimePrice;

          return (
            <div
              key={plan.id}
              className={`card p-6 flex flex-col relative ${isPopular ? "border-primary border-2 shadow-lg" : ""}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Zap size={11} /> Most popular
                  </span>
                </div>
              )}

              <div className="mb-5">
                <h2 className="font-bold text-text-primary text-lg">
                  {plan.name}
                </h2>
                <p className="text-text-muted text-sm mt-0.5">
                  {plan.description}
                </p>
              </div>

              <div className="mb-5">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-text-primary">
                    ${price}
                  </span>
                  <span className="text-text-muted text-sm mb-1">
                    {paymentType === "subscription" ? "/month" : " once"}
                  </span>
                </div>
                <p className="text-sm font-semibold text-primary mt-1">
                  {plan.hours} hours
                  {paymentType === "subscription"
                    ? " per month"
                    : " – never expire"}
                </p>
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-text-muted"
                  >
                    <Check size={14} className="text-success shrink-0" />
                    {f}
                  </li>
                ))}
                {paymentType === "one_time" && (
                  <li className="flex items-center gap-2 text-sm text-text-muted">
                    <Check size={14} className="text-success shrink-0" />
                    Hours never expire
                  </li>
                )}
              </ul>

              <div className="mb-4">
                <p className="text-xs text-text-muted flex items-center gap-1">
                  <Check size={12} className="text-success" />
                  All platforms included
                </p>
              </div>

              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={!!loadingPlan || isCurrent}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  isCurrent
                    ? "bg-bg-surface text-text-muted cursor-default border border-border"
                    : isPopular
                      ? "btn-primary"
                      : "btn-secondary"
                }`}
              >
                {loadingPlan === plan.id && (
                  <Loader size={15} className="animate-spin" />
                )}
                {isCurrent
                  ? "Current plan"
                  : paymentType === "subscription"
                    ? `Subscribe to ${plan.name}`
                    : `Buy ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
      <p className="text-center text-sm text-text-dim mt-8">
        Trial: cancel before day 7 – no charge. Subscriptions: cancel anytime,
        no refunds. Payment issue?{" "}
        <a
          href="mailto:hello@shorttrim.com"
          className="text-primary hover:underline"
        >
          Email us
        </a>{" "}
        and we'll sort it out fast.
      </p>
    </div>
  );
}
