"use client"

import { useEffect, useRef, type RefObject } from "react"

/**
 * Hook for detecting clicks outside of an element
 * @param callback Function to call when a click outside is detected
 * @returns Ref to attach to the element
 */
export function useOutsideClick<T extends HTMLElement = HTMLElement>(callback: () => void): RefObject<T> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside)

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [callback])

  return ref
}
