import { useSelector } from "react-redux";

export const useAuth = () => {
  const { user, client, session, loading, error, initialized } = useSelector(
    (s) => s.auth,
  );

  const isAuthenticated = !!session && !!user;
  
  return {
    user,
    client,
    session,
    loading,
    error,
    initialized,
    isAuthenticated,
    hasActivePlan: client && client.usage_hours_limit > 0,
    usagePercent:
      client && client.usage_hours_limit > 0
        ? Math.min(
            (client.usage_hours_used / client.usage_hours_limit) * 100,
            100,
          )
        : 0,
  };
};
