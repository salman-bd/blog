import { getPosts, getCategories } from "@/lib/actions/post-actions"
import { BlogList } from "@/components/blog/blog-list"
import { BlogSidebar } from "@/components/blog/blog-sidebar"
import { getMockPosts, getMockCategories } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    page?: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const categories = await getCategories()
    const category = categories.find((cat) => cat.slug === slug)

    if (!category) {
      return {
        title: "Category Not Found | Junayed Ahmed",
        description: "The requested category could not be found.",
      }
    }

    return {
      title: `${category.name} | Junayed Ahmed's Blog`,
      description: `Explore articles about ${category.name} on Junayed Ahmed's blog.`,
    }
  } catch (error) {
    // Fallback to mock data
    const categories = getMockCategories()
    const category = categories.find((cat) => cat.slug === params.slug)

    if (!category) {
      return {
        title: "Category Not Found | Junayed Ahmed",
        description: "The requested category could not be found.",
      }
    }

    return {
      title: `${category.name} | Junayed Ahmed's Blog`,
      description: `Explore articles about ${category.name} on Junayed Ahmed's blog.`,
    }
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const { slug } = await params

  // First, check if the category exists
  let categories = []

  try {
    categories = await getCategories()
  } catch (error) {
    console.error("Error fetching categories:", error)
    categories = getMockCategories()
  }

  const category = categories.find((cat) => cat.slug === slug)

  if (!category) {
    notFound()
  }

  let posts = []
  let totalPages = 1

  try {
    const result = await getPosts({
      page,
      limit: 9,
      category: category.name,
    })

    posts = result.posts
    totalPages = result.totalPages
  } catch (error) {
    console.error("Error fetching category posts:", error)
    // Use mock data as fallback
    const mockResult = getMockPosts({
      page,
      limit: 9,
      category: category.name,
    })

    posts = mockResult.posts
    totalPages = mockResult.totalPages
  }

  return (
    <div className="container py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold mb-8">
            <span className="text-amber-600">{category.name}</span> Articles
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
