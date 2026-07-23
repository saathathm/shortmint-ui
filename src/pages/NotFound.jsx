import { Link } from 'react-router-dom'
import { Scissors } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-sm px-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Scissors size={28} className="text-primary" />
        </div>
        <h1 className="text-6xl font-extrabold text-text-primary mb-2">404</h1>
        <h2 className="text-xl font-bold text-text-primary mb-3">Page not found</h2>
        <p className="text-text-muted text-sm mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="btn-primary text-sm py-2 px-5">
            Go home
          </Link>
          <Link to="/dashboard" className="btn-secondary text-sm py-2 px-5">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}