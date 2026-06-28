import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAuth } from '../hooks/useAuth.js'
import { refreshClient } from '../store/authSlice.js'
import { supabase } from '../lib/supabase.js'
import { Youtube, Facebook, CheckCircle, ExternalLink, User, Lock, Loader } from 'lucide-react'

export default function Settings() {
  const { user, client } = useAuth()
  const dispatch = useDispatch()
  const [savingProfile, setSavingProfile] = useState(false)
  const [name, setName] = useState(client?.name || '')
  const [profileSaved, setProfileSaved] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [pwSent, setPwSent] = useState(false)

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    await supabase.from('clients').update({ name }).eq('id', user.id)
    await dispatch(refreshClient(user.id))
    setSavingProfile(false)
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2000)
  }

  const handlePasswordReset = async () => {
    setChangingPassword(true)
    await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/settings`,
    })
    setChangingPassword(false)
    setPwSent(true)
  }

  const handleConnectYoutube = () => {
    // OAuth flow — redirect to Google with YouTube scope
    // To be configured after Workflow 2 is built
    alert('YouTube connection will be available once publishing is set up.')
  }

  const handleConnectFacebook = () => {
    alert('Facebook connection will be available once publishing is set up.')
  }

  const planLabels = { trial: 'Free Trial', starter: 'Starter', growth: 'Growth', pro: 'Pro' }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Settings</h1>

      {/* Profile */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <User size={16} className="text-text-muted" />
          <h2 className="font-semibold text-text-primary">Profile</h2>
        </div>
        <form onSubmit={handleSaveProfile} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">Full name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1 block">Email</label>
            <input type="email" value={user?.email || ''} disabled className="input-field opacity-60 cursor-not-allowed" />
          </div>
          <button type="submit" disabled={savingProfile} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
            {savingProfile ? <Loader size={14} className="animate-spin" /> : null}
            {profileSaved ? '✓ Saved' : 'Save changes'}
          </button>
        </form>
      </div>

      {/* Password */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={16} className="text-text-muted" />
          <h2 className="font-semibold text-text-primary">Password</h2>
        </div>
        {pwSent ? (
          <div className="flex items-center gap-2 text-success text-sm">
            <CheckCircle size={16} />
            Password reset link sent to {user?.email}
          </div>
        ) : (
          <button onClick={handlePasswordReset} disabled={changingPassword} className="btn-secondary text-sm py-2 flex items-center gap-2">
            {changingPassword ? <Loader size={14} className="animate-spin" /> : null}
            Send password reset email
          </button>
        )}
      </div>

      {/* Connected accounts */}
      <div className="card p-5">
        <h2 className="font-semibold text-text-primary mb-4">Connected accounts</h2>
        <div className="space-y-3">
          {/* YouTube */}
          <div className="flex items-center justify-between p-3 bg-bg-surface rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Youtube size={16} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">YouTube</p>
                <p className="text-xs text-text-muted">
                  {client?.youtube_channel_id ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            {client?.youtube_channel_id ? (
              <span className="flex items-center gap-1 text-xs text-success font-medium">
                <CheckCircle size={13} /> Connected
              </span>
            ) : (
              <button onClick={handleConnectYoutube} className="btn-primary text-xs py-1.5 px-3">
                Connect
              </button>
            )}
          </div>

          {/* Facebook */}
          <div className="flex items-center justify-between p-3 bg-bg-surface rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Facebook size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Facebook</p>
                <p className="text-xs text-text-muted">
                  {client?.facebook_page_id ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            {client?.facebook_page_id ? (
              <span className="flex items-center gap-1 text-xs text-success font-medium">
                <CheckCircle size={13} /> Connected
              </span>
            ) : (
              <button onClick={handleConnectFacebook} className="btn-primary text-xs py-1.5 px-3">
                Connect
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Plan */}
      <div className="card p-5">
        <h2 className="font-semibold text-text-primary mb-3">Your plan</h2>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-bold text-text-primary text-lg">{planLabels[client?.plan] || 'Free Trial'}</p>
            <p className="text-sm text-text-muted">
              {parseFloat(client?.usage_hours_used || 0).toFixed(1)} of {client?.usage_hours_limit || 0} hours used this month
            </p>
          </div>
          <Link to="/pricing" className="btn-primary text-sm py-2 px-4">
            Upgrade
          </Link>
        </div>
        {client && client.usage_hours_limit > 0 && (
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${Math.min((client.usage_hours_used / client.usage_hours_limit) * 100, 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
