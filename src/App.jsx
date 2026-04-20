import { useState, useCallback, useRef } from 'react'
import FeedPane from './components/FeedPane'
import LoginForm from './components/LoginForm'

export default function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem('feedsim_token') || '')
  const [diffMode, setDiffMode] = useState(false)
  const tokenRef = useRef(token)
  const getToken = useCallback(() => tokenRef.current, [])

  const handleLogin = useCallback((accessToken) => {
    sessionStorage.setItem('feedsim_token', accessToken)
    tokenRef.current = accessToken
    setToken(accessToken)
  }, [])

  const handleSignOut = useCallback(() => {
    sessionStorage.removeItem('feedsim_token')
    tokenRef.current = ''
    setToken('')
    setDiffMode(false)
  }, [])

  if (!token) return <LoginForm onLogin={handleLogin} />

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-[#e8e8e8]">
      {/* Header */}
      <header className="flex-shrink-0 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/[0.06] px-5 py-3 flex items-center gap-3 z-50">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-purple-400 flex-shrink-0">
          <path d="M9 18V5l12-2v13M9 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-semibold text-sm text-white">FeedSim</span>
        <span className="text-xs text-white/20 hidden sm:block">BandLab Feed Simulator</span>

        <div className="ml-auto flex items-center gap-2">
          {/* Feed Diff toggle */}
          <button
            onClick={() => setDiffMode(v => !v)}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
              diffMode
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80'
            }`}
          >
            Feed Diff
          </button>
          <button
            onClick={handleSignOut}
            className="text-xs bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 px-3 py-1.5 rounded-lg transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main — fills remaining height, panes scroll independently */}
      <main className={`flex-1 overflow-hidden flex ${diffMode ? 'divide-x divide-white/[0.06]' : ''}`}>
        {/* Primary pane — centred in single mode, half-width in diff */}
        <div className={diffMode ? 'flex-1 min-w-0 h-full' : 'w-full max-w-[620px] mx-auto h-full'}>
          <FeedPane getToken={getToken} label={diffMode ? 'Feed A' : null} storageKey="feedsim_url_a" />
        </div>

        {/* Secondary pane — only in diff mode */}
        {diffMode && (
          <div className="flex-1 min-w-0 h-full">
            <FeedPane getToken={getToken} label="Feed B" storageKey="feedsim_url_b" />
          </div>
        )}
      </main>
    </div>
  )
}

