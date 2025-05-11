"use client"

import { useState, useEffect } from "react"

/**
 * Hook for using session storage with automatic serialization/deserialization
 * @param key The session storage key
 * @param initialValue The initial value
 * @returns [storedValue, setValue] tuple
 */
export function useSessionStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Initialize from session storage
  useEffect(() => {
    try {
      // Check if window is available (client-side)
      if (typeof window !== "undefined") {
        const item = window.sessionStorage.getItem(key)
        // Parse stored json or return initialValue
        setStoredValue(item ? JSON.parse(item) : initialValue)
      }
    } catch (error) {
      console.error("Error reading from sessionStorage:", error)
      setStoredValue(initialValue)
    }
  }, [key, initialValue])

  // Update session storage when state changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function
      const valueToStore = value instanceof Function ? value(storedValue) : value

      // Save state
      setStoredValue(valueToStore)

      // Save to session storage
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error("Error writing to sessionStorage:", error)
    }
  }

  return [storedValue, setValue]
}
