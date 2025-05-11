"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/lib/admin-auth"

export default function AdminAuthWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="mb-4">You need to be logged in to view this page.</p>
          <button
            onClick={() => router.push("/admin")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
