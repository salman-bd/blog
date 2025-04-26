import { Skeleton } from "@/components/ui/skeleton"

export function AdminDashboardSkeleton() {
  return (
    <div className="container py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <Skeleton className="h-10 w-48" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="overflow-x-auto pb-2">
          <Skeleton className="h-10 w-full" />
        </div>

        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    </div>
  )
}
