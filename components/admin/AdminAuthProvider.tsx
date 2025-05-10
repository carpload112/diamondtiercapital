"use client"

import { AuthProvider } from "@/lib/auth"

export function AdminAuthProvider({ children }) {
  return <AuthProvider>{children}</AuthProvider>
}
