import {
  getFirestore as getFirebaseFirestore,
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
} from "firebase/firestore"
import { getFirebaseApp } from "./app"

// Get firestore instance
export function getFirestore() {
  const app = getFirebaseApp()
  return app ? getFirebaseFirestore(app) : null
}

// Export firestore methods
export {
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
