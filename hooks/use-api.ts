"use client"

import { useState, useCallback } from "react"
import { handleError } from "@/lib/utils/error-utils"

type ApiState<T> = {
  data: T | null
  isLoading: boolean
  error: Error | null
}

type ApiOptions = {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  showErrorToast?: boolean
}

/**
 * Hook for making API requests with loading and error states
 */
export function useApi<T = any>(initialData: T | null = null) {
  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
  })

  // Execute an async function with state management
  const execute = useCallback(async <R = T>(asyncFn: () => Promise<R>, options: ApiOptions = {}): Promise<R | null> => {
    const { onSuccess, onError, showErrorToast = true } = options

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const result = await asyncFn()

      setState((prev) => ({ ...prev, data: result as unknown as T, isLoading: false }))

      if (onSuccess) {
        onSuccess(result)
      }

      return result
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))

      setState((prev) => ({ ...prev, error: errorObj, isLoading: false }))

      if (showErrorToast) {
        handleError(error)
      }

      if (onError) {
        onError(errorObj)
      }

      return null
    }
  }, [])

  // Reset the state
  const reset = useCallback(() => {
    setState({
      data: initialData,
      isLoading: false,
      error: null,
    })
  }, [initialData])

  return {
    ...state,
    execute,
    reset,
  }
}
