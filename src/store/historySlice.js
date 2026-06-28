import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../lib/supabase.js'

export const loadHistory = createAsyncThunk(
  'history/loadHistory',
  async (clientId, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from('videos')
      .select('*, clips(id, publish_status)')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) return rejectWithValue('Could not load history.')
    return data
  }
)

const historySlice = createSlice({
  name: 'history',
  initialState: { videos: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadHistory.pending, (state) => { state.loading = true })
    builder.addCase(loadHistory.fulfilled, (state, action) => {
      state.loading = false
      state.videos = action.payload
    })
    builder.addCase(loadHistory.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
  },
})

export default historySlice.reducer
