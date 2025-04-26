import { Skeleton } from "@/components/ui/skeleton"
import { ContactsTabSkeleton } from "@/components/ui/skeletons/admin/contacts-tab-skeleton"

export default function ContactsLoading() {
  return (
    <div className="min-h-screen dark:bg-stone-700 bg-gray-100 w-full flex-1">
      <div className="flex items-center justify-center mx-auto w-full">
        <div className="container py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>

          <ContactsTabSkeleton />
        </div>
      </div>
    </div>
  )
}
