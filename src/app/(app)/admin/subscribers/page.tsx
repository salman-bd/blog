import { Suspense } from "react"
import { SubscribersTab } from "@/components/admin/subscribers-tab"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { SubscribersTabSkeleton } from "@/components/ui/skeletons/admin/subscribers-tab-skeleton"

export const metadata: Metadata = {
  title: "Manage Subscribers | Admin Dashboard",
  description: "Manage newsletter subscribers for your blog.",
}

export default function SubscribersPage() {
  return (
    <div className="container py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Manage Subscribers</h1>
        <Button asChild variant="outline" className="flex items-center gap-2 text-sm">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </Button>
      </div>

      <Suspense fallback={<SubscribersTabSkeleton />}>
        <SubscribersTab />
      </Suspense>
    </div>
  )
}
