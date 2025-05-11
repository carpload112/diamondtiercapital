/**
 * Date formatting utilities
 */

/**
 * Format a date string to a human-readable format
 * @param dateString ISO date string
 * @param format Format style
 * @returns Formatted date string
 */
export function formatDate(dateString: string, format: "short" | "medium" | "long" = "medium"): string {
  if (!dateString) return "N/A"

  try {
    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date"
    }

    switch (format) {
      case "short":
        return date.toLocaleDateString("en-US")
      case "long":
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      case "medium":
      default:
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
    }
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid date"
  }
}

/**
 * Get a relative time string (e.g., "2 days ago")
 * @param dateString ISO date string
 * @returns Relative time string
 */
export function getRelativeTimeString(dateString: string): string {
  if (!dateString) return "N/A"

  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    // Less than a minute
    if (diffInSeconds < 60) {
      return "just now"
    }

    // Less than an hour
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    }

    // Less than a day
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? "s" : ""} ago`
    }

    // Less than a week
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? "s" : ""} ago`
    }

    // Default to standard date format
    return formatDate(dateString, "medium")
  } catch (error) {
    console.error("Error calculating relative time:", error)
    return "Invalid date"
  }
}

/**
 * Generate month options for the last N months
 * @param count Number of months to generate
 * @returns Array of month options with value and label
 */
export function getMonthOptions(count = 12): Array<{ value: string; label: string }> {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    return {
      value: `${date.getMonth() + 1}/${date.getFullYear()}`,
      label: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    }
  })
}
