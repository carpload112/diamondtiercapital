"use client"

import { useState, useEffect, useCallback } from "react"

type IdleOptions = {
  timeout?: number
  events?: string[]
}

/**
 * Hook for detecting user inactivity
 * @param options Configuration options
 * @returns Object with isIdle state and reset function
 */
export function useIdleDetection({
  timeout = 5 * 60 * 1000, // 5 minutes
  events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"],
}: IdleOptions = {}) {
  const [isIdle, setIsIdle] = useState(false)
  const [idleTimer, setIdleTimer] = useState<NodeJS.Timeout | null>(null)

  // Reset the idle timer
  const resetIdleTimer = useCallback(() => {
    // Clear existing timer
    if (idleTimer) {
      clearTimeout(idleTimer)
    }

    // Set user as active
    setIsIdle(false)

    // Set new timer
    const timer = setTimeout(() => {
      setIsIdle(true)
    }, timeout)

    setIdleTimer(timer)
  }, [timeout, idleTimer])

  // Set up event listeners
  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === "undefined") return

    // Initial timer
    resetIdleTimer()

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, resetIdleTimer)
    })

    // Clean up
    return () => {
      // Clear timer
      if (idleTimer) {
        clearTimeout(idleTimer)
      }

      // Remove event listeners
      events.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer)
      })
    }
  }, [resetIdleTimer, events, idleTimer])

  return {
    isIdle,
    resetIdleTimer,
  }
}
