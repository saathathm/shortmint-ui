import { Navigate } from 'react-router-dom'

export default function AffiliateProtectedRoute({ children }) {
  const token = localStorage.getItem('st_affiliate_token')
  if (!token) return <Navigate to="/affiliate/login" replace />
  return children
}
