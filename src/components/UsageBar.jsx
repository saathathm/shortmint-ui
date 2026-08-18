import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function UsageBar() {
  const { client } = useAuth();

  const subscriptionHours = parseFloat(client?.usage_hours_limit || 0);
  const creditHours = parseFloat(client?.credit_hours || 0);
  const totalHours = subscriptionHours + creditHours;
  const hoursUsed = parseFloat(client?.usage_hours_used || 0);

  if (!client || totalHours === 0) return null;

  const pct = Math.min((hoursUsed / totalHours) * 100, 100);
  const isNearLimit = pct >= 80;
  const isExhausted = pct >= 100;
  const remaining = Math.max(totalHours - hoursUsed, 0);

  const getStatusMessage = () => {
    if (isExhausted)
      return "You've used all your hours. Upgrade to keep creating Shorts.";
    if (isNearLimit)
      return `Only ${remaining.toFixed(1)} hrs left – consider upgrading before you run out.`;
    return `Your allowance is based on video length selected. Longer selections use more processing time.`;
  };

  return (
    <div
      className={`rounded-xl p-4 space-y-3 ${isExhausted ? "bg-red-50 border border-red-200" : isNearLimit ? "bg-amber-50 border border-amber-200" : "bg-bg-surface border border-border"}`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-primary">Usage</span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
              isExhausted
                ? "bg-red-100 text-error"
                : isNearLimit
                  ? "bg-amber-100 text-amber-700"
                  : "bg-bg-secondary text-primary"
            }`}
          >
            {client.plan}
          </span>
        </div>
        <span
          className={`text-xs font-semibold tabular-nums ${
            isExhausted
              ? "text-error"
              : isNearLimit
                ? "text-amber-700"
                : "text-text-muted"
          }`}
        >
          {hoursUsed.toFixed(2)} / {totalHours.toFixed(1)} hrs
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isExhausted
              ? "bg-error"
              : isNearLimit
                ? "bg-amber-400"
                : "bg-primary"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Credit hours note */}
      {creditHours > 0 && (
        <p className="text-xs text-text-dim">
          Includes {creditHours.toFixed(1)}hrs one-time credit (never expires)
          {subscriptionHours > 0 ? ` + ${subscriptionHours}hrs monthly` : ""}
        </p>
      )}

      {/* Info row */}
      <div className="flex items-start justify-between gap-3">
        <p
          className={`text-xs leading-relaxed ${
            isExhausted
              ? "text-error"
              : isNearLimit
                ? "text-amber-700"
                : "text-text-muted"
          }`}
        >
          {getStatusMessage()}
        </p>
        {(isNearLimit || isExhausted) && (
          <Link
            to="/pricing"
            className="btn-primary text-xs py-1.5 px-3 whitespace-nowrap shrink-0"
          >
            Upgrade
          </Link>
        )}
      </div>
    </div>
  );
}
