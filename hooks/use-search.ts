"use client"

import { useState, useCallback, useMemo } from "react"
import { useDebounce } from "./use-debounce"

type SearchOptions = {
  initialSearchTerm?: string
  debounceMs?: number
  searchFields?: string[]
}

/**
 * Hook for searching data
 */
export function useSearch<T>({ initialSearchTerm = "", debounceMs = 300, searchFields = [] }: SearchOptions = {}) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs)

  // Handle search input change
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
  }, [])

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm("")
  }, [])

  // Search function
  const searchFunction = useMemo(() => {
    return (item: T) => {
      if (!debouncedSearchTerm) return true

      // If searchFields are provided, only search those fields
      if (searchFields.length > 0) {
        return searchFields.some((field) => {
          const value = getNestedValue(item, field)
          return typeof value === "string" && value.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        })
      }

      // Otherwise, search all string properties
      return Object.values(item as Record<string, any>).some(
        (value) => typeof value === "string" && value.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
      )
    }
  }, [debouncedSearchTerm, searchFields])

  // Search data
  const searchData = useCallback(
    (data: T[]) => {
      return data.filter(searchFunction)
    },
    [searchFunction],
  )

  return {
    searchTerm,
    debouncedSearchTerm,
    handleSearchChange,
    clearSearch,
    searchFunction,
    searchData,
    isSearching: debouncedSearchTerm !== "",
  }
}

// Helper function to get nested property value
function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((prev, curr) => {
    return prev && prev[curr] !== undefined ? prev[curr] : undefined
  }, obj)
}
