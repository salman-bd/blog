import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import type { Metadata } from "next"
import { getCurrentUser } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Admin Dashboard | Junayed Ahmed",
  description: "Manage your blog posts, categories, and user comments.",
}

export default async function AdminPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") {
    redirect("/signin?callbackUrl=admin")
  }

  return <AdminDashboard />
}
