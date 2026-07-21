import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { PLANS } from "../lib/stripe.js";
import { createCheckoutSession } from "../lib/api.js";
import { Check, Loader, Zap, RefreshCw, ShoppingBag } from "lucide-react";

export default function Pricing() {
  const { client, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [paymentType, setPaymentType] = useState("subscription"); // 'subscription' | 'one_time'

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
          Choose how you want to pay — no surprises.
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
                    : " — never expire"}
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
        All plans include a 7-day money-back guarantee. Questions?{" "}
        <a
          href="mailto:hello@addmora.com"
          className="text-primary hover:underline"
        >
          Contact us
        </a>
      </p>
    </div>
  );
}
