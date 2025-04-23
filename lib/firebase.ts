"\"use client"

import { initializeApp, getApps } from "firebase/app"
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  type User,
} from "firebase/auth"
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGxKS0natTGpA1cMj6mwHsnThJZo5BOLE",
  authDomain: "diamondtiercapital.firebaseapp.com",
  projectId: "diamondtiercapital",
  storageBucket: "diamondtiercapital.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "526367112586",
  appId: "1:526367112586:web:12249a5b3fc3aad8585c73",
  measurementId: "G-6FPGZQJQGS",
}

// Initialize Firebase with a singleton pattern
let firebaseApp
let firebaseAuth
let firebaseDb

// Initialize Firebase only on the client side
if (typeof window !== "undefined") {
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig)
  } else {
    firebaseApp = getApps()[0]
  }

  // Initialize services
  firebaseAuth = getAuth(firebaseApp)
  firebaseDb = getFirestore(firebaseApp)
}

// Export initialized instances
export const auth = firebaseAuth
export const db = firebaseDb

// Export Firebase methods for convenience
export {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  type User,
  getFirestore as getFirebaseFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
}
