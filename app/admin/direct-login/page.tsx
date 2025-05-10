"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/app/components/LoadingSpinner"
import Image from "next/image"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function DirectLoginPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const attemptLogin = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch("/api/direct-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "hysen@diamondtier.solutions",
            password: "HYbr2016$$",
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || "Login failed")
          setIsLoading(false)
          return
        }

        setSuccess(true)

        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push("/admin")
        }, 1500)
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred")
        setIsLoading(false)
      }
    }

    attemptLogin()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-32 h-32 relative mb-4">
            <Image
              src="/images/diamond-tier-logo.png"
              alt="Diamond Tier Capital Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <CardTitle className="text-xl">Direct Login</CardTitle>
          <CardDescription>Automatically logging you in...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          {isLoading && !success && !error && (
            <div className="flex flex-col items-center space-y-4 py-4">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-gray-500">Logging in as admin...</p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <div className="flex flex-col items-center space-y-2 py-4 text-green-600">
              <CheckCircle className="h-8 w-8" />
              <p>Login successful! Redirecting...</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {(error || success) && (
            <Button onClick={() => router.push("/admin")} variant={error ? "outline" : "default"} className="mt-2">
              {error ? "Back to Login" : "Go to Dashboard"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
