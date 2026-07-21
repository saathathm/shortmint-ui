import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useDispatch } from "react-redux";
import { refreshClient } from "../store/authSlice.js";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, initialized, client } = useAuth();
  const dispatch = useDispatch();

  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!initialized || !isAuthenticated || client) return;

    const t = setTimeout(async () => {
      const result = await dispatch(refreshClient());

      // ✅ safest check
      if (result.meta.requestStatus === "rejected") {
        setTimedOut(true);
      }
    }, 5000);

    return () => clearTimeout(t);
  }, [initialized, isAuthenticated, client, dispatch]);

  useEffect(() => {
    if (client) setTimedOut(false);
  }, [client]);

  if (!initialized || (isAuthenticated && !client && !timedOut)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (timedOut && !client) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
