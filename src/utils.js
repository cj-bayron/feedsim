/** Appends size query params to BandLab CDN base URLs ending with "/" */
export function imgUrl(url, size = 96) {
  if (!url) return null
  if (url.endsWith('/')) return `${url}?width=${size}&height=${size}`
  return url
}

/** Returns a human-readable relative time string */
export function relativeTime(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  const w = Math.floor(d / 7)
  if (w < 52) return `${w}w ago`
  return `${Math.floor(w / 52)}y ago`
}

/** Formats seconds into m:ss */
export function formatDuration(seconds) {
  if (!seconds) return null
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

/** Compact number format: 1.2K, 3.4M */
export function formatCount(n) {
  if (n == null) return '0'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

/** Extracts the action verb from a message like "<user>Name</user> posted a video" */
export function extractAction(message) {
  if (!message) return ''
  const match = message.match(/<\/user>\s*(.+)/)
  return match ? match[1].trim() : ''
}
