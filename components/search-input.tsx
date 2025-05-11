"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange: (value: string) => void
  debounceMs?: number
  className?: string
}

/**
 * Search input component with debounce
 */
export function SearchInput({
  placeholder = "Search...",
  value: externalValue,
  onChange,
  debounceMs = 300,
  className = "",
}: SearchInputProps) {
  const [value, setValue] = useState(externalValue || "")
  const debouncedValue = useDebounce(value, debounceMs)

  // Sync with external value
  useEffect(() => {
    if (externalValue !== undefined && externalValue !== value) {
      setValue(externalValue)
    }
  }, [externalValue])

  // Notify parent of changes
  useEffect(() => {
    onChange(debouncedValue)
  }, [debouncedValue, onChange])

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  // Clear input
  const handleClear = () => {
    setValue("")
  }

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input type="text" placeholder={placeholder} value={value} onChange={handleChange} className="pl-10 pr-8" />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear</span>
        </button>
      )}
    </div>
  )
}
