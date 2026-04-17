import PostCard from './PostCard'

export default function FeedColumn({ posts, loading, hasMore, onLoadMore }) {
  return (
    <div className="mt-4 space-y-3">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}

      {loading && posts.length > 0 && (
        <div className="py-8 flex justify-center">
          <div className="w-5 h-5 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        </div>
      )}

      {!loading && hasMore && (
        <button
          onClick={onLoadMore}
          className="w-full py-3 text-sm text-white/35 hover:text-white/60 border border-white/[0.06] hover:border-white/[0.12] rounded-xl transition-all"
        >
          Load more
        </button>
      )}
    </div>
  )
}
