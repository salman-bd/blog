import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, User } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Post } from "@/types/types"
import { Pagination } from "@/components/ui/pagination"

interface BlogListProps {
  posts: Post[] | null | undefined
  currentPage: number
  totalPages: number
}

export function BlogList({ posts, currentPage, totalPages }: BlogListProps) {
  // Ensure posts is an array
  const validPosts = Array.isArray(posts) ? posts : []

  if (validPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No posts found</h3>
        <p className="text-stone-600 dark:text-stone-400">
          Try changing your search criteria or check back later for new content.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6">
        {validPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative h-48 md:h-full w-full">
                <Image
                  src={post.coverImage || "/placeholder.svg?height=300&width=400"}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="md:col-span-2 p-6">
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
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                </Link>
                <p className="text-stone-600 dark:text-stone-400 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500 dark:text-stone-400">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
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
            </div>
          </Card>
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  )
}
