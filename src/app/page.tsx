import { HeroSection } from "@/components/layout/hero-section"
import { FeaturedPosts } from "@/components/blog/featured-posts"
import { RecentPosts } from "@/components/blog/recent-posts"
import { AboutSection } from "@/components/layout/about-section"
import { getPosts } from "@/lib/actions/post-actions"
import { mockPosts } from "@/lib/mock-data"

export default async function Home() {
  let featuredPosts = []
  let recentPosts = []

  try {
    const featuredResult = await getPosts({ featured: true, limit: 3 })
    featuredPosts = featuredResult.posts
  } catch (error) {
    console.error("Error fetching featured posts:", error)
    // Use mock data as fallback
    featuredPosts = mockPosts.filter((post) => post.featured).slice(0, 3)
  }

  try {
    const recentResult = await getPosts({ limit: 6 })
    recentPosts = recentResult.posts
  } catch (error) {
    console.error("Error fetching recent posts:", error)
    // Use mock data as fallback
    recentPosts = mockPosts.slice(0, 6)
  }

  return (
    <div className="container py-8 max-w-7xl mx-auto px-4 md:px-6">
      <HeroSection />
      <FeaturedPosts posts={featuredPosts} />
      <AboutSection />
      <RecentPosts posts={recentPosts} />
    </div>
  )
}
