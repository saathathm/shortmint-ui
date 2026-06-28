import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loadSession, setSession } from './store/authSlice.js'
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

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadSession())

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        dispatch(setSession({ user: session.user, session }))
        localStorage.setItem('sm_token', session.access_token)
      }
    })
    return () => subscription.unsubscribe()
  }, [dispatch])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Landing /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/signup" element={<Layout><Signup /></Layout>} />
        <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/processing/:videoId" element={<ProtectedRoute><Layout><Processing /></Layout></ProtectedRoute>} />
        <Route path="/results/:videoId" element={<ProtectedRoute><Layout><Results /></Layout></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><Layout><History /></Layout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
