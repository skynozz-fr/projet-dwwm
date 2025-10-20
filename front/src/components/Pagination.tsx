import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/Button"

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
  itemName = "éléments"
}: PaginationProps) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages)
      }
    }

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between bg-card p-4 rounded-lg border">
      <div className="text-sm text-muted-foreground">
        {startItem}-{endItem} sur {totalItems} {itemName} • Page {currentPage} sur {totalPages}
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-2 py-1 text-muted-foreground">...</span>
            ) : (
              <Button
                variant={page === currentPage ? "primary" : "ghost"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className="min-w-[32px] px-2"
              >
                {page}
              </Button>
            )}
          </div>
        ))}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
