import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSkeleton() {
  return (
    <div className="container py-12 max-w-4xl mx-auto px-4 md:px-6">
      <Skeleton className="h-10 w-48 mb-8" />

      <div className="grid gap-8">
        <div className="rounded-lg border shadow-sm">
          <div className="p-6 flex flex-row items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div>
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-5 w-48" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border shadow-sm">
            <div className="p-6">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48 mb-6" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <div className="rounded-lg border shadow-sm">
            <div className="p-6">
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-48 mb-6" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
