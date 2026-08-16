import { useSelector } from "react-redux";

export const useAuth = () => {
  const { user, client, session, loading, error, initialized } = useSelector(
    (s) => s.auth,
  );

  const isAuthenticated = !!session && !!user;

  const isOnTrial = !!(
    client?.trial_ends_at &&
    new Date(client.trial_ends_at) > new Date() &&
    client?.subscription_status === "active"
  );

  return {
    user,
    client,
    session,
    loading,
    error,
    initialized,
    isAuthenticated,
    isOnTrial,
    hasActivePlan:
      client &&
      parseFloat(client.usage_hours_limit || 0) +
        parseFloat(client.credit_hours || 0) >
        0,
    usagePercent: (() => {
      const total =
        parseFloat(client?.usage_hours_limit || 0) +
        parseFloat(client?.credit_hours || 0);
      const used = parseFloat(client?.usage_hours_used || 0);
      return total > 0 ? Math.min((used / total) * 100, 100) : 0;
    })(),
  };
};
