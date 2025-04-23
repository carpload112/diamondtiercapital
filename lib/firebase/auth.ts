import {
  getAuth as getFirebaseAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth"
import { getFirebaseApp } from "./app"

// Get auth instance
export function getAuth() {
  const app = getFirebaseApp()
  return app ? getFirebaseAuth(app) : null
}

// Export auth methods
export {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
}
