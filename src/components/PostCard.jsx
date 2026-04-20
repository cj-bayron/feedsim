import CardHeader from './CardHeader'
import CardFooter from './CardFooter'
import VideoCard from './VideoCard'
import TextCard from './TextCard'
import LinkCard from './LinkCard'
import RevisionCard from './RevisionCard'

function UnsupportedCard({ post }) {
  return (
    <div className="px-4 pb-4 text-xs text-white/25 italic">
      Post type &ldquo;{post.type}&rdquo; — preview not yet supported
    </div>
  )
}

export default function PostCard({ post }) {
  const renderContent = () => {
    switch (post.type) {
      case 'Video':    return <VideoCard post={post} />
      case 'Text':     return <TextCard post={post} />
      case 'Link':     return <LinkCard post={post} />
      case 'Revision': return <RevisionCard post={post} />
      default:         return <UnsupportedCard post={post} />
    }
  }

  return (
    <article className="rounded-2xl bg-[#111] border border-white/[0.07] overflow-hidden">
      <CardHeader post={post} />
      {renderContent()}
      <CardFooter post={post} />
    </article>
  )
}
