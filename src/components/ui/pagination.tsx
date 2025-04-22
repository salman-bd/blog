"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than max pages to show
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always include first page, last page, current page, and pages around current page
      pageNumbers.push(1)

      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if at the beginning
      if (currentPage <= 2) {
        endPage = Math.min(totalPages - 1, 4)
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        startPage = Math.max(2, totalPages - 3)
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push("...")
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("...")
      }

      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center gap-1 mt-8">
      <Button variant="outline" size="icon" disabled={currentPage <= 1} asChild={currentPage > 1}>
        {currentPage > 1 ? (
          <Link href={createPageURL(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Link>
        ) : (
          <span>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </span>
        )}
      </Button>

      {getPageNumbers().map((page, index) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2">
              ...
            </span>
          )
        }

        return (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            className={currentPage === page ? "bg-amber-600 hover:bg-amber-700" : ""}
            asChild={currentPage !== page}
          >
            {currentPage !== page ? <Link href={createPageURL(page as number)}>{page}</Link> : <span>{page}</span>}
          </Button>
        )
      })}

      <Button variant="outline" size="icon" disabled={currentPage >= totalPages} asChild={currentPage < totalPages}>
        {currentPage < totalPages ? (
          <Link href={createPageURL(currentPage + 1)}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Link>
        ) : (
          <span>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </span>
        )}
      </Button>
    </div>
  )
}
