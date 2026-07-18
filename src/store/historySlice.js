import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getHistory } from "../lib/api.js";

export const loadHistory = createAsyncThunk(
  "history/loadHistory",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getHistory();

      return data.videos;
    } catch (e) {
      return rejectWithValue(
        e.response?.data?.message || "Could not load history.",
      );
    }
  },
);

const historySlice = createSlice({
  name: "history",
  initialState: { videos: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadHistory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loadHistory.fulfilled, (state, action) => {
      state.loading = false;
      state.videos = action.payload;
    });
    builder.addCase(loadHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default historySlice.reducer;
