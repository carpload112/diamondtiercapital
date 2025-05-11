"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createClientClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { handleError } from "@/lib/utils/error-utils"

// Define the auth user type
type AuthUser = {
  id: string
  email: string
  role: string
} | null

// Define the auth context type
type AuthContextType = {
  user: AuthUser
  isLoading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientClient()

  // Check if user is admin
  const isAdmin = user?.role === "admin"

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true)

        // Get session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          // Get user data
          const { data: userData, error: userError } = await supabase
            .from("admin_users")
            .select("id, email, role")
            .eq("id", session.user.id)
            .single()

          if (userError) throw userError

          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        handleError(error, "Failed to initialize authentication", true)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Get user data on auth change
        const { data: userData } = await supabase
          .from("admin_users")
          .select("id, email, role")
          .eq("id", session.user.id)
          .single()

        setUser(userData)
      } else {
        setUser(null)
      }

      // Refresh the page to update server components
      router.refresh()
    })

    // Clean up subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push("/admin")
    } catch (error) {
      handleError(error, "Failed to sign in. Please check your credentials.")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      setIsLoading(true)

      const { error } = await supabase.auth.signOut()

      if (error) throw error

      router.push("/admin/login")
    } catch (error) {
      handleError(error, "Failed to sign out")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Provide auth context
  return <AuthContext.Provider value={{ user, isLoading, isAdmin, signIn, signOut }}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
