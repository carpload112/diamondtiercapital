/**
 * String manipulation utilities
 */

/**
 * Get initials from a name
 * @param name Full name
 * @param maxLength Maximum number of characters to return
 * @returns Initials
 */
export function getInitials(name: string, maxLength = 2): string {
  if (!name || name === "N/A") return "NA"

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, maxLength)
}

/**
 * Truncate a string to a maximum length
 * @param str String to truncate
 * @param maxLength Maximum length
 * @param ellipsis Whether to add ellipsis
 * @returns Truncated string
 */
export function truncateString(str: string, maxLength = 50, ellipsis = true): string {
  if (!str) return ""
  if (str.length <= maxLength) return str

  return str.substring(0, maxLength) + (ellipsis ? "..." : "")
}

/**
 * Convert a string to title case
 * @param str String to convert
 * @returns Title case string
 */
export function toTitleCase(str: string): string {
  if (!str) return ""

  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Generate a slug from a string
 * @param str String to convert to slug
 * @returns URL-friendly slug
 */
export function slugify(str: string): string {
  if (!str) return ""

  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Remove consecutive hyphens
}
