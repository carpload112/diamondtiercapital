"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  type User,
} from "./firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  error: string | null
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  login: async () => {
    throw new Error("Auth not initialized")
  },
  signup: async () => {
    throw new Error("Auth not initialized")
  },
  logout: async () => {
    throw new Error("Auth not initialized")
  },
  resetPassword: async () => {
    throw new Error("Auth not initialized")
  },
  error: null,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return
    if (!auth) {
      setError("Firebase Auth is not available")
      setLoading(false)
      return
    }

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser)

        // Simple admin check
        if (currentUser) {
          setIsAdmin(currentUser.email?.includes("admin") || false)
        } else {
          setIsAdmin(false)
        }

        setLoading(false)
      },
      (error) => {
        console.error("Auth state change error:", error)
        setError("Authentication error: " + error.message)
        setLoading(false)
      },
    )

    // Clean up subscription
    return () => unsubscribe()
  }, [])

  // Auth methods with error handling
  const login = async (email: string, password: string) => {
    setError(null)

    if (!auth) {
      const errorMessage = "Authentication is not available"
      setError(errorMessage)
      throw new Error(errorMessage)
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      const errorMessage = err.message || "Failed to sign in"
      setError(errorMessage)
      throw err
    }
  }

  const signup = async (email: string, password: string) => {
    setError(null)

    if (!auth) {
      const errorMessage = "Authentication is not available"
      setError(errorMessage)
      throw new Error(errorMessage)
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      const errorMessage = err.message || "Failed to create account"
      setError(errorMessage)
      throw err
    }
  }

  const logout = async () => {
    setError(null)

    if (!auth) {
      const errorMessage = "Authentication is not available"
      setError(errorMessage)
      throw new Error(errorMessage)
    }

    try {
      await signOut(auth)
    } catch (err: any) {
      const errorMessage = err.message || "Failed to sign out"
      setError(errorMessage)
      throw err
    }
  }

  const resetPassword = async (email: string) => {
    setError(null)

    if (!auth) {
      const errorMessage = "Authentication is not available"
      setError(errorMessage)
      throw new Error(errorMessage)
    }

    try {
      await sendPasswordResetEmail(auth, email)
    } catch (err: any) {
      const errorMessage = err.message || "Failed to reset password"
      setError(errorMessage)
      throw err
    }
  }

  const value = {
    user,
    loading,
    isAdmin,
    login,
    signup,
    logout,
    resetPassword,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
