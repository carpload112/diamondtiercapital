"use client"

import { AuthProvider } from "@/lib/auth"
import type { ReactNode } from "react"

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
