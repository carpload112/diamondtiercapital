"use client"

import { useState, useEffect } from "react"

type Theme = "light" | "dark" | "system"

/**
 * Hook for detecting and managing theme
 * @returns Object with theme state and setter
 */
export function useThemeDetection() {
  // Get initial theme from localStorage or default to system
  const [theme, setTheme] = useState<Theme>("system")
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light")

  // Initialize theme from localStorage
  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === "undefined") return

    // Get theme from localStorage
    const storedTheme = localStorage.getItem("theme") as Theme | null

    if (storedTheme) {
      setTheme(storedTheme)
    }

    // Detect system theme
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    setSystemTheme(isDarkMode ? "dark" : "light")
  }, [])

  // Listen for system theme changes
  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light")
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  // Update theme in localStorage and document
  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === "undefined") return

    // Save theme to localStorage
    localStorage.setItem("theme", theme)

    // Apply theme to document
    const root = window.document.documentElement

    // Remove both classes
    root.classList.remove("light", "dark")

    // Add appropriate class
    if (theme === "system") {
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme, systemTheme])

  // Get the actual theme (resolving 'system')
  const actualTheme = theme === "system" ? systemTheme : theme

  return {
    theme,
    setTheme,
    systemTheme,
    actualTheme,
    isDark: actualTheme === "dark",
  }
}
