import { initializeApp, getApps, getApp } from "firebase/app"
import { firebaseConfig } from "./config"

// Initialize Firebase app - singleton pattern
export function getFirebaseApp() {
  if (typeof window === "undefined") return null

  if (getApps().length === 0) {
    return initializeApp(firebaseConfig)
  } else {
    return getApp()
  }
}
