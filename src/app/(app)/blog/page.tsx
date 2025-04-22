import { getPosts } from "@/lib/actions/post-actions"
import { BlogList } from "@/components/blog/blog-list"
import { BlogSidebar } from "@/components/blog/blog-sidebar"
import { getMockPosts } from "@/lib/mock-data"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog | Junayed Ahmed",
  description: "Read my latest thoughts and experiences on travel, politics, religion, history, and nature.",
}

interface BlogPageProps {
  searchParams: {
    page?: string
    category?: string
    search?: string
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const {  category, search } = await searchParams
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1


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
