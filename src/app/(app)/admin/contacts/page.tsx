import { Suspense } from "react"
import { ContactsTab } from "@/components/admin/contacts-tab"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { ContactsTabSkeleton } from "@/components/ui/skeletons/admin/contacts-tab-skeleton"

export const metadata: Metadata = {
  title: "Manage Contacts | Admin Dashboard",
  description: "Manage contact messages from your blog visitors.",
}

export default function ContactsPage() {
  return (
    <div className="container py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Manage Contacts</h1>
        <Button asChild variant="outline" className="flex items-center gap-2 text-sm">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </Button>
      </div>

      <Suspense fallback={<ContactsTabSkeleton />}>
        <ContactsTab />
      </Suspense>
    </div>
  )
}
