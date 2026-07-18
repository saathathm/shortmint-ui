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

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadSession())

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session) return

      const isGoogleUser = session.user.app_metadata?.provider === 'google' ||
        session.user.app_metadata?.providers?.includes('google')

      if (!isGoogleUser) return

      // Store tokens
      localStorage.setItem('sm_token', session.access_token)
      if (session.refresh_token) {
        localStorage.setItem('sm_refresh_token', session.refresh_token)
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        // Fetch client FIRST before dispatching anything
        let client = null

        const { data } = await supabase
          .from('clients')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (data) {
          client = data
        } else if (event === 'SIGNED_IN') {
          const name = session.user.user_metadata?.full_name || session.user.email
          await supabase.from('clients').upsert({
            id: session.user.id,
            name,
            email: session.user.email,
            password_hash: 'managed_by_supabase_auth',
            plan: 'trial',
          }, { onConflict: 'id' })

          const { data: newClient } = await supabase
            .from('clients')
            .select('*')
            .eq('id', session.user.id)
            .single()

          client = newClient
        }

        // Dispatch session AND client together — eliminates the null client window
        dispatch(setSession({ user: session.user, session }))
        if (client) dispatch(setClient(client))
      }
    })

    return () => subscription.unsubscribe()
  }, [dispatch])

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Layout><Landing /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/signup" element={<Layout><Signup /></Layout>} />
        <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/processing/:videoId" element={<ProtectedRoute><Layout><Processing /></Layout></ProtectedRoute>} />
        <Route path="/results/:videoId" element={<ProtectedRoute><Layout><Results /></Layout></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><Layout><History /></Layout></ProtectedRoute>} />
        <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
        <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}