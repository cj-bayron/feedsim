import { useState } from 'react'
import { imgUrl, formatCount } from '../utils'

function SafeImg({ src, alt, className }) {
  const [err, setErr] = useState(false)
  if (!src || err) return null
  return <img src={src} alt={alt} className={className} onError={() => setErr(true)} />
}

export default function RevisionCard({ post }) {
  const { revision, caption } = post
  if (!revision) return null

  const song    = revision.song
  const mixdown = revision.mixdown
  const genres  = revision.genres || []
  const plays   = revision.counters?.plays
  const artworkUrl = imgUrl(song?.picture?.url, 160)

  return (
    <div>
      {caption && (
        <p className="px-4 pb-3 text-sm text-white/75 leading-relaxed whitespace-pre-line">{caption}</p>
      )}

      <div className="mx-4 mb-3 rounded-xl border border-white/[0.07] bg-[#161616] p-3 flex gap-3">
        {/* Square artwork */}
        <SafeImg
          src={artworkUrl}
          alt={song?.name}
          className="w-16 h-16 rounded-lg object-cover bg-[#222] flex-shrink-0"
        />

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <p className="font-semibold text-sm text-white/90 leading-tight line-clamp-2">
              {song?.name || 'Untitled'}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              {genres.map(g => (
                <span key={g.id} className="text-[11px] bg-purple-500/15 text-purple-400 px-2 py-0.5 rounded-full font-semibold">
                  {g.name}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 mt-1.5">
            {plays != null && (
              <div className="flex items-center gap-1 text-white/30">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                <span className="text-[11px]">{formatCount(plays)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audio player */}
      {mixdown?.file && mixdown.status === 'Ready' && (
        <div className="px-4 pb-3">
          <audio src={mixdown.file} controls preload="metadata" className="w-full" />
        </div>
      )}
    </div>
  )
}
