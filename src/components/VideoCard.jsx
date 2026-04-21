import { useState } from 'react'
import { imgUrl, formatCount } from '../utils'

export default function VideoCard({ post }) {
  const { video, caption } = post
  const [playing, setPlaying] = useState(false)

  if (!video) return null

  const thumbnailUrl = imgUrl(video.picture?.url, 600)
  const trackName = video.videoTrackPost?.name
  const trackArtwork = imgUrl(
    video.videoTrackPost?.picture?.url || video.videoTrackPost?.creator?.picture?.url,
    80
  )
  const views = video.counters?.views

  return (
    <div>
      {/* Caption */}
      {caption && (
        <p className="px-4 pb-3 text-sm text-white/75 leading-relaxed whitespace-pre-line">
          {caption}
        </p>
      )}

      {/* Video area */}
      <div className="relative bg-black">
        {!playing ? (
          <div
            className="relative cursor-pointer group aspect-video"
            onClick={() => setPlaying(true)}
          >
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt="Video thumbnail"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
                <span className="text-white/20 text-sm">No thumbnail</span>
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[52px] h-[52px] bg-white/90 group-hover:bg-white rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105">
                <svg className="w-[22px] h-[22px] text-black ml-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Views badge */}
            {views != null && (
              <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {formatCount(views)}
              </div>
            )}
          </div>
        ) : (
          <video
            src={video.url}
            controls
            autoPlay
            className="w-full aspect-video bg-black"
          />
        )}
      </div>

      {/* Linked track info */}
      {trackName && (
        <div className="px-4 py-3 flex items-center gap-3 border-t border-white/[0.05]">
          {trackArtwork && (
            <TrackArtwork src={trackArtwork} name={trackName} />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white/65 truncate">{trackName}</p>
            <p className="text-[11px] text-white/30 mt-0.5">Linked track</p>
          </div>
          <svg className="text-white/20 flex-shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13M9 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
          </svg>
        </div>
      )}
    </div>
  )
}

function TrackArtwork({ src, name }) {
  const [err, setErr] = useState(false)
  if (err) return null
  return (
    <img
      src={src}
      alt={name}
      className="w-8 h-8 rounded object-cover bg-[#222] flex-shrink-0"
      loading="lazy"
      onError={() => setErr(true)}
    />
  )
}
