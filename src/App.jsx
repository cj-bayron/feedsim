import { useState, useCallback } from 'react'
import FeedInput from './components/FeedInput'
import FeedColumn from './components/FeedColumn'

export default function App() {
  const [feedConfig, setFeedConfig] = useState({ url: '', token: '' })
  const [posts, setPosts] = useState([])
  const [paging, setPaging] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const doFetch = useCallback(async (url, token, cursor = null) => {
    setLoading(true)
    setError(null)
    try {
      let fetchUrl = url
      if (cursor) {
        const u = new URL(url)
        u.searchParams.set('after', cursor)
        fetchUrl = u.toString()
      }
      const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`
      const res = await fetch(fetchUrl, {
        headers: { Authorization: authHeader },
      })
      if (!res.ok) {
        const body = await res.text().catch(() => '')
        throw new Error(`HTTP ${res.status} ${res.statusText}${body ? ' — ' + body.slice(0, 300) : ''}`)
      }
      const json = await res.json()
      const newPosts = json.data || []
      if (cursor) {
        setPosts(prev => [...prev, ...newPosts])
      } else {
        setPosts(newPosts)
      }
      setPaging(json.paging || null)
    } catch (e) {
      if (e instanceof TypeError && e.message === 'Failed to fetch') {
        setError('Network error — the request was blocked. This is likely a CORS issue. The API server must allow cross-origin requests from this origin.')
      } else {
        setError(e.message)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const handleFetch = useCallback((url, token) => {
    setFeedConfig({ url, token })
    setPosts([])
    setPaging(null)
    doFetch(url, token, null)
  }, [doFetch])

  const handleLoadMore = useCallback(() => {
    if (paging?.cursors?.after) {
      doFetch(feedConfig.url, feedConfig.token, paging.cursors.after)
    }
  }, [paging, feedConfig, doFetch])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e8e8]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/[0.06] px-5 py-3 flex items-center gap-3">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-purple-400 flex-shrink-0">
          <path d="M9 18V5l12-2v13M9 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-semibold text-sm text-white">FeedSim</span>
        <span className="text-xs text-white/20 hidden sm:block">BandLab Feed Simulator</span>
      </header>

      <main className="max-w-[620px] mx-auto px-3 py-5">
        <FeedInput onFetch={handleFetch} loading={loading} />

        {error && (
          <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 leading-relaxed">
            <span className="font-semibold">Error: </span>{error}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="mt-24 text-center select-none">
            <div className="text-6xl opacity-10 mb-4">🎵</div>
            <p className="text-white/20 text-sm">Enter a feed endpoint URL and Bearer token above to load posts</p>
          </div>
        )}

        {posts.length > 0 && (
          <FeedColumn
            posts={posts}
            loading={loading}
            hasMore={!!paging?.cursors?.after}
            onLoadMore={handleLoadMore}
          />
        )}
      </main>
    </div>
  )
}
