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

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Load session on app start
    dispatch(loadSession())

    // Listen for auth state changes (handles Google OAuth redirect, token refresh etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        dispatch(setSession({ user: session.user, session }))
        localStorage.setItem('sm_token', session.access_token)

        // Fetch client row on sign in / token refresh
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          const { data: client } = await supabase
            .from('clients')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (client) {
            dispatch(setClient(client))
          } else if (event === 'SIGNED_IN') {
            // New Google OAuth user - create client row
            const name = session.user.user_metadata?.full_name || session.user.email
            await supabase.from('clients').upsert({
              id: session.user.id,
              name,
              email: session.user.email,
              password_hash: 'managed_by_supabase_auth',
              plan: 'trial',
              usage_hours_limit: 0,
              usage_hours_used: 0,
            }, { onConflict: 'id' })

            const { data: newClient } = await supabase
              .from('clients')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (newClient) dispatch(setClient(newClient))
          }
        }
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