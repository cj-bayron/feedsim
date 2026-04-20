import { useState } from 'react'

const DEFAULT_KEY = 'feedsim_url'

export default function FeedInput({ onFetch, loading, storageKey = DEFAULT_KEY }) {
  const [url, setUrl] = useState(() => sessionStorage.getItem(storageKey) || '')

  const canFetch = url.trim() && !loading

  const handleFetch = () => {
    if (!canFetch) return
    sessionStorage.setItem(storageKey, url.trim())
    onFetch(url.trim())
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleFetch()
  }

  return (
    <div className="rounded-2xl bg-[#111] border border-white/[0.07] p-4 space-y-3">
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
