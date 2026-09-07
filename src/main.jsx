import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/index.js'
import App from './App.jsx'
import './index.css'

if (!import.meta.env.VITE_API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not set. Check your .env file.')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
