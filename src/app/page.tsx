import { HeroSection } from "@/components/home/hero-section"
import { AboutSection } from "@/components/home/about-section"
import { Suspense } from "react"
import { FeaturedPostsSkeleton } from "@/components/ui/skeletons/blogs/featured-posts-skeleton"
import { FeaturedPostsPage } from "@/components/home/featured-posts"
import { RecentPostsPage } from "@/components/home/recent-posts"
import { RecentPostsSkeleton } from "@/components/ui/skeletons/blogs/recent-posts-skeleton"

export default async function Home() {

  return (
    <div className="container py-8 max-w-7xl mx-auto px-4 md:px-6">
      <HeroSection />
      <Suspense fallback={<FeaturedPostsSkeleton />}>
        <FeaturedPostsPage />
      </Suspense>
      <AboutSection />
      <Suspense fallback={<RecentPostsSkeleton />}>
        <RecentPostsPage />
      </Suspense>
    </div>
  )
}
