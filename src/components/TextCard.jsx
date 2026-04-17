export default function TextCard({ post }) {
  const { caption } = post
  if (!caption) return null
  return (
    <div className="px-4 pb-4">
      <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">{caption}</p>
    </div>
  )
}
