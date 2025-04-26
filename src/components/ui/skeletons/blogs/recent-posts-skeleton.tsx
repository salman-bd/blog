import { Skeleton } from "@/components/ui/skeleton"

export function RecentPostsSkeleton() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col h-full overflow-hidden rounded-lg border shadow-sm">
              <div className="flex p-4 gap-4">
                <Skeleton className="h-20 w-20 flex-shrink-0 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-16 mb-1" />
                  <Skeleton className="h-5 w-full mb-1" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              </div>
              <div className="p-4 mt-auto">
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
