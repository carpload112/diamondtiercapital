"use client"

import { useState, useCallback, useMemo } from "react"

type FilterFunction<T> = (item: T) => boolean

type FilterOptions<T> = {
  initialFilters?: Record<string, any>
  filterFunctions?: Record<string, (item: T, value: any) => boolean>
}

/**
 * Hook for filtering data
 */
export function useFiltering<T>({ initialFilters = {}, filterFunctions = {} }: FilterOptions<T> = {}) {
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters)

  // Set a single filter
  const setFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  // Remove a filter
  const removeFilter = useCallback((key: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[key]
      return newFilters
    })
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])

  // Create a combined filter function
  const filterFunction = useMemo<FilterFunction<T>>(() => {
    return (item: T) => {
      // If no filters are set, include all items
      if (Object.keys(filters).length === 0) return true

      // Check each filter
      return Object.entries(filters).every(([key, value]) => {
        // Skip empty filters
        if (value === undefined || value === null || value === "") return true

        // Use custom filter function if available
        if (filterFunctions[key]) {
          return filterFunctions[key](item, value)
        }

        // Default filtering behavior
        const itemValue = (item as any)[key]

        // Handle arrays
        if (Array.isArray(value)) {
          return value.length === 0 || value.includes(itemValue)
        }

        // Handle objects with id property (e.g., selected options)
        if (value && typeof value === "object" && "id" in value) {
          return itemValue === value.id
        }

        // Handle strings (case-insensitive search)
        if (typeof itemValue === "string" && typeof value === "string") {
          return itemValue.toLowerCase().includes(value.toLowerCase())
        }

        // Default equality check
        return itemValue === value
      })
    }
  }, [filters, filterFunctions])

  // Filter data
  const filterData = useCallback(
    (data: T[]) => {
      return data.filter(filterFunction)
    },
    [filterFunction],
  )

  return {
    filters,
    setFilter,
    removeFilter,
    clearFilters,
    filterFunction,
    filterData,
    hasFilters: Object.keys(filters).length > 0,
  }
}
