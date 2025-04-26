import { Suspense } from "react"
import { getPostBySlug, getRelatedPosts } from "@/lib/actions/post-actions"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Metadata } from "next"
import { RelatedPosts } from "@/components/blog/related-posts"
import { CommentSection } from "@/components/blog/comment-section"
import { ShareButtons } from "@/components/blog/share-buttons"
import { RelatedPostsSkeleton } from "@/components/ui/skeletons/blogs/related-posts-skeleton"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: `${post.title} | Junayed Ahmed`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt.toISOString(),
      authors: [post.author.name],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-6">
      <article className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {post.categories.map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-stone-800 dark:text-amber-400 dark:hover:bg-stone-700"
              >
                {category}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500 dark:text-stone-400 mb-6">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 rounded-full overflow-hidden">
                <Image
                  src={post.author.image || "/placeholder.svg?height=32&width=32"}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </div>

        <div className="relative h-[300px] md:h-[500px] w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.coverImage || "/placeholder.svg?height=500&width=1000"}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="prose prose-stone dark:prose-invert max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        <div className="border-t border-b py-6 mb-12">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div>
              <h3 className="font-medium mb-2">Share this post:</h3>
              <ShareButtons
                title={post.title}
                url={`${process.env.NEXT_PUBLIC_APP_URL || "https://junayedahmed.com"}/blog/${post.slug}`}
              />
            </div>
            <div>
              <h3 className="font-medium mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="h-40 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600"></div>
            </div>
          }
        >
          <CommentSection postId={post.id} />
        </Suspense>
      </article>

      <Suspense fallback={<RelatedPostsSkeleton />}>
        <RelatedPostsWrapper postId={post.id} categories={post.categories} />
      </Suspense>
    </div>
  )
}

async function RelatedPostsWrapper({ postId, categories }: { postId: string; categories: string[] }) {
  const relatedPosts = await getRelatedPosts(postId, categories)
  return <RelatedPosts posts={relatedPosts} />
}
