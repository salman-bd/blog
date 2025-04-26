import { getPosts } from "@/lib/actions/post-actions"
import { mockPosts } from "@/lib/mock-data"
import { RecentPosts } from "../blog/recent-posts"

export async function RecentPostsPage() {
  let recentPosts = []

  try {
    const recentResult = await getPosts({ limit: 6 })
    recentPosts = recentResult.posts
  } catch (error) {
    console.error("Error fetching recent posts:", error)
    // Use mock data as fallback
    recentPosts = mockPosts.slice(0, 6)
  }

  return <RecentPosts posts={recentPosts} />
}