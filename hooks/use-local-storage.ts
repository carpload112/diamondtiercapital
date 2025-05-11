"use client"

import { useState, useEffect } from "react"

/**
 * Hook for using local storage with automatic serialization/deserialization
 * @param key The local storage key
 * @param initialValue The initial value
 * @returns [storedValue, setValue] tuple
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Initialize from local storage
  useEffect(() => {
    try {
      // Check if window is available (client-side)
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key)
        // Parse stored json or return initialValue
        setStoredValue(item ? JSON.parse(item) : initialValue)
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      setStoredValue(initialValue)
    }
  }, [key, initialValue])

  // Update local storage when state changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function
      const valueToStore = value instanceof Function ? value(storedValue) : value

      // Save state
      setStoredValue(valueToStore)

      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error("Error writing to localStorage:", error)
    }
  }

  return [storedValue, setValue]
}
