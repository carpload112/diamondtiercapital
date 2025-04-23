"use client"

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  type User,
  type Auth,
} from "firebase/auth"
import {
  getFirestore,
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
  type Firestore,
} from "firebase/firestore"

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

// Define a class to handle Firebase initialization and services
class FirebaseClient {
  private static instance: FirebaseClient
  private app: FirebaseApp | null = null
  private _auth: Auth | null = null
  private _firestore: Firestore | null = null
  private _initialized = false

  private constructor() {
    // Private constructor to enforce singleton pattern
    if (typeof window !== "undefined") {
      try {
        if (!getApps().length) {
          this.app = initializeApp(firebaseConfig)
        } else {
          this.app = getApp()
        }
        this._initialized = true
      } catch (error) {
        console.error("Firebase initialization error:", error)
      }
    }
  }

  public static getInstance(): FirebaseClient {
    if (!FirebaseClient.instance) {
      FirebaseClient.instance = new FirebaseClient()
    }
    return FirebaseClient.instance
  }

  public get initialized(): boolean {
    return this._initialized
  }

  public get auth(): Auth | null {
    if (!this._auth && this.app && typeof window !== "undefined") {
      try {
        this._auth = getAuth(this.app)
      } catch (error) {
        console.error("Firebase auth initialization error:", error)
      }
    }
    return this._auth
  }

  public get firestore(): Firestore | null {
    if (!this._firestore && this.app && typeof window !== "undefined") {
      try {
        this._firestore = getFirestore(this.app)
      } catch (error) {
        console.error("Firebase firestore initialization error:", error)
      }
    }
    return this._firestore
  }
}

// Export a function to get the Firebase client
export function getFirebaseClient(): FirebaseClient {
  return FirebaseClient.getInstance()
}

// Helper functions to access Firebase services
export function getFirebaseAuth(): Auth | null {
  if (typeof window === "undefined") return null
  const client = getFirebaseClient()
  return client.auth
}

export function getFirebaseFirestore(): Firestore | null {
  if (typeof window === "undefined") return null
  const client = getFirebaseClient()
  return client.firestore
}

// Export Firebase methods
export {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  type User,
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
