import { redirect } from "next/navigation"
import { ContactsTab } from "@/components/admin/contacts-tab"
import type { Metadata } from "next"
import { getCurrentUser } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Manage Contacts | Admin Dashboard",
  description: "Manage contact form submissions from your blog visitors.",
}

export default async function ContactsPage() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== "ADMIN") {
    redirect("/signin?admin=true")
  }

  return (
    <div className="container py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-6">
      <ContactsTab />
    </div>
  )
}
