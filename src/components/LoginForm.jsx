import { useState } from 'react'

const CLIENT_ID = 'bandlab'
const AUTH_URLS = {
  TEST: 'https://accounts-test.bandlab.com/oauth/connect/token',
  PROD: 'https://accounts.bandlab.com/oauth/connect/token',
}

export default function LoginForm({ onLogin }) {
  const [env,      setEnv]      = useState(() => sessionStorage.getItem('feedsim_env') || 'TEST')
  const [email,    setEmail]    = useState(() => sessionStorage.getItem('feedsim_email') || '')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [showPwd,  setShowPwd]  = useState(false)

  const canLogin = email.trim() && password && !loading

  const handleLogin = async () => {
    if (!canLogin) return
    setLoading(true)
    setError(null)
    try {
      const body = new URLSearchParams({
        grant_type: 'password',
        client_id:  CLIENT_ID,
        username:   email.trim(),
        password,
      })

      // In production (Azure SWA) use the server-side proxy to avoid CORS.
      // In development the auth server allows localhost directly.
      const url = import.meta.env.PROD
        ? `/api/auth-proxy?env=${env}`
        : AUTH_URLS[env]

      const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
      if (!import.meta.env.PROD) headers['X-Client-Id'] = CLIENT_ID

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: body.toString(),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok) {
        const msg = json?.error_description || json?.error || `HTTP ${res.status} ${res.statusText}`
        throw new Error(msg)
      }
      if (!json?.access_token) throw new Error('No access_token in response')

      sessionStorage.setItem('feedsim_env',   env)
      sessionStorage.setItem('feedsim_email', email.trim())
      if (json.refresh_token) sessionStorage.setItem('feedsim_refresh_token', json.refresh_token)

      onLogin(json.access_token, json.refresh_token || null)
    } catch (e) {
      if (e instanceof TypeError && e.message === 'Failed to fetch') {
        setError('Network error — request blocked (likely CORS). The auth server must allow browser cross-origin requests.')
      } else {
        setError(e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleLogin() }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-600/20 mb-1">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-purple-400">
              <path d="M9 18V5l12-2v13M9 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">FeedSim</h1>
          <p className="text-sm text-white/35">Sign in to explore BandLab feeds</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-[#111] border border-white/[0.07] p-5 space-y-4">
          {/* ENV toggle */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-white/30 uppercase tracking-widest">Environment</label>
            <div className="grid grid-cols-2 gap-1.5 bg-[#1a1a1a] p-1 rounded-xl">
              {['TEST', 'PROD'].map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEnv(e)}
                  className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                    env === e
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-white/35 hover:text-white/60'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-white/20 px-1">{AUTH_URLS[env]}</p>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-white/30 uppercase tracking-widest">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500/30 transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-white/30 uppercase tracking-widest">Password</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-lg pl-3 pr-10 py-2.5 text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500/30 transition-all"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
              >
                {showPwd ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 leading-relaxed">
              {error}
            </p>
          )}

          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={!canLogin}
            className="w-full bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:bg-white/5 disabled:text-white/20 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl py-2.5 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in…
              </>
            ) : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}
