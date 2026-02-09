import { useState, useMemo, useCallback } from "react"

type UsePaginationProps<T> = {
  data: T[]
  itemsPerPage: number
}

export const usePagination = <T,>({ data, itemsPerPage }: UsePaginationProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = useMemo(() => Math.ceil(data.length / itemsPerPage), [data.length, itemsPerPage])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return data.slice(start, end)
  }, [data, currentPage, itemsPerPage])

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }, [totalPages])

  const resetPagination = useCallback(() => {
    setCurrentPage(1)
  }, [])

  return {
    currentPage,
    totalPages,
    paginatedData,
    totalItems: data.length,
    goToPage,
    resetPagination
  }
}
