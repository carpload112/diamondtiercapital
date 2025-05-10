"use client"

import { createClient } from "./supabase/client"
import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"

// Simple user type
type User = {
  id: string
  email: string | null
}

// Simple auth context
type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signOut: () => Promise<void>
  resetPassword?: (email: string) => Promise<{ error: any | null }>
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAdmin: false,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
})

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClient()

  // Initialize auth state
  useEffect(() => {
    async function initAuth() {
      try {
        const { data } = await supabase.auth.getSession()

        if (data.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email,
          })

          // Check if user is admin
          const { data: adminData } = await supabase
            .from("admin_users")
            .select("*")
            .eq("id", data.session.user.id)
            .single()

          setIsAdmin(!!adminData)
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    // Set up auth state change listener
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
        })

        // Check if user is admin
        const { data: adminData } = await supabase.from("admin_users").select("*").eq("id", session.user.id).single()

        setIsAdmin(!!adminData)
      } else {
        setUser(null)
        setIsAdmin(false)
      }

      setIsLoading(false)
    })

    return () => {
      data.subscription.unsubscribe()
    }
  }, [])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) return { error }

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
  }

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  // Return provider with proper parentheses around JSX
  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth() {
  return useContext(AuthContext)
}
