"use client"

import { useState, useEffect } from "react"
import type { FirebaseApp } from "firebase/app"
import type { Auth, User } from "firebase/auth"
import type { Firestore } from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGxKS0natTGpA1cMj6mwHsnThJZo5BOLE",
  authDomain: "diamondtiercapital.firebaseapp.com",
  projectId: "diamondtiercapital",
  storageBucket: "diamondtiercapital.firebasestorage.app",
  messagingSenderId: "526367112586",
  appId: "1:526367112586:web:12249a5b3fc3aad8585c73",
  measurementId: "G-6FPGZQJQGS",
}

// Global variables to hold Firebase instances
let firebaseApp: FirebaseApp | null = null
let firebaseAuth: Auth | null = null
let firebaseFirestore: Firestore | null = null
let isInitializing = false

// Initialize Firebase only on client side
export const initFirebase = async () => {
  // Return early if not in browser
  if (typeof window === "undefined") return null

  // Return existing instances if already initialized
  if (firebaseApp) return { app: firebaseApp, auth: firebaseAuth, firestore: firebaseFirestore }

  // Prevent multiple simultaneous initialization attempts
  if (isInitializing) {
    // Wait a bit and check again
    await new Promise((resolve) => setTimeout(resolve, 100))
    if (firebaseApp) return { app: firebaseApp, auth: firebaseAuth, firestore: firebaseFirestore }
  }

  isInitializing = true

  try {
    // Dynamically import Firebase modules
    const { initializeApp } = await import("firebase/app")
    const { getAuth } = await import("firebase/auth")
    const { getFirestore } = await import("firebase/firestore")

    // Initialize Firebase
    firebaseApp = initializeApp(firebaseConfig)

    // Initialize services
    firebaseAuth = getAuth(firebaseApp)
    firebaseFirestore = getFirestore(firebaseApp)

    console.log("Firebase initialized successfully")

    return { app: firebaseApp, auth: firebaseAuth, firestore: firebaseFirestore }
  } catch (error) {
    console.error("Firebase initialization error:", error)
    return null
  } finally {
    isInitializing = false
  }
}

// Firebase hook with proper TypeScript types
interface FirebaseState {
  app: FirebaseApp | null
  auth: Auth | null
  firestore: Firestore | null
  isLoading: boolean
  isError: boolean
}

export function useFirebase() {
  const [firebase, setFirebase] = useState<FirebaseState>({
    app: null,
    auth: null,
    firestore: null,
    isLoading: true,
    isError: false,
  })

  useEffect(() => {
    let isMounted = true

    const loadFirebase = async () => {
      try {
        const result = await initFirebase()

        if (!isMounted) return

        if (result) {
          setFirebase({
            app: result.app,
            auth: result.auth,
            firestore: result.firestore,
            isLoading: false,
            isError: false,
          })
        } else {
          setFirebase((prev) => ({
            ...prev,
            isLoading: false,
            isError: true,
          }))
        }
      } catch (error) {
        console.error("Error loading Firebase:", error)

        if (!isMounted) return

        setFirebase((prev) => ({
          ...prev,
          isLoading: false,
          isError: true,
        }))
      }
    }

    loadFirebase()

    return () => {
      isMounted = false
    }
  }, [])

  return firebase
}

// Type definitions for auth methods
export interface AuthMethods {
  signInWithEmailAndPassword: (auth: Auth, email: string, password: string) => Promise<any>
  createUserWithEmailAndPassword: (auth: Auth, email: string, password: string) => Promise<any>
  signOut: (auth: Auth) => Promise<void>
  sendPasswordResetEmail: (auth: Auth, email: string) => Promise<void>
  onAuthStateChanged: (auth: Auth, callback: (user: User | null) => void) => () => void
}

// Export Firebase auth methods
export const getAuthMethods = async (): Promise<AuthMethods | null> => {
  if (typeof window === "undefined") return null

  try {
    const {
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      signOut,
      sendPasswordResetEmail,
      onAuthStateChanged,
    } = await import("firebase/auth")

    return {
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      signOut,
      sendPasswordResetEmail,
      onAuthStateChanged,
    }
  } catch (error) {
    console.error("Error loading auth methods:", error)
    return null
  }
}

// Type definitions for Firestore methods
export interface FirestoreMethods {
  collection: any
  doc: any
  getDoc: any
  getDocs: any
  setDoc: any
  addDoc: any
  updateDoc: any
  deleteDoc: any
  query: any
  where: any
  orderBy: any
  limit: any
  serverTimestamp: any
}

// Export Firestore methods
export const getFirestoreMethods = async (): Promise<FirestoreMethods | null> => {
  if (typeof window === "undefined") return null

  try {
    const {
      collection,
      doc,
      getDoc,
      getDocs,
      setDoc,
      addDoc,
      updateDoc,
      deleteDoc,
      query,
      where,
      orderBy,
      limit,
      serverTimestamp,
    } = await import("firebase/firestore")

    return {
      collection,
      doc,
      getDoc,
      getDocs,
      setDoc,
      addDoc,
      updateDoc,
      deleteDoc,
      query,
      where,
      orderBy,
      limit,
      serverTimestamp,
    }
  } catch (error) {
    console.error("Error loading firestore methods:", error)
    return null
  }
}
