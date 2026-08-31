import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loadSession, setSession, setClient } from './store/authSlice.js'
import { supabase } from './lib/supabase.js'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Layout from './components/Layout.jsx'

import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Processing from './pages/Processing.jsx'
import Results from './pages/Results.jsx'
import History from './pages/History.jsx'
import Settings from './pages/Settings.jsx'
import Pricing from './pages/Pricing.jsx'
import Privacy from './pages/Privacy.jsx'
import Terms from './pages/Terms.jsx'
import Refunds from './pages/Refunds.jsx'
import NotFound from './pages/NotFound.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import YoutubeToShorts from './pages/YoutubeToShorts.jsx'
import PodcastToShorts from './pages/PodcastToShorts.jsx'
import AiVideoClipping from './pages/AiVideoClipping.jsx'

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Set up listener FIRST before loadSession
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session) {
        if (event === "SIGNED_OUT") {
          localStorage.removeItem("sm_token");
          localStorage.removeItem("sm_refresh_token");
          dispatch(setSession(null));
          dispatch(setClient(null));
        }
        return;
      }

      const isGoogleUser =
        session.user.app_metadata?.provider === "google" ||
        session.user.app_metadata?.providers?.includes("google");

      if (!isGoogleUser) return;

      localStorage.setItem("sm_token", session.access_token);
      if (session.refresh_token) {
        localStorage.setItem("sm_refresh_token", session.refresh_token);
      }

      try {
        await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/google-callback`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token: session.access_token }),
          },
        );
      } catch (e) {
        console.error("Google callback error:", e);
      }

      // Load session AFTER google-callback completes for Google users
      dispatch(loadSession());
    });

    // Load session for email users only (no Google session on page load)
    dispatch(loadSession());

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Layout><Landing /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/signup" element={<Layout><Signup /></Layout>} />
        <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
        <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
        <Route path="/terms" element={<Layout><Terms /></Layout>} />
        <Route path="/refunds" element={<Layout><Refunds /></Layout>} />
        <Route path="/youtube-to-shorts" element={<Layout><YoutubeToShorts /></Layout>} />
        <Route path="/podcast-to-shorts" element={<Layout><PodcastToShorts /></Layout>} />
        <Route path="/ai-video-clipping" element={<Layout><AiVideoClipping /></Layout>} />
        <Route path="/reset-password" element={<Layout><ResetPassword /></Layout>} />
        <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/processing/:videoId" element={<ProtectedRoute><Layout><Processing /></Layout></ProtectedRoute>} />
        <Route path="/results/:videoId" element={<ProtectedRoute><Layout><Results /></Layout></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><Layout><History /></Layout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}