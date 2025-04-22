import { ContactsTab } from "@/components/admin/contacts-tab"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Manage Contacts | Admin Dashboard",
  description: "Manage contact form submissions from your blog visitors.",
}



export default async function ContactsPage() {

  return (
    <div className="container py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-6">
      <ContactsTab />
    </div>
  )
}
