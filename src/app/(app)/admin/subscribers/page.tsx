import { SubscribersTab } from "@/components/admin/subscribers-tab"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Manage Subscribers | Admin Dashboard",
  description: "Manage newsletter subscribers for your blog.",
}


export default async function SubscribersPage() {

  return (
    <div className="container py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-6">
      <SubscribersTab />
    </div>
  )
}
