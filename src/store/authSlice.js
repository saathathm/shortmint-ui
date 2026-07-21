import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../lib/supabase.js";

export const loadSession = createAsyncThunk(
  "auth/loadSession",
  async (_, { rejectWithValue }) => {
    try {
      let token = localStorage.getItem("sm_token");
      let currentRefreshToken = localStorage.getItem("sm_refresh_token");

      // 1. Try Supabase session first (Google OAuth)
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        token = data.session.access_token;
        localStorage.setItem("sm_token", token);

        if (data.session?.refresh_token) {
          currentRefreshToken = data.session.refresh_token;
          localStorage.setItem("sm_refresh_token", currentRefreshToken);
        }

        // 2. Try restoring session via refresh token
      } else if (currentRefreshToken && token) {
        // Try restoring session via refresh token
        try {
          const { data: refreshData, error } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: currentRefreshToken,
          });

          if (!error && refreshData?.session) {
            token = refreshData.session.access_token;
            localStorage.setItem("sm_token", token);

            if (refreshData.session.refresh_token) {
              currentRefreshToken = refreshData.session.refresh_token;
              localStorage.setItem("sm_refresh_token", currentRefreshToken);
            }
          }
        } catch (e) {
          console.error("Session restore failed:", e);
        }
      }

      if (!token) return null;

      // Single source of truth — always validate via backend
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
          localStorage.removeItem("sm_refresh_token");
          return null;
        }

        const meData = await res.json();
        return {
          user: meData.user,
          client: meData.client,
          session: {
            access_token: token,
            refresh_token: currentRefreshToken,
          },
        };
      } catch (e) {
        clearTimeout(timeoutId);

        if (e.name === "AbortError") return null;
        localStorage.removeItem("sm_token");
        localStorage.removeItem("sm_refresh_token");
        return null;
      }
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

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
      localStorage.setItem("sm_refresh_token", data.refresh_token);

      return {
        user: data.user,
        session: {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        },
        client: data.client,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);

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
      localStorage.setItem("sm_refresh_token", data.refresh_token);

      return {
        user: data.user,
        session: {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        },
        client: data.client,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);

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

export const signOut = createAsyncThunk("auth/signOut", async () => {
  await supabase.auth.signOut();
  localStorage.removeItem("sm_token");
  localStorage.removeItem("sm_refresh_token");
});

export const refreshClient = createAsyncThunk(
  "auth/refreshClient",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("sm_token");
      if (!token) return rejectWithValue("No token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh-client`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
      if (!action.payload) {
        state.user = null;
        state.session = null;
        state.initialized = true;
        localStorage.removeItem("sm_token");
        localStorage.removeItem("sm_refresh_token");
        return;
      }

      state.user = action.payload.user;
      state.session = action.payload.session;

      if (action.payload.session?.access_token) {
        localStorage.setItem("sm_token", action.payload.session.access_token);
      }
      if (action.payload.session?.refresh_token) {
        localStorage.setItem(
          "sm_refresh_token",
          action.payload.session.refresh_token,
        );
      }
    },
    setClient: (state, action) => {
      state.client = action.payload;
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
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
      state.initialized = true;
    });

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
      state.initialized = true;
    });

    builder.addCase(signOut.fulfilled, (state) => {
      state.user = null;
      state.client = null;
      state.session = null;
      state.initialized = true;
    });

    builder.addCase(refreshClient.fulfilled, (state, action) => {
      state.client = action.payload;
      state.initialized = true;
    });

    builder.addCase(refreshClient.rejected, (state, action) => {
      console.error(
        "Failed to refresh client:",
        action.error || action.payload,
      );
    });
  },
});

export const { clearError, setSession, setClient } = authSlice.actions;
export default authSlice.reducer;
