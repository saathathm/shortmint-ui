import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../lib/supabase.js'

// Sign up with email + password
export const signUp = createAsyncThunk('auth/signUp', async ({ name, email, password }, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
  if (error) return rejectWithValue(error.message)

  // Insert into clients table
  const { error: clientError } = await supabase.from('clients').insert({
    id: data.user.id,
    name,
    email,
    password_hash: 'managed_by_supabase_auth',
    plan: 'trial',
    usage_hours_limit: 0,
    usage_hours_used: 0,
  })
  if (clientError && clientError.code !== '23505') return rejectWithValue(clientError.message)

  return { user: data.user, session: data.session }
})

// Sign in with email + password
export const signIn = createAsyncThunk('auth/signIn', async ({ email, password }, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return rejectWithValue(error.message)
  return { user: data.user, session: data.session }
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

// Load current session
export const loadSession = createAsyncThunk('auth/loadSession', async (_, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.getSession()
  if (error) return rejectWithValue(error.message)
  if (!data.session) return null

  // Fetch client row
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .eq('id', data.session.user.id)
    .single()

  if (clientError) return rejectWithValue(clientError.message)

  // Store token for n8n calls
  localStorage.setItem('sm_token', data.session.access_token)

  return { user: data.session.user, client, session: data.session }
})

// Refresh client data (after plan purchase etc.)
export const refreshClient = createAsyncThunk('auth/refreshClient', async (userId, { rejectWithValue }) => {
  const { data, error } = await supabase.from('clients').select('*').eq('id', userId).single()
  if (error) return rejectWithValue(error.message)
  return data
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
    setSession: (state, action) => {
      state.user = action.payload.user
      state.session = action.payload.session
      if (action.payload.session?.access_token) {
        localStorage.setItem('sm_token', action.payload.session.access_token)
      }
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
      state.session = action.payload.session
      localStorage.setItem('sm_token', action.payload.session.access_token)
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
    })

    // refreshClient
    builder.addCase(refreshClient.fulfilled, (state, action) => {
      state.client = action.payload
    })
  },
})

export const { clearError, setSession } = authSlice.actions
export default authSlice.reducer
