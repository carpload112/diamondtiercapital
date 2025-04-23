"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getFirebaseFirestore, collection, getDocs } from "@/lib/firebase"

export default function FirebaseTestPage() {
  const { user, loading, error: authError } = useAuth()
  const [testData, setTestData] = useState<any[]>([])
  const [testError, setTestError] = useState<string | null>(null)
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [isClient, setIsClient] = useState(false)

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Test Firestore connection
  const testFirestore = async () => {
    setTestStatus("testing")
    setTestError(null)

    try {
      const firestore = getFirebaseFirestore()
      if (!firestore) {
        throw new Error("Firestore is not initialized")
      }

      // Try to fetch some data
      const querySnapshot = await getDocs(collection(firestore, "test-collection"))
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setTestData(data)
      setTestStatus("success")
    } catch (error: any) {
      console.error("Firestore test error:", error)
      setTestError(error.message || "Unknown error")
      setTestStatus("error")
    }
  }

  // If we're not on the client side yet, show a loading message
  if (!isClient) {
    return <div className="min-h-screen p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Firebase Test Page</h1>

      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
        {loading ? (
          <p>Loading authentication...</p>
        ) : (
          <div>
            <p>
              Auth initialized: <span className="font-medium">{loading ? "Loading..." : "Yes"}</span>
            </p>
            <p>
              User logged in: <span className="font-medium">{user ? "Yes" : "No"}</span>
            </p>
            {user && (
              <div className="mt-2">
                <p>User email: {user.email}</p>
                <p>User ID: {user.uid}</p>
              </div>
            )}
            {authError && (
              <div className="mt-2 p-2 bg-red-50 text-red-600 rounded">
                <p>Auth Error: {authError}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Firestore Test</h2>
        <button
          onClick={testFirestore}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          disabled={testStatus === "testing"}
        >
          {testStatus === "testing" ? "Testing..." : "Test Firestore Connection"}
        </button>

        {testStatus === "success" && (
          <div className="mt-4">
            <p className="text-green-600">Firestore connection successful!</p>
            <p>Retrieved {testData.length} documents</p>
            {testData.length > 0 && (
              <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">{JSON.stringify(testData, null, 2)}</pre>
            )}
          </div>
        )}

        {testStatus === "error" && (
          <div className="mt-4">
            <p className="text-red-600">Firestore test failed:</p>
            <p>{testError}</p>
          </div>
        )}
      </div>
    </div>
  )
}
