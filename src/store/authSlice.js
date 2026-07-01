import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../lib/supabase.js'

// Fetch client row from Supabase clients table
const fetchClientRow = async (userId) => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}

// Load current session on app start
export const loadSession = createAsyncThunk('auth/loadSession', async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) return rejectWithValue(error.message)
    if (!data.session) return null

    const { session } = data
    localStorage.setItem('sm_token', session.access_token)

    const client = await fetchClientRow(session.user.id)
    return { user: session.user, client, session }
  } catch (e) {
    return rejectWithValue(e.message)
  }
})

// Sign up with email + password
export const signUp = createAsyncThunk('auth/signUp', async ({ name, email, password }, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  })
  if (error) return rejectWithValue(error.message)
  if (!data.user) return rejectWithValue('Sign up failed. Please try again.')

  // Insert clients row - ignore duplicate key errors (Google OAuth may have already created it)
  const { error: clientError } = await supabase.from('clients').upsert({
    id: data.user.id,
    name,
    email,
    password_hash: 'managed_by_supabase_auth',
    plan: 'trial',
  }, { onConflict: 'id' })

  if (clientError) console.warn('Client upsert warning:', clientError.message)

  if (data.session) {
    localStorage.setItem('sm_token', data.session.access_token)
  }

  return { user: data.user, session: data.session }
})

// Sign in with email + password
export const signIn = createAsyncThunk('auth/signIn', async ({ email, password }, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return rejectWithValue(error.message)

  localStorage.setItem('sm_token', data.session.access_token)
  const client = await fetchClientRow(data.user.id)
  return { user: data.user, client, session: data.session }
})

// Sign in with Google
export const signInWithGoogle = createAsyncThunk('auth/signInWithGoogle', async (_, { rejectWithValue }) => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/dashboard` },
  })
  if (error) return rejectWithValue(error.message)
})

// Sign out
export const signOut = createAsyncThunk('auth/signOut', async () => {
  await supabase.auth.signOut()
  localStorage.removeItem('sm_token')
})

// Refresh client row (after plan purchase etc.)
export const refreshClient = createAsyncThunk('auth/refreshClient', async (userId, { rejectWithValue }) => {
  const client = await fetchClientRow(userId)
  if (!client) return rejectWithValue('Could not refresh client data.')
  return client
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    client: null,
    session: null,
    loading: false,
    error: null,
    initialized: false,
  },
  reducers: {
    clearError: (state) => { state.error = null },
    // Called by onAuthStateChange listener in App.jsx
    setSession: (state, action) => {
      state.user = action.payload.user
      state.session = action.payload.session
      if (action.payload.session?.access_token) {
        localStorage.setItem('sm_token', action.payload.session.access_token)
      }
    },
    setClient: (state, action) => {
      state.client = action.payload
    },
  },
  extraReducers: (builder) => {
    // loadSession
    builder.addCase(loadSession.pending, (state) => { state.loading = true })
    builder.addCase(loadSession.fulfilled, (state, action) => {
      state.loading = false
      state.initialized = true
      if (action.payload) {
        state.user = action.payload.user
        state.client = action.payload.client
        state.session = action.payload.session
      }
    })
    builder.addCase(loadSession.rejected, (state) => {
      state.loading = false
      state.initialized = true
      // Don't clear user here - network error shouldn't log user out
    })

    // signUp
    builder.addCase(signUp.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.session = action.payload.session
    })
    builder.addCase(signUp.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // signIn
    builder.addCase(signIn.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.client = action.payload.client
      state.session = action.payload.session
    })
    builder.addCase(signIn.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // signOut
    builder.addCase(signOut.fulfilled, (state) => {
      state.user = null
      state.client = null
      state.session = null
      state.initialized = true
    })

    // refreshClient
    builder.addCase(refreshClient.fulfilled, (state, action) => {
      state.client = action.payload
    })
  },
})

export const { clearError, setSession, setClient } = authSlice.actions
export default authSlice.reducer