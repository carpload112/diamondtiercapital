"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

// Simple admin authentication store
interface AdminAuthState {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
}

// The correct password
const ADMIN_PASSWORD = "Diamond123$$"

export const useAdminAuth = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (password: string) => {
        const isValid = password === ADMIN_PASSWORD
        if (isValid) {
          set({ isAuthenticated: true })
        }
        return isValid
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: "admin-auth",
    },
  ),
)
