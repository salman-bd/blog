import { Skeleton } from "@/components/ui/skeleton"

export default function BlogLoading() {
  return (
    <div className="container py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <Skeleton className="h-12 w-48 mb-8" />

          <div className="space-y-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
            ))}

            <div className="flex justify-center gap-2 mt-8">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <BlogSidebarSkeleton />
        </div>
      </div>
    </div>
  )
}

function BlogSidebarSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search box skeleton */}
      <div className="rounded-lg border shadow-sm">
        <div className="p-6">
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      </div>

      {/* Categories skeleton */}
      <div className="rounded-lg border shadow-sm">
        <div className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20" />
            ))}
          </div>
        </div>
      </div>

      {/* Recent posts skeleton */}
      <div className="rounded-lg border shadow-sm">
        <div className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subscribe box skeleton */}
      <div className="rounded-lg border shadow-sm">
        <div className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-4 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}
