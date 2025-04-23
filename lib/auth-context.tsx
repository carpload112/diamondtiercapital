"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  getFirebaseAuth,
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
  const [authInitialized, setAuthInitialized] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Use a small delay to ensure Firebase is fully initialized
    const initializeAuth = setTimeout(() => {
      const auth = getFirebaseAuth()

      if (!auth) {
        setError("Failed to initialize Firebase Auth")
        setLoading(false)
        return
      }

      setAuthInitialized(true)

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

      // Clean up subscription and timeout
      return () => {
        unsubscribe()
      }
    }, 100) // Small delay to ensure Firebase is initialized

    return () => clearTimeout(initializeAuth)
  }, [])

  // Auth methods with error handling
  const login = async (email: string, password: string) => {
    setError(null)

    if (!authInitialized) {
      const errorMessage = "Authentication is still initializing"
      setError(errorMessage)
      throw new Error(errorMessage)
    }

    const auth = getFirebaseAuth()

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

    if (!authInitialized) {
      const errorMessage = "Authentication is still initializing"
      setError(errorMessage)
      throw new Error(errorMessage)
    }

    const auth = getFirebaseAuth()

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

    if (!authInitialized) {
      const errorMessage = "Authentication is still initializing"
      setError(errorMessage)
      throw new Error(errorMessage)
    }

    const auth = getFirebaseAuth()

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

    if (!authInitialized) {
      const errorMessage = "Authentication is still initializing"
      setError(errorMessage)
      throw new Error(errorMessage)
    }

    const auth = getFirebaseAuth()

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
