import { useFeed } from '../hooks/useFeed'
import FeedInput from './FeedInput'
import FeedColumn from './FeedColumn'

export default function FeedPane({ getToken, renewToken, label, storageKey }) {
  const { posts, paging, loading, error, handleFetch, handleLoadMore } = useFeed(getToken, renewToken)

  return (
    <div className="flex flex-col h-full min-w-0 overflow-y-auto">
      <div className="w-full max-w-[620px] mx-auto flex flex-col">
        {/* Pane label (diff mode only) */}
        {label && (
          <div className="px-3 pt-3 pb-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/25">{label}</span>
          </div>
        )}

        {/* URL input */}
        <div className="px-3 pt-3 pb-0">
          <FeedInput onFetch={handleFetch} loading={loading} storageKey={storageKey} />
        </div>

        {/* Feed area */}
        <div className="px-3 pb-6">
          {error && (
            <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 leading-relaxed">
              <span className="font-semibold">Error: </span>{error}
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="mt-24 text-center select-none">
              <div className="text-5xl opacity-10 mb-4">🎵</div>
              <p className="text-white/20 text-sm">Enter a feed endpoint URL above</p>
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
        </div>
      </div>
    </div>
  )
}
