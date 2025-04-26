import { Suspense } from "react"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import type { Metadata } from "next"
import { AdminDashboardSkeleton } from "@/components/ui/skeletons/admin/admin-dashboard-skeleton"

export const metadata: Metadata = {
  title: "Admin Dashboard | Junayed Ahmed",
  description: "Manage your blog posts, categories, and user comments.",
}

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboard />
    </Suspense>
  )
}
