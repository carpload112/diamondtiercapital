/**
 * Formatting utilities for currency, numbers, and file sizes
 */

/**
 * Format a number as currency
 * @param amount Number to format
 * @param currency Currency code
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number | string | undefined, currency = "USD"): string {
  if (amount === undefined || amount === null) return "$0"

  // If it's already a formatted range like "$50,000 - $100,000", return as is
  if (typeof amount === "string" && amount.includes("-")) {
    return amount
  }

  // Convert string to number if needed
  const num = typeof amount === "string" ? Number.parseFloat(amount.replace(/[^0-9.-]+/g, "")) : amount

  // Handle NaN
  if (isNaN(num)) return "$0"

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Format a file size in bytes to a human-readable string
 * @param bytes Size in bytes
 * @param decimals Number of decimal places
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
}

/**
 * Parse a string amount to a number
 * @param amount Amount string (can be formatted like "$50,000")
 * @returns Parsed number
 */
export function parseAmountToNumber(amount: string | number): number {
  if (typeof amount === "number") return amount
  if (!amount || amount === "N/A") return 0

  // Handle string formats like "$50,000 - $100,000"
  const matches = amount.match(/\$?([0-9,]+)/)
  if (matches && matches[1]) {
    return Number(matches[1].replace(/,/g, ""))
  }

  return 0
}

/**
 * Format a percentage
 * @param value Number to format as percentage
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals = 1): string {
  return value.toFixed(decimals) + "%"
}
