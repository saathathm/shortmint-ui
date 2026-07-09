import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { processVideo as apiProcessVideo, checkStatus as apiCheckStatus } from '../lib/api.js'
import { supabase } from '../lib/supabase.js'

// Start processing a video
export const startProcessing = createAsyncThunk(
  'video/startProcessing',
  async ({ videoUrl, clientId, style }, { rejectWithValue }) => {
    const { data } = await apiProcessVideo(videoUrl, clientId, style).catch((e) =>
      rejectWithValue(e.response?.data?.message || 'Failed to start processing.')
    )
    return data
  }
)

// Poll check-status
export const pollStatus = createAsyncThunk(
  'video/pollStatus',
  async (videoId, { rejectWithValue }) => {
    const { data } = await apiCheckStatus(videoId).catch((e) =>
      rejectWithValue(e.response?.data?.message || 'Failed to check status.')
    )
    return data
  }
)

// Load results from Supabase
export const loadResults = createAsyncThunk(
  'video/loadResults',
  async (videoId, { rejectWithValue }) => {
    const { data: video, error: vError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single()
    if (vError) return rejectWithValue('Video not found.')

    const { data: clips, error: cError } = await supabase
      .from('clips')
      .select('*')
      .eq('video_id', videoId)
      .order('batch_id', { ascending: false })
      .order('clip_number', { ascending: true })
    if (cError) return rejectWithValue('Could not load clips.')

    return { video, clips }
  }
)

const videoSlice = createSlice({
  name: 'video',
  initialState: {
    currentVideoId: null,
    status: null,
    title: null,
    style: null,
    clips: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetVideo: (state) => {
      state.currentVideoId = null
      state.status = null
      state.title = null
      state.style = null
      state.clips = []
      state.loading = false
      state.error = null
    },
    updateClipField: (state, action) => {
      const { clipId, field, value } = action.payload
      const clip = state.clips.find((c) => c.id === clipId)
      if (clip) clip[field] = value
    },
  },
  extraReducers: (builder) => {
    // startProcessing
    builder.addCase(startProcessing.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(startProcessing.fulfilled, (state, action) => {
      state.loading = false
      state.currentVideoId = action.payload.video_id
      state.status = 'processing'
    })
    builder.addCase(startProcessing.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // pollStatus
    builder.addCase(pollStatus.fulfilled, (state, action) => {
      state.status = action.payload.status
      if (action.payload.status === 'completed') {
        state.title = action.payload.title
        state.clips = action.payload.clips || []
      }
      if (action.payload.status === 'failed') {
        state.error = action.payload.error_message || 'Processing failed. Please try again.'
      }
    })

    // loadResults
    builder.addCase(loadResults.pending, (state) => { state.loading = true })
    builder.addCase(loadResults.fulfilled, (state, action) => {
      state.loading = false
      state.currentVideoId = action.payload.video.id
      state.title = action.payload.video.title
      state.style = action.payload.video.style
      state.status = action.payload.video.status
      state.clips = action.payload.clips
    })
    builder.addCase(loadResults.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
  },
})

export const { resetVideo, updateClipField } = videoSlice.actions
export default videoSlice.reducer
