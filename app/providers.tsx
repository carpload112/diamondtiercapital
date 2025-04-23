"use client"

import { type ReactNode, useEffect, useState } from "react"
import { AuthProvider } from "@/lib/auth-context"

export function Providers({ children }: { children: ReactNode }) {
  // Use state to track if we're on the client
  const [isMounted, setIsMounted] = useState(false)

  // Simple check to ensure we're on the client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // During SSR or initial render, just render children without auth
  if (!isMounted) {
    return <>{children}</>
  }

  // On client, render with auth provider
  return <AuthProvider>{children}</AuthProvider>
}
