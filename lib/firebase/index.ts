import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { firebaseConfig } from "./config"

// Initialize Firebase only on the client side
let app, auth, db

// Initialize Firebase
if (typeof window !== "undefined") {
  try {
    // Initialize the Firebase app
    app = initializeApp(firebaseConfig)

    // Initialize Firebase services
    auth = getAuth(app)
    db = getFirestore(app)
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

// Export initialized instances
export { app, auth, db }

// Export Firebase methods
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth"

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
} from "firebase/firestore"
