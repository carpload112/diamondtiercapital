"use client"

import { AuthProvider } from "@/lib/auth"
import type { ReactNode } from "react"

// Simple wrapper around AuthProvider
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
