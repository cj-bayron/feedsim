import { useState } from 'react'
import { imgUrl, relativeTime, extractAction } from '../utils'

function Avatar({ src, name }) {
  const [err, setErr] = useState(false)
  if (!src || err) {
    return (
      <div className="w-9 h-9 rounded-full bg-[#252525] flex items-center justify-center text-white/50 text-sm font-semibold flex-shrink-0 select-none">
        {name?.[0]?.toUpperCase() || '?'}
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={name}
      className="w-9 h-9 rounded-full object-cover bg-[#252525] flex-shrink-0"
      onError={() => setErr(true)}
    />
  )
}

const TYPE_STYLES = {
  Video:      'bg-sky-500/15 text-sky-400',
  Text:       'bg-white/[0.08] text-white/40',
  Link:       'bg-indigo-500/15 text-indigo-400',
  Revision:   'bg-purple-500/15 text-purple-400',
}

const ENTITY_STYLES = {
  Beat:         'bg-orange-500/15 text-orange-400',
  Playlist:     'bg-emerald-500/15 text-emerald-400',
  RevisionPost: 'bg-purple-500/15 text-purple-400',
}

function TypeBadge({ type, linkEntityType }) {
  const label = type === 'Link' ? (linkEntityType || 'Link') : type
  const cls = type === 'Link'
    ? (ENTITY_STYLES[linkEntityType] || TYPE_STYLES.Link)
    : (TYPE_STYLES[type] || 'bg-white/[0.08] text-white/40')
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${cls}`}>
      {label}
    </span>
  )
}

export default function CardHeader({ post }) {
  const creator = post.creator
  const avatarUrl = imgUrl(creator?.picture?.url, 96)
  const action = extractAction(post.message)

  return (
    <div className="flex items-start gap-3 px-4 pt-4 pb-3">
      {/* Avatar with verified badge */}
      <div className="relative flex-shrink-0">
        <Avatar src={avatarUrl} name={creator?.name} />
        {creator?.isVerified && (
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center ring-[1.5px] ring-[#111]">
            <svg width="8" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-semibold text-white/90 leading-tight">{creator?.name}</span>
          {creator?.username && (
            <span className="text-xs text-white/30">@{creator.username}</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {action && <span className="text-xs text-white/35">{action}</span>}
          <span className="text-xs text-white/25">{relativeTime(post.createdOn)}</span>
          {post.isBoosted && (
            <span className="text-[11px] bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded-full font-semibold">
              Boosted
            </span>
          )}
        </div>
      </div>

      <TypeBadge type={post.type} linkEntityType={post.linkEntity?.type} />
    </div>
  )
}
