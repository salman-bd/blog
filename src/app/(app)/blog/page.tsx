import type { Metadata } from "next"
import { BlogList } from "@/components/blog/blog-list"
import { BlogSidebar } from "@/components/blog/blog-sidebar"
import { getMockPosts } from "@/lib/mock-data"
import { getPosts } from "@/lib/actions/post-actions"

interface BlogPageProps {
  searchParams: {
    category?: string
    search?: string
    page?: string
  }
}

export const metadata: Metadata = {
  title: "Blog - Acme Store",
  description: "Read our latest blog posts about technology, design, and more.",
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category, search, page: pageString } = await searchParams
  const page = pageString ? Number.parseInt(pageString) : 1

  let posts = []
  let totalPages = 1

  try {
    const result = await getPosts({
      page,
      limit: 9,
      category,
      search,
    })

    posts = result.posts
    totalPages = result.totalPages
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    // Use mock data as fallback
    const mockResult = getMockPosts({
      page,
      limit: 9,
      category,
      search,
    })

    posts = mockResult.posts
    totalPages = mockResult.totalPages
  }

  return (
    <div className="container py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold mb-8">
            <span className="text-amber-600">Blog</span> Posts
          </h1>
          <BlogList posts={posts} currentPage={page} totalPages={totalPages} />
        </div>
        <div className="w-full md:w-1/3">
          <BlogSidebar />
        </div>
      </div>
    </div>
  )
}
