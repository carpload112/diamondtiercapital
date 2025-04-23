import * as admin from "firebase-admin"

// Initialize Firebase Admin SDK
// Check if already initialized to prevent multiple initializations
let firebaseAdmin: admin.app.App

function getFirebaseAdmin() {
  if (!firebaseAdmin && typeof window === "undefined") {
    // Only initialize on the server side
    const serviceAccount = {
      type: "service_account",
      project_id: "diamondtiercapital",
      private_key_id: "ef16117dcb478cac96ab0d520e13312c67abb762",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDJaOfmidtt8gBu\n0vVtmXt3kA8KOnGAGxNT0rrhDeJXknOPF88dVpbx3zIEUUV9DYV+9XpeBHRDWH6A\nnSRKmtn4mjjTq/XbIzfmvE6k6XYbNrMrzfrrSrcZEVYHyVR4dYa2/xMp3l3UoGSi\nWxzCo832G+Oj4f6VMcFIYTukDn4/TotVKlCKb5Lfs30NhFZ3Q9iiAa+ZM+4lcs1o\n+6QSN1GVxP3i83VBLDZ/qK1nAW/gjfnoxv6zT0n4ss7+AgcLvJyfR9eofW9gztlj\nYlb420vVQeSeny9H3wENxQQNY20hfYRkA8P25qgsUcPuBpF2uHKldRTkYMkNOgyb\nYfE5WeGpAgMBAAECggEADNUNvV74J4udInJ3Z5m5R5dalfS+SYKwGw2YkYEwdBLl\nIO9L51sed9+YELVa34pOgJXES5wuCiJnwOsCJmyySYgN6dKRcfpO8/j4a8JiH36/\nMKHJhFc4zjSQDiPyKVCXmi4rOuYrhUII111FulL0auNBAC6EaV4HqgRj5+Jygbby\nyNjpef7BuGoERVCtEw6/9aZoLytriBaxzGH6ASJa4+/ldPeVs/kcd2iJTf/2o8xA\nCXvsSDpmUbPrL3cgv9ekXbq1p+tXrfgUnnllprZQrlUShV3FwIT1ZykHM3XE6EaS\nh3BQqGDHK7SC7V5F+lNJxDep3IIznemKZtvvW7LhFwKBgQD8vMPv9No0IXTXa2HB\nR2OMyyj+vdrEyzffZZBAIMGZ0Xhxg8gvBKe2IeRxWNlUQq4etJqacSAl/K+laNXx\nwt1d6vSm7bMNf5beyMH4Ltl/UrPYPFhvM7cvAiD8cuUIG6mJqZYOhUsDRmgyu5zQ\nhBTo1W9mVHUgb6H+l7nTc2/P3wKBgQDMAoP4XOsw3233jciORnrL5DCHEcEpYfD/\nLOjWbtEZUuN4LbB1v4SRAsBrmVg6SU3TbwiR/I4y6DmshHItkLQR5Qf4UQfmoKSt\nGtMglVgB3w5hFmMhLQjVQcgegOYMHtgB1uqnFdyJrW9Gtm6TcyDZsv8GYNShCW27\nSFV821PfdwKBgHdPPUgX1LJrYNcY8Crn4ozik1W+lnn0XUnujixXyk0s36jmxye7\nENkgItGHWgE3AS+pnppt8Pk90kVJukXI8euWMSxkZfRnWPeO2lKo+y/qANCBnFXS\nmhVs8dl6+7faJyy/jAEK16CSKjpY6uxcjepkZ5RtJmXLjTO8uJKjmhMNAoGAMMRB\nK7N6fRpLvStlT61FWUvY1dDGrc+9viHMHsYqsbUArw+s6Ni5JbjUqmPjlTtEoVAf\nalZG36BnePfIG2BFyylGeHNWQikQdFi/M0C/4uKhG1AwrhOH0wKAhdomI6uT0wy+\n1uYA6+BLg0nEsPaKWb/R+oJXEY+hbW1jEg+Tww0CgYEAzs7WwPu67YR5cWh7ol6Q\nPHTDTUePGLh6x5rtgoNUGKNvTBn5OVkt0x3dBjAB0BLsN7zUEVbmqG1FWnAIivWk\nUOm1vLAf2EQFJ1JKQD3VYUOUOFYIc8PWbmQniSlyW9bNKcHes6S7jy9IJ/+VIw6p\n931G42VP19FZQDyuVhU1dLc=\n-----END PRIVATE KEY-----\n",
      client_email: "firebase-adminsdk-fbsvc@diamondtiercapital.iam.gserviceaccount.com",
      client_id: "109980648858832434293",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40diamondtiercapital.iam.gserviceaccount.com",
      universe_domain: "googleapis.com",
    }

    try {
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      })
    } catch (error) {
      // Check if the error is because the app is already initialized
      if (error instanceof Error && error.message.includes("already exists")) {
        firebaseAdmin = admin.app()
      } else {
        console.error("Firebase Admin initialization error:", error)
        throw error
      }
    }
  } else if (firebaseAdmin) {
    // Return existing instance
    return firebaseAdmin
  } else {
    // This should only happen if trying to use on client side
    throw new Error("Firebase Admin SDK can only be used on the server side")
  }

  return firebaseAdmin
}

// Function to get Admin Auth
export function getAdminAuth() {
  const app = getFirebaseAdmin()
  return app.auth()
}

// Function to verify ID token
export async function verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken> {
  try {
    const app = getFirebaseAdmin()
    return await app.auth().verifyIdToken(token)
  } catch (error) {
    console.error("Error verifying ID token:", error)
    throw error
  }
}

// Function to create a custom token
export async function createCustomToken(uid: string): Promise<string> {
  try {
    const app = getFirebaseAdmin()
    return await app.auth().createCustomToken(uid)
  } catch (error) {
    console.error("Error creating custom token:", error)
    throw error
  }
}

// Function to get user by ID
export async function getUserById(uid: string): Promise<admin.auth.UserRecord> {
  try {
    const app = getFirebaseAdmin()
    return await app.auth().getUser(uid)
  } catch (error) {
    console.error("Error getting user by ID:", error)
    throw error
  }
}

// Function to get Firestore database
export function getAdminFirestore() {
  const app = getFirebaseAdmin()
  return app.firestore()
}
