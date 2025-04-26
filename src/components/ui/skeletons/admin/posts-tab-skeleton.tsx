import { Skeleton } from "@/components/ui/skeleton"

export function PostsTabSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="rounded-lg border shadow-sm">
        <div className="p-0">
          <div className="rounded-t-lg border-b h-12 flex items-center px-4">
            <div className="grid grid-cols-5 w-full">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <div className="flex justify-end">
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
          <div className="divide-y">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4">
                <div className="grid grid-cols-5 w-full items-center">
                  <Skeleton className="h-5 w-40" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-5 w-24" />
                  <div className="flex justify-end">
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
