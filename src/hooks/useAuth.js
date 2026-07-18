import { useSelector } from 'react-redux'

export const useAuth = () => {
  const { user, client, session, loading, error, initialized } = useSelector((s) => s.auth)
  return {
    user,
    client,
    session,
    loading,
    error,
    initialized,
    isAuthenticated: !!user,
    hasActivePlan: client && client.usage_hours_limit > 0,
    usagePercent: client
      ? Math.min((client.usage_hours_used / client.usage_hours_limit) * 100, 100)
      : 0,
  }
}