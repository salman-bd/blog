import { Skeleton } from "@/components/ui/skeleton"

export default function MyArticlesLoading() {
  return (
    <div className="container py-12 max-w-7xl mx-auto px-4 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="grid gap-8">
        <div>
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        </div>

        <div>
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ArticleCardSkeleton() {
  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-40 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="flex flex-wrap gap-2 mb-4">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  )
}
