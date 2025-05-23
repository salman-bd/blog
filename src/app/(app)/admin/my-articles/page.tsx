import { Suspense } from "react"
import { getPostsForAuthors } from "@/lib/actions/post-actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { ArticleCardSkeleton } from "@/components/ui/skeletons/admin/article-card-skeleton"


export const metadata: Metadata = {
  title: "My Articles | Blogger",
  description: "Manage your blog articles",
}

export default function MyArticlesPage() {
  return (
    <Suspense fallback={<MyArticlesLoading />}>
      <MyArticlesContent />
    </Suspense>
  )
}

function MyArticlesLoading() {
  return (
    <div className="container py-12 max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="grid gap-8">
        <div>
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        </div>

        <div>
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

async function MyArticlesContent() {
  // Get all posts by the current user
  const { posts } = await getPostsForAuthors()

  // Separate published and draft posts
  const publishedPosts = posts.filter((post) => post.published)
  const draftPosts = posts.filter((post) => !post.published)

  return (
    <div className="container py-12 max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          <span className="text-amber-600">My</span> Articles
        </h1>
      </div>

      <div className="grid gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Published Articles ({publishedPosts.length})</h2>
          {publishedPosts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {publishedPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <Image src={post.coverImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                      {post.featured && (
                        <Badge
                          variant="secondary"
                          className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                        >
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardDescription>Published on {new Date(post.publishedAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {post.categories.map((category) => (
                        <Badge key={category} variant="outline">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/blog/${post.slug}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/posts/edit/${post.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">You don't have any published articles yet.</p>
                <Button className="mt-4" asChild>
                  <Link href="/admin/posts/new">Create Your First Article</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Draft Articles ({draftPosts.length})</h2>
          {draftPosts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {draftPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <Image src={post.coverImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription>Last updated on {new Date(post.updatedAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {post.categories.map((category) => (
                        <Badge key={category} variant="outline">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/posts/preview/${post.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Link>
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/posts/edit/${post.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">You don't have any draft articles.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-muted ${className}`} />
}
