import { formatCount } from '../utils'

export default function CardFooter({ post }) {
  const { counters, reactions } = post
  const hasData = reactions?.length > 0 || counters?.likes || counters?.comments

  if (!hasData) return null

  return (
    <div className="px-4 pb-3 pt-2.5 flex items-center gap-4 border-t border-white/[0.05]">
      {/* Reaction emojis + count */}
      {reactions?.length > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="flex -space-x-0.5">
            {reactions.slice(0, 3).map((r, i) => (
              <span key={i} className="text-base leading-none">{r.reaction}</span>
            ))}
          </span>
          {counters?.reactions > 0 && (
            <span className="text-xs text-white/30">{formatCount(counters.reactions)}</span>
          )}
        </div>
      )}

      {/* Likes */}
      {counters?.likes > 0 && (
        <div className="flex items-center gap-1 text-white/30">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="text-xs">{formatCount(counters.likes)}</span>
        </div>
      )}

      {/* Comments */}
      {counters?.comments > 0 && (
        <div className="flex items-center gap-1 text-white/30">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="text-xs">{formatCount(counters.comments)}</span>
        </div>
      )}
    </div>
  )
}
