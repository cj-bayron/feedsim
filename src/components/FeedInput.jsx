import { useState } from 'react'

const SESSION_URL = 'feedsim_url'
const SESSION_TOKEN = 'feedsim_token'

export default function FeedInput({ onFetch, loading }) {
  const [url, setUrl] = useState(() => sessionStorage.getItem(SESSION_URL) || '')
  const [token, setToken] = useState(() => sessionStorage.getItem(SESSION_TOKEN) || '')
  const [tokenVisible, setTokenVisible] = useState(false)

  const canFetch = url.trim() && token.trim() && !loading

  const handleFetch = () => {
    if (!canFetch) return
    sessionStorage.setItem(SESSION_URL, url.trim())
    sessionStorage.setItem(SESSION_TOKEN, token.trim())
    onFetch(url.trim(), token.trim())
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleFetch()
  }

  return (
    <div className="rounded-2xl bg-[#111] border border-white/[0.07] p-4 space-y-3">
      {/* URL */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-white/30 uppercase tracking-widest">
          Feed Endpoint URL
        </label>
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://api.bandlab.com/v1.3/users/{id}/feeds/trending/posts?limit=10"
          className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500/30 transition-all"
        />
      </div>

      {/* Token */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-white/30 uppercase tracking-widest">
          Bearer Token
        </label>
        <div className="relative">
          <input
            type={tokenVisible ? 'text' : 'password'}
            value={token}
            onChange={e => setToken(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="eyJ..."
            className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-lg pl-3 pr-10 py-2.5 text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500/30 transition-all font-mono"
          />
          <button
            type="button"
            onClick={() => setTokenVisible(v => !v)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
          >
            {tokenVisible ? (
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

      {/* Fetch button */}
      <button
        onClick={handleFetch}
        disabled={!canFetch}
        className="w-full bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:bg-white/5 disabled:text-white/20 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl py-2.5 transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading…
          </>
        ) : 'Fetch Feed'}
      </button>
    </div>
  )
}
