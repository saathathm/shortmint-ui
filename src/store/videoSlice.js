import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { processVideo as apiProcessVideo, checkStatus as apiCheckStatus, getResults } from '../lib/api.js'

// Start processing a video
export const startProcessing = createAsyncThunk(
  'video/startProcessing',
  async ({ videoUrl, clientId, style, startSeconds, endSeconds }, { rejectWithValue }) => {
    try {
      const { data } = await apiProcessVideo(videoUrl, clientId, style, startSeconds, endSeconds)
      return data
    } catch (e) {
      return rejectWithValue(e.response?.data?.error || 'Failed to start processing.')
    }
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

// Load results from backend API
export const loadResults = createAsyncThunk(
  'video/loadResults',
  async (videoId, { rejectWithValue }) => {
    try {
      const { data } = await getResults(videoId)

      return { video: data.video, clips: data.clips }
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Could not load results.')
    }
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
