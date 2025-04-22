import { redirect } from "next/navigation"
import { SubscribersTab } from "@/components/admin/subscribers-tab"
import type { Metadata } from "next"
import { getCurrentUser } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Manage Subscribers | Admin Dashboard",
  description: "Manage newsletter subscribers for your blog.",
}

export default async function SubscribersPage() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== "ADMIN") {
    redirect("/signin?admin=true")
  }

  return (
    <div className="container py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-6">
      <SubscribersTab />
    </div>
  )
}
