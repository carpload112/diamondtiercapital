"use client"

import { createClient } from "@/lib/supabase/client"
import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"

type User = {
  id: string
  email: string
  role?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)

      try {
        // Check if user is authenticated
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Error getting session:", sessionError)
          setIsLoading(false)
          return
        }

        if (session?.user) {
          // Get admin role if exists - with the new policies, this should work without recursion
          const { data: adminData, error: adminError } = await supabase
            .from("admin_users")
            .select("role")
            .eq("id", session.user.id)
            .single()

          if (adminError && adminError.code !== "PGRST116") {
            console.error("Error checking admin status:", adminError)
          }

          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: adminData?.role || "user",
          })

          setIsAdmin(!!adminData)
        } else {
          setUser(null)
          setIsAdmin(false)
        }
      } catch (err) {
        console.error("Unexpected error in fetchUser:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          // Get admin role if exists
          const { data: adminData, error: adminError } = await supabase
            .from("admin_users")
            .select("role")
            .eq("id", session.user.id)
            .single()

          if (adminError && adminError.code !== "PGRST116") {
            console.error("Error checking admin status on auth change:", adminError)
          }

          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: adminData?.role || "user",
          })

          setIsAdmin(!!adminData)
        } else {
          setUser(null)
          setIsAdmin(false)
        }
      } catch (err) {
        console.error("Unexpected error in auth state change:", err)
      } finally {
        setIsLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in with:", email)

      // First, authenticate the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Sign in error:", error)
        return { error }
      }

      if (!data.user) {
        console.error("No user returned after sign in")
        return { error: { message: "Authentication failed" } }
      }

      console.log("User signed in successfully:", data.user.id)

      // Now check if the user is an admin - with the new policies, this should work without recursion
      const { data: adminData, error: adminError } = await supabase
        .from("admin_users")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (adminError) {
        console.error("Admin check error:", adminError)
        // If error checking admin status, sign out
        await supabase.auth.signOut()
        return { error: { message: "Error verifying admin access" } }
      }

      if (!adminData) {
        console.error("No admin data found for user")
        await supabase.auth.signOut()
        return { error: { message: "You do not have admin access" } }
      }

      console.log("Admin access confirmed with role:", adminData.role)
      return { error: null }
    } catch (err: any) {
      console.error("Unexpected error during sign in:", err)
      return { error: { message: err.message || "Authentication failed" } }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      })
      return { error }
    } catch (err: any) {
      return { error: { message: err.message || "Password reset failed" } }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
