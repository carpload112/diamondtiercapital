"use client"

import {
  getFirebaseFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "./firebase"

// Types for form data
export interface LoanApplication {
  id?: string
  fullName: string
  email: string
  phone: string
  businessName: string
  businessType: string
  yearsInBusiness: number
  loanAmount: number
  loanPurpose: string
  collateral: string
  annualRevenue: number
  creditScore: string
  bankruptcy: string
  status: "new" | "in-review" | "approved" | "rejected"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreditRepairClient {
  id?: string
  fullName: string
  email: string
  phone: string
  currentScore: number
  desiredScore: number
  issues: string[]
  status: "new" | "in-progress" | "completed"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Submit loan application with better error handling
export const submitLoanApplication = async (
  data: Omit<LoanApplication, "id" | "status" | "createdAt" | "updatedAt">,
): Promise<string> => {
  try {
    const db = getFirebaseFirestore()
    if (!db) {
      throw new Error("Firestore is not available")
    }

    const docRef = await addDoc(collection(db, "loanApplications"), {
      ...data,
      status: "new",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return docRef.id
  } catch (error: any) {
    console.error("Error submitting loan application:", error)
    throw new Error(`Failed to submit loan application: ${error.message || "Unknown error"}`)
  }
}

// Submit credit repair application with better error handling
export const submitCreditRepairApplication = async (
  data: Omit<CreditRepairClient, "id" | "status" | "createdAt" | "updatedAt">,
): Promise<string> => {
  try {
    const db = getFirebaseFirestore()
    if (!db) {
      throw new Error("Firestore is not available")
    }

    const docRef = await addDoc(collection(db, "creditRepairClients"), {
      ...data,
      status: "new",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return docRef.id
  } catch (error: any) {
    console.error("Error submitting credit repair application:", error)
    throw new Error(`Failed to submit credit repair application: ${error.message || "Unknown error"}`)
  }
}

// Get all loan applications with better error handling
export const getLoanApplications = async (): Promise<LoanApplication[]> => {
  try {
    const db = getFirebaseFirestore()
    if (!db) {
      throw new Error("Firestore is not available")
    }

    const q = query(collection(db, "loanApplications"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamps to JS Dates
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as LoanApplication[]
  } catch (error: any) {
    console.error("Error getting loan applications:", error)
    throw new Error(`Failed to get loan applications: ${error.message || "Unknown error"}`)
  }
}

// Get all credit repair clients with better error handling
export const getCreditRepairClients = async (): Promise<CreditRepairClient[]> => {
  try {
    const db = getFirebaseFirestore()
    if (!db) {
      throw new Error("Firestore is not available")
    }

    const q = query(collection(db, "creditRepairClients"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamps to JS Dates
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as CreditRepairClient[]
  } catch (error: any) {
    console.error("Error getting credit repair clients:", error)
    throw new Error(`Failed to get credit repair clients: ${error.message || "Unknown error"}`)
  }
}

// Update loan application with better error handling
export const updateLoanApplication = async (id: string, data: Partial<LoanApplication>): Promise<boolean> => {
  try {
    const db = getFirebaseFirestore()
    if (!db) {
      throw new Error("Firestore is not available")
    }

    const docRef = doc(db, "loanApplications", id)

    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })

    return true
  } catch (error: any) {
    console.error("Error updating loan application:", error)
    throw new Error(`Failed to update loan application: ${error.message || "Unknown error"}`)
  }
}

// Update credit repair client with better error handling
export const updateCreditRepairClient = async (id: string, data: Partial<CreditRepairClient>): Promise<boolean> => {
  try {
    const db = getFirebaseFirestore()
    if (!db) {
      throw new Error("Firestore is not available")
    }

    const docRef = doc(db, "creditRepairClients", id)

    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })

    return true
  } catch (error: any) {
    console.error("Error updating credit repair client:", error)
    throw new Error(`Failed to update credit repair client: ${error.message || "Unknown error"}`)
  }
}

// Delete loan application with better error handling
export const deleteLoanApplication = async (id: string): Promise<boolean> => {
  try {
    const db = getFirebaseFirestore()
    if (!db) {
      throw new Error("Firestore is not available")
    }

    await deleteDoc(doc(db, "loanApplications", id))

    return true
  } catch (error: any) {
    console.error("Error deleting loan application:", error)
    throw new Error(`Failed to delete loan application: ${error.message || "Unknown error"}`)
  }
}

// Delete credit repair client with better error handling
export const deleteCreditRepairClient = async (id: string): Promise<boolean> => {
  try {
    const db = getFirebaseFirestore()
    if (!db) {
      throw new Error("Firestore is not available")
    }

    await deleteDoc(doc(db, "creditRepairClients", id))

    return true
  } catch (error: any) {
    console.error("Error deleting credit repair client:", error)
    throw new Error(`Failed to delete credit repair client: ${error.message || "Unknown error"}`)
  }
}
