import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type PaginationProps = {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
  onPageChange: (page: number) => void
  itemName?: string
}

export const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  itemName = "éléments",
}: PaginationProps) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const getVisiblePages = () => {
    const delta = 2
    const range: number[] = []
    const rangeWithDots: Array<number | string> = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) rangeWithDots.push(1, "...")
    else rangeWithDots.push(1)

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) rangeWithDots.push("...", totalPages)
    else if (totalPages > 1) rangeWithDots.push(totalPages)

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-muted-foreground">
        {startItem}-{endItem} sur {totalItems} {itemName} • Page {currentPage} / {totalPages}
      </div>

      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-2">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getVisiblePages().map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <Button
              key={index}
              variant={page === currentPage ? "default" : "ghost"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className="min-w-8 px-2"
            >
              {page}
            </Button>
          )
        )}

        <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-2">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
