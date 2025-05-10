"use client"

import { AuthProvider } from "@/lib/auth"
import type React from "react"

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
