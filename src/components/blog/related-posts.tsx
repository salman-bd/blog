import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import type { Post } from "@/types/types"

interface RelatedPostsProps {
  posts: Post[] | null | undefined
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  // Ensure posts is an array
  const validPosts = Array.isArray(posts) ? posts : []

  if (validPosts.length === 0) return null

  return (
    <section className="py-12 border-t">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">
          <span className="text-amber-600">Related</span> Posts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {validPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-40 w-full">
                <Image
                  src={post.coverImage || "/placeholder.svg?height=160&width=300"}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <Link href={`/blog/${post.slug}`} className="hover:text-amber-600">
                  <h3 className="font-medium line-clamp-2 mb-2">{post.title}</h3>
                </Link>
                <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2">{post.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
