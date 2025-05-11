/**
 * Error handling utilities
 */

import { toast } from "@/hooks/use-toast"

/**
 * Safely handle and log errors
 * @param error The error to handle
 * @param customMessage Optional custom message to display to the user
 * @param silent If true, no toast notification will be shown
 */
export function handleError(error: unknown, customMessage?: string, silent = false): void {
  // Extract error message
  const errorMessage =
    error instanceof Error ? error.message : typeof error === "string" ? error : "An unknown error occurred"

  // Log to console for debugging
  console.error("Error occurred:", error)

  // Show toast notification unless silent mode is enabled
  if (!silent) {
    toast({
      title: "Error",
      description: customMessage || errorMessage,
      variant: "destructive",
    })
  }
}

/**
 * Format Supabase error messages for better user experience
 * @param error Supabase error object
 * @returns Formatted error message
 */
export function formatSupabaseError(error: { message?: string; code?: string }): string {
  if (!error) return "Unknown error"

  // Handle common Supabase error codes
  switch (error.code) {
    case "23505":
      return "This record already exists."
    case "23503":
      return "This operation references a record that does not exist."
    case "42P01":
      return "Database configuration error. Please contact support."
    case "PGRST116":
      return "You do not have permission to perform this action."
    default:
      return error.message || "An error occurred with the database operation."
  }
}
