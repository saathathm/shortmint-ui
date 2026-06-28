import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import videoReducer from './videoSlice.js'
import historyReducer from './historySlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    video: videoReducer,
    history: historyReducer,
  },
})
