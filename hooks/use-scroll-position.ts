"use client"

import { useState, useEffect } from "react"

/**
 * Hook for getting scroll position
 * @returns Object with x and y scroll position
 */
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState({
    x: typeof window !== "undefined" ? window.scrollX : 0,
    y: typeof window !== "undefined" ? window.scrollY : 0,
  })

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === "undefined") return

    // Handler to call on window scroll
    const handleScroll = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      })
    }

    // Add event listener
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Call handler right away so state gets updated with initial scroll position
    handleScroll()

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return scrollPosition
}
