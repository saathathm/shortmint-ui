import { Navigate } from 'react-router-dom'

function isExpired(token) {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]))
    return exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export default function AffiliateProtectedRoute({ children }) {
  const token = localStorage.getItem('st_affiliate_token')
  if (!token || isExpired(token)) {
    localStorage.removeItem('st_affiliate_token')
    return <Navigate to="/affiliate/login" replace />
  }
  return children
}
