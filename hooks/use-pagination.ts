"use client"

import { useState, useCallback, useMemo } from "react"

type PaginationOptions = {
  initialPage?: number
  initialPageSize?: number
  totalItems?: number
}

/**
 * Hook for pagination
 */
export function usePagination({ initialPage = 1, initialPageSize = 10, totalItems = 0 }: PaginationOptions = {}) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [total, setTotal] = useState(totalItems)

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(total / pageSize))
  }, [total, pageSize])

  // Calculate pagination range
  const range = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = Math.min(start + pageSize, total)

    return { start, end }
  }, [currentPage, pageSize, total])

  // Navigate to a specific page
  const goToPage = useCallback(
    (page: number) => {
      const targetPage = Math.max(1, Math.min(page, totalPages))
      setCurrentPage(targetPage)
    },
    [totalPages],
  )

  // Navigate to next page
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [currentPage, totalPages])

  // Navigate to previous page
  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }, [currentPage])

  // Change page size
  const changePageSize = useCallback((newSize: number) => {
    setPageSize(newSize)
    // Reset to first page when changing page size
    setCurrentPage(1)
  }, [])

  // Update total items
  const updateTotal = useCallback(
    (newTotal: number) => {
      setTotal(newTotal)
      // Adjust current page if it exceeds the new total
      if (currentPage > Math.ceil(newTotal / pageSize)) {
        setCurrentPage(Math.max(1, Math.ceil(newTotal / pageSize)))
      }
    },
    [currentPage, pageSize],
  )

  return {
    currentPage,
    pageSize,
    totalPages,
    total,
    range,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    updateTotal,
  }
}
