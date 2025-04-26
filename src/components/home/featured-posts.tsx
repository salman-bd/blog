import { getPosts } from "@/lib/actions/post-actions"
import { FeaturedPosts } from "../blog/featured-posts"
import { mockPosts } from "@/lib/mock-data"


export async function FeaturedPostsPage() {
    let featuredPosts = []
  
    try {
      const featuredResult = await getPosts({ featured: true, limit: 3 })
      featuredPosts = featuredResult.posts
    } catch (error) {
      console.error("Error fetching featured posts:", error)
      // Use mock data as fallback
      featuredPosts = mockPosts.filter((post) => post.featured).slice(0, 3)
    }

  return <FeaturedPosts posts={featuredPosts} />
}