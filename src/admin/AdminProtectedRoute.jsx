import { Navigate } from 'react-router-dom'

function isExpired(token) {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]))
    return exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export default function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem('st_admin_token')
  if (!token || isExpired(token)) {
    localStorage.removeItem('st_admin_token')
    return <Navigate to="/admin/login" replace />
  }
  return children
}
