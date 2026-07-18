import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, initialized, client } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (initialized && isAuthenticated && !client) {
      const t = setTimeout(() => setTimedOut(true), 5000);
      return () => clearTimeout(t);
    }
  }, [initialized, isAuthenticated, client]);

  if (!initialized || (isAuthenticated && !client && !timedOut)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
