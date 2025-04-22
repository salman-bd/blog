import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Post } from "@/types/types"

interface FeaturedPostsProps {
  posts: Post[] | null | undefined
}

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  // Ensure posts is an array
  const validPosts = Array.isArray(posts) ? posts : []

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            <span className="text-amber-600">Featured</span> Posts
          </h2>
          <Link href="/blog" className="text-amber-600 hover:underline">
            View All Posts
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {validPosts.length > 0 ? (
            validPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 w-full">
                  <Image
                    src={post.coverImage || "/placeholder.svg?height=200&width=400"}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex gap-2 mb-2">
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
                  <Link href={`/blog/${post.slug}`} className="hover:text-amber-600">
                    <h3 className="text-xl font-bold line-clamp-2">{post.title}</h3>
                  </Link>
                </CardHeader>
                <CardContent>
                  <p className="text-stone-600 dark:text-stone-400 line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-stone-500 dark:text-stone-400">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readingTime} min read</span>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <h3 className="text-xl font-medium mb-2">No featured posts available</h3>
              <p className="text-stone-600 dark:text-stone-400">Check back later for featured content.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
