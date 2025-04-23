"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useFirebase, getAuthMethods, type AuthMethods } from "./firebase"
import type { User } from "firebase/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<any>
  signup: (email: string, password: string) => Promise<any>
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
  const [authMethods, setAuthMethods] = useState<AuthMethods | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Get Firebase instances
  const { auth, isLoading: firebaseLoading, isError: firebaseError } = useFirebase()

  // Load auth methods
  useEffect(() => {
    const loadAuthMethods = async () => {
      try {
        const methods = await getAuthMethods()
        setAuthMethods(methods)
      } catch (err) {
        console.error("Failed to load auth methods:", err)
        setError("Failed to initialize authentication")
      }
    }

    loadAuthMethods()
  }, [])

  // Set up auth state listener once auth is initialized
  useEffect(() => {
    if (!auth || !authMethods || firebaseLoading) return

    let unsubscribe: (() => void) | undefined

    try {
      const { onAuthStateChanged } = authMethods

      unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
        setUser(currentUser)

        // Simple admin check - we'll improve this later
        if (currentUser) {
          setIsAdmin(currentUser.email?.includes("admin") || false)
        } else {
          setIsAdmin(false)
        }

        setLoading(false)
      })
    } catch (err) {
      console.error("Error setting up auth state listener:", err)
      setError("Failed to monitor authentication state")
      setLoading(false)
    }

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [auth, authMethods, firebaseLoading])

  // Set error if Firebase initialization failed
  useEffect(() => {
    if (firebaseError) {
      setError("Failed to initialize Firebase")
      setLoading(false)
    }
  }, [firebaseError])

  // Auth methods with error handling
  const login = async (email: string, password: string) => {
    if (!auth || !authMethods) throw new Error("Authentication is not available")
    setError(null)

    try {
      const { signInWithEmailAndPassword } = authMethods
      return await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      const errorMessage = err.message || "Failed to sign in"
      setError(errorMessage)
      throw err
    }
  }

  const signup = async (email: string, password: string) => {
    if (!auth || !authMethods) throw new Error("Authentication is not available")
    setError(null)

    try {
      const { createUserWithEmailAndPassword } = authMethods
      return await createUserWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      const errorMessage = err.message || "Failed to create account"
      setError(errorMessage)
      throw err
    }
  }

  const logout = async () => {
    if (!auth || !authMethods) throw new Error("Authentication is not available")
    setError(null)

    try {
      const { signOut } = authMethods
      await signOut(auth)
    } catch (err: any) {
      const errorMessage = err.message || "Failed to sign out"
      setError(errorMessage)
      throw err
    }
  }

  const resetPassword = async (email: string) => {
    if (!auth || !authMethods) throw new Error("Authentication is not available")
    setError(null)

    try {
      const { sendPasswordResetEmail } = authMethods
      await sendPasswordResetEmail(auth, email)
    } catch (err: any) {
      const errorMessage = err.message || "Failed to reset password"
      setError(errorMessage)
      throw err
    }
  }

  const value = {
    user,
    loading: loading || firebaseLoading,
    isAdmin,
    login,
    signup,
    logout,
    resetPassword,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
