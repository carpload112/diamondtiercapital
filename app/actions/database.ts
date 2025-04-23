"use server"

import { getAdminFirestore } from "@/lib/firebase-admin"
import { cookies } from "next/headers"
import { verifyIdToken } from "@/lib/firebase-admin"

// Verify the user's session
async function verifySession() {
  const sessionCookie = cookies().get("session")?.value
  if (!sessionCookie) return null

  try {
    const decodedToken = await verifyIdToken(sessionCookie)
    return decodedToken
  } catch (error) {
    console.error("Error verifying session:", error)
    return null
  }
}

// Get user profile data
export async function getUserProfile(userId: string) {
  try {
    // Verify the user is authenticated
    const session = await verifySession()
    if (!session || session.uid !== userId) {
      return { error: "Unauthorized" }
    }

    const db = getAdminFirestore()
    const userDoc = await db.collection("users").doc(userId).get()

    if (!userDoc.exists) {
      return { error: "User not found" }
    }

    return { data: userDoc.data() }
  } catch (error: any) {
    console.error("Error getting user profile:", error)
    return { error: error.message }
  }
}

// Update user profile data
export async function updateUserProfile(userId: string, data: any) {
  try {
    // Verify the user is authenticated
    const session = await verifySession()
    if (!session || session.uid !== userId) {
      return { error: "Unauthorized" }
    }

    const db = getAdminFirestore()
    await db.collection("users").doc(userId).set(data, { merge: true })

    return { success: true }
  } catch (error: any) {
    console.error("Error updating user profile:", error)
    return { error: error.message }
  }
}

// Submit loan application
export async function submitLoanApplication(data: any) {
  try {
    // Verify the user is authenticated
    const session = await verifySession()
    if (!session) {
      return { error: "Unauthorized" }
    }

    const db = getAdminFirestore()

    // Add user ID to the application data
    const applicationData = {
      ...data,
      userId: session.uid,
      createdAt: new Date(),
      status: "pending",
    }

    const docRef = await db.collection("loanApplications").add(applicationData)

    return { success: true, applicationId: docRef.id }
  } catch (error: any) {
    console.error("Error submitting loan application:", error)
    return { error: error.message }
  }
}

// Get loan applications (admin only)
export async function getLoanApplications() {
  try {
    // Verify the user is an admin
    const session = await verifySession()
    if (!session || !session.email?.includes("admin")) {
      return { error: "Unauthorized" }
    }

    const db = getAdminFirestore()
    const snapshot = await db.collection("loanApplications").orderBy("createdAt", "desc").limit(100).get()

    const applications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return { data: applications }
  } catch (error: any) {
    console.error("Error getting loan applications:", error)
    return { error: error.message }
  }
}
