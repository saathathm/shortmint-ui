import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../lib/supabase.js";

// Fetch client row from Supabase clients table
const fetchClientRow = async (userId) => {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data;
};

// Load current session on app start
export const loadSession = createAsyncThunk(
  "auth/loadSession",
  async (_, { rejectWithValue }) => {
    try {
      // First try Supabase session (Google OAuth)
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        localStorage.setItem("sm_token", data.session.access_token);
        const client = await fetchClientRow(data.session.user.id);
        return { user: data.session.user, client, session: data.session };
      }

      // Fall back to backend JWT (email/password)
      const token = localStorage.getItem("sm_token");
      if (!token) return null;

      // Fetch with 8 second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          },
        );
        clearTimeout(timeoutId);

        if (!res.ok) {
          localStorage.removeItem("sm_token");
          return null;
        }

        const data2 = await res.json();
        return {
          user: data2.user,
          client: data2.client,
          session: { access_token: token },
        };
      } catch (e) {
        clearTimeout(timeoutId);
        // AbortError means timeout — don't remove token, just return null
        if (e.name === "AbortError") return null;
        localStorage.removeItem("sm_token");
        return null;
      }
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

// Sign up with email + password (Backend API)
export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        },
      );
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error || "Signup failed");
      localStorage.setItem("sm_token", data.access_token);
      return {
        user: data.user,
        session: { access_token: data.access_token },
        client: data.client,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);

// Sign in with email + password
export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error);
      localStorage.setItem("sm_token", data.access_token);
      return {
        user: data.user,
        session: { access_token: data.access_token },
        client: data.client,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);

// Sign in with Google
export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) return rejectWithValue(error.message);
  },
);

// Sign out
export const signOut = createAsyncThunk("auth/signOut", async () => {
  await supabase.auth.signOut();
  localStorage.removeItem("sm_token");
});

// Refresh client row (after plan purchase etc.)
export const refreshClient = createAsyncThunk(
  "auth/refreshClient",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh-client`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("sm_token")}`,
          },
        },
      );
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error);
      return data.client;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    client: null,
    session: null,
    loading: false,
    error: null,
    initialized: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSession: (state, action) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.initialized = true;
      if (action.payload.session?.access_token) {
        localStorage.setItem("sm_token", action.payload.session.access_token);
      }
    },
    setClient: (state, action) => {
      state.client = action.payload;
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    // loadSession
    builder.addCase(loadSession.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadSession.fulfilled, (state, action) => {
      state.loading = false;
      state.initialized = true;
      if (action.payload) {
        state.user = action.payload.user;
        state.client = action.payload.client;
        state.session = action.payload.session;
      }
    });
    builder.addCase(loadSession.rejected, (state) => {
      state.loading = false;
      state.initialized = true;
    });

    // signUp
    builder.addCase(signUp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.loading = false;
      state.initialized = true;
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.client = action.payload.client;
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // signIn
    builder.addCase(signIn.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.loading = false;
      state.initialized = true;
      state.user = action.payload.user;
      state.client = action.payload.client;
      state.session = action.payload.session;
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // signOut
    builder.addCase(signOut.fulfilled, (state) => {
      state.user = null;
      state.client = null;
      state.session = null;
      state.initialized = true;
    });

    // refreshClient
    builder.addCase(refreshClient.fulfilled, (state, action) => {
      state.client = action.payload;
    });
  },
});

export const { clearError, setSession, setClient } = authSlice.actions;
export default authSlice.reducer;
