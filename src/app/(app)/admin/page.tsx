import { AdminDashboard } from "@/components/admin/admin-dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard | Junayed Ahmed",
  description: "Manage your blog posts, categories, and user comments.",
}

export default async function AdminPage() {

  return <AdminDashboard />
}
