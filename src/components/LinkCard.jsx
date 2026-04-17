import { useState } from 'react'
import { imgUrl, formatDuration, formatCount } from '../utils'

/* ─── Shared image with error fallback ─── */
function SafeImg({ src, alt, className }) {
  const [err, setErr] = useState(false)
  if (!src || err) return null
  return <img src={src} alt={alt} className={className} onError={() => setErr(true)} />
}

/* ─── Main LinkCard ─── */
export default function LinkCard({ post }) {
  const { caption, linkEntity, link } = post

  return (
    <div>
      {caption && (
        <p className="px-4 pb-3 text-sm text-white/75 leading-relaxed whitespace-pre-line">
          {caption}
        </p>
      )}
      <div className="mx-4 mb-4 rounded-xl border border-white/[0.08] overflow-hidden">
        {linkEntity ? (
          <LinkEntityRenderer linkEntity={linkEntity} />
        ) : link ? (
          <ExternalLinkCard link={link} />
        ) : null}
      </div>
    </div>
  )
}

function LinkEntityRenderer({ linkEntity }) {
  switch (linkEntity.type) {
    case 'RevisionPost': return <RevisionPostEmbed rp={linkEntity.revisionPost} />
    case 'Beat':         return <BeatEmbed beat={linkEntity.beat} />
    case 'Playlist':     return <PlaylistEmbed playlist={linkEntity.playlist} />
    default:
      return (
        <div className="px-4 py-3 bg-[#161616] text-xs text-white/30 italic">
          {linkEntity.type} entity
        </div>
      )
  }
}

/* ─── Revision Post embed ─── */
function RevisionPostEmbed({ rp }) {
  if (!rp) return null
  const { revision, creator } = rp
  const song = revision?.song
  const mixdown = revision?.mixdown
  const artworkUrl = imgUrl(song?.picture?.url || creator?.picture?.url, 160)
  const genres = revision?.genres || []
  const plays = revision?.counters?.plays

  return (
    <div className="bg-[#161616]">
      <div className="p-3 flex gap-3">
        <SafeImg
          src={artworkUrl}
          alt={song?.name}
          className="w-14 h-14 rounded-lg object-cover bg-[#222] flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-white/90 truncate">{song?.name || 'Untitled'}</p>
          <p className="text-xs text-white/40 mt-0.5 truncate">{creator?.name}</p>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {genres.map(g => (
              <span key={g.id} className="text-[11px] bg-purple-500/15 text-purple-400 px-1.5 py-0.5 rounded-full">
                {g.name}
              </span>
            ))}
            {plays != null && (
              <span className="text-[11px] text-white/30">{formatCount(plays)} plays</span>
            )}
          </div>
        </div>
      </div>
      {mixdown?.file && mixdown.status === 'Ready' && (
        <div className="px-3 pb-3 space-y-1">
          <audio src={mixdown.file} controls preload="none" className="w-full" />
          {mixdown.duration && (
            <p className="text-[11px] text-white/25 text-right">{formatDuration(mixdown.duration)}</p>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Beat embed ─── */
function BeatEmbed({ beat }) {
  if (!beat) return null
  const pictureUrl = beat.picture?.m || beat.picture?.s || imgUrl(beat.picture?.url, 160)

  return (
    <div className="bg-[#161616]">
      <div className="p-3 flex gap-3">
        <SafeImg
          src={pictureUrl}
          alt={beat.name}
          className="w-14 h-14 rounded-lg object-cover bg-[#222] flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-white/90 truncate">{beat.name}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {beat.bpm && <span className="text-xs text-white/40">{beat.bpm} BPM</span>}
            {beat.key && <span className="text-xs text-white/40">{beat.key}</span>}
            {beat.genre && (
              <span className="text-[11px] bg-orange-500/15 text-orange-400 px-1.5 py-0.5 rounded-full">
                {beat.genre}
              </span>
            )}
          </div>
          {beat.price > 0 && (
            <p className="text-xs text-amber-400 mt-1.5 font-semibold">
              ${(beat.price / 100).toFixed(2)}
              {beat.sale && (
                <span className="ml-1.5 line-through text-white/25">
                  ${((beat.sale.price || beat.price) / 100).toFixed(2)}
                </span>
              )}
            </p>
          )}
        </div>
      </div>
      {beat.audioPreviewUrl && (
        <div className="px-3 pb-3">
          <audio src={beat.audioPreviewUrl} controls preload="none" className="w-full" />
        </div>
      )}
    </div>
  )
}

/* ─── Playlist embed ─── */
function PlaylistEmbed({ playlist }) {
  if (!playlist) return null
  const coverUrl = imgUrl(playlist.picture?.url, 160)
  const trackCount = playlist.counters?.items ?? playlist.posts?.length ?? 0

  return (
    <div className="bg-[#161616]">
      {/* Playlist header */}
      <div className="p-3 flex gap-3 items-center border-b border-white/[0.06]">
        <SafeImg
          src={coverUrl}
          alt={playlist.name}
          className="w-12 h-12 rounded-lg object-cover bg-[#222] flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-white/90 truncate">{playlist.name}</p>
          <p className="text-xs text-white/35 mt-0.5">
            {trackCount} {trackCount === 1 ? 'track' : 'tracks'}
          </p>
        </div>
        <svg className="text-emerald-500 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13M9 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
        </svg>
      </div>

      {/* Tracks */}
      <div className="divide-y divide-white/[0.04]">
        {(playlist.posts || []).slice(0, 3).map((item, i) => (
          <PlaylistTrack key={item.id || i} track={item} index={i + 1} />
        ))}
      </div>

      {trackCount > 3 && (
        <div className="px-3 py-2.5 text-xs text-white/25 text-center">
          +{trackCount - 3} more tracks
        </div>
      )}
    </div>
  )
}

function PlaylistTrack({ track, index }) {
  const { revision, creator } = track
  const song = revision?.song
  const artworkUrl = imgUrl(song?.picture?.url || creator?.picture?.url, 80)
  const mixdown = revision?.mixdown

  return (
    <div className="p-3">
      <div className="flex gap-2.5 items-center">
        <span className="text-[11px] text-white/25 w-4 text-center flex-shrink-0 tabular-nums">{index}</span>
        <SafeImg
          src={artworkUrl}
          alt={song?.name}
          className="w-9 h-9 rounded object-cover bg-[#222] flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white/80 truncate">{song?.name || 'Untitled'}</p>
          <p className="text-[11px] text-white/35 truncate">{creator?.name}</p>
        </div>
        {revision?.counters?.plays != null && (
          <span className="text-[11px] text-white/25 flex-shrink-0">
            {formatCount(revision.counters.plays)} plays
          </span>
        )}
      </div>
      {mixdown?.file && mixdown.status === 'Ready' && (
        <div className="mt-2 ml-[52px]">
          <audio src={mixdown.file} controls preload="none" className="w-full" />
        </div>
      )}
    </div>
  )
}

/* ─── Plain external link ─── */
function ExternalLinkCard({ link }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 bg-[#161616] hover:bg-[#1c1c1c] transition-colors"
    >
      {link.image && (
        <SafeImg
          src={link.image}
          alt={link.title}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        {link.title && (
          <p className="text-sm font-medium text-white/80 truncate">{link.title}</p>
        )}
        {link.description && (
          <p className="text-xs text-white/40 mt-0.5 line-clamp-2">{link.description}</p>
        )}
        <p className="text-xs text-white/25 mt-1 truncate">{link.url}</p>
      </div>
      <svg className="text-white/25 flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </a>
  )
}
