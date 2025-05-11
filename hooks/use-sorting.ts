"use client"

import { useState, useCallback } from "react"

type SortDirection = "asc" | "desc"

type SortOptions<T> = {
  initialSortField?: keyof T
  initialSortDirection?: SortDirection
}

/**
 * Hook for sorting data
 */
export function useSorting<T extends Record<string, any>>({
  initialSortField,
  initialSortDirection = "asc",
}: SortOptions<T> = {}) {
  const [sortField, setSortField] = useState<keyof T | undefined>(initialSortField)
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection)

  // Toggle sort direction
  const toggleSortDirection = useCallback(() => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
  }, [])

  // Change sort field
  const changeSortField = useCallback(
    (field: keyof T) => {
      if (sortField === field) {
        // If clicking the same field, toggle direction
        toggleSortDirection()
      } else {
        // If clicking a new field, set it and default to ascending
        setSortField(field)
        setSortDirection("asc")
      }
    },
    [sortField, toggleSortDirection],
  )

  // Sort function for arrays
  const sortData = useCallback(
    (data: T[]) => {
      if (!sortField) return [...data]

      return [...data].sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]

        // Handle undefined or null values
        if (aValue === undefined || aValue === null) return sortDirection === "asc" ? -1 : 1
        if (bValue === undefined || bValue === null) return sortDirection === "asc" ? 1 : -1

        // Compare based on type
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }

        // Default numeric comparison
        return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : aValue > bValue ? -1 : 1
      })
    },
    [sortField, sortDirection],
  )

  return {
    sortField,
    sortDirection,
    changeSortField,
    toggleSortDirection,
    sortData,
  }
}
