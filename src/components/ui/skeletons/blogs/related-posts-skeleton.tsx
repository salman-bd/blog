import { Skeleton } from "@/components/ui/skeleton"

export function RelatedPostsSkeleton() {
  return (
    <section className="py-12 border-t">
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border shadow-sm">
              <Skeleton className="h-40 w-full" />
              <div className="p-4">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
