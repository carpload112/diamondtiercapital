"use client"

import { useState, useCallback } from "react"
import { useToast } from "./use-toast"

type ClipboardOptions = {
  successMessage?: string
  errorMessage?: string
  showToast?: boolean
}

/**
 * Hook for clipboard operations
 */
export function useClipboard({
  successMessage = "Copied to clipboard",
  errorMessage = "Failed to copy to clipboard",
  showToast = true,
}: ClipboardOptions = {}) {
  const [hasCopied, setHasCopied] = useState(false)
  const { toast } = useToast()

  // Copy text to clipboard
  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)

        setHasCopied(true)

        // Reset copied state after 2 seconds
        setTimeout(() => {
          setHasCopied(false)
        }, 2000)

        // Show success toast
        if (showToast) {
          toast({
            title: "Success",
            description: successMessage,
          })
        }

        return true
      } catch (error) {
        console.error("Error copying to clipboard:", error)

        // Show error toast
        if (showToast) {
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          })
        }

        return false
      }
    },
    [successMessage, errorMessage, showToast, toast],
  )

  return {
    hasCopied,
    copyToClipboard,
  }
}
