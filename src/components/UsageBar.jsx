import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export default function UsageBar() {
  const { client } = useAuth()
  if (!client || client.usage_hours_limit === 0) return null

  const pct = Math.min((client.usage_hours_used / client.usage_hours_limit) * 100, 100)
  const isNearLimit = pct >= 80

  return (
    <div className={`rounded-xl p-4 flex items-center justify-between gap-4 ${isNearLimit ? 'bg-red-50 border border-red-100' : 'bg-bg-surface border border-border'}`}>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium text-text-primary">Monthly usage</span>
          <span className={`text-xs font-medium ${isNearLimit ? 'text-error' : 'text-text-muted'}`}>
            {parseFloat(client.usage_hours_used).toFixed(1)} / {client.usage_hours_limit} hrs
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isNearLimit ? 'bg-error' : 'bg-primary'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      {isNearLimit && (
        <Link to="/pricing" className="btn-primary text-xs py-1.5 px-3 whitespace-nowrap">
          Upgrade
        </Link>
      )}
    </div>
  )
}
