"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User, AuthError } from "@supabase/supabase-js"

// Define the auth context type
type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
}

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAdmin: false,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
})

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClient()

  // Check if user is admin
  const checkIfAdmin = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("admin_users").select("*").eq("user_id", userId).single()

      if (error) {
        console.error("Error checking admin status:", error)
        return false
      }

      return !!data
    } catch (err) {
      console.error("Unexpected error checking admin status:", err)
      return false
    }
  }

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)
          const adminStatus = await checkIfAdmin(session.user.id)
          setIsAdmin(adminStatus)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        const adminStatus = await checkIfAdmin(session.user.id)
        setIsAdmin(adminStatus)
      } else {
        setUser(null)
        setIsAdmin(false)
      }
      setIsLoading(false)
    })

    // Clean up subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Sign in error:", error)
        return { error }
      }

      if (data.user) {
        const adminStatus = await checkIfAdmin(data.user.id)
        setIsAdmin(adminStatus)
      }

      return { error: null }
    } catch (err) {
      console.error("Unexpected sign in error:", err)
      return { error: err as AuthError }
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setIsAdmin(false)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Provide auth context
  return <AuthContext.Provider value={{ user, isLoading, isAdmin, signIn, signOut }}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth() {
  return useContext(AuthContext)
}
