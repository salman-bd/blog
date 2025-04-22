import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Post } from "@/types/types"

interface RecentPostsProps {
  posts: Post[] | null | undefined
}

export function RecentPosts({ posts }: RecentPostsProps) {
  // Ensure posts is an array
  const validPosts = Array.isArray(posts) ? posts : []

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            <span className="text-amber-600">Recent</span> Posts
          </h2>
          <Link href="/blog" className="text-amber-600 hover:underline">
            View All Posts
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validPosts.length > 0 ? (
            validPosts.map((post) => (
              <Card key={post.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex p-4 gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
                    <Image
                      src={post.coverImage || "/placeholder.svg?height=80&width=80"}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-0 flex-1">
                    <div className="flex gap-2 mb-1">
                      {post.categories.slice(0, 1).map((category) => (
                        <Badge
                          key={category}
                          variant="outline"
                          className="text-xs bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-stone-800 dark:text-amber-400 dark:hover:bg-stone-700"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                    <Link href={`/blog/${post.slug}`} className="hover:text-amber-600">
                      <h3 className="font-medium line-clamp-2">{post.title}</h3>
                    </Link>
                  </CardContent>
                </div>
                <CardFooter className="text-xs text-stone-500 dark:text-stone-400 mt-auto">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <h3 className="text-xl font-medium mb-2">No recent posts available</h3>
              <p className="text-stone-600 dark:text-stone-400">Check back later for new content.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
