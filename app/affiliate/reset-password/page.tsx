"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { affiliateUpdatePassword } from "@/lib/supabase/affiliate-auth-actions"
import { createClientClient } from "@/lib/supabase/client"

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [validToken, setValidToken] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const handleTokenValidation = async () => {
      // Check if we have the necessary parameters from the reset password email
      const code = searchParams.get("code")

      if (!code) {
        setErrorMessage("Invalid or expired password reset link")
        return
      }

      try {
        // Verify the token with Supabase
        const supabase = createClientClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          setErrorMessage("Invalid or expired password reset link")
        } else {
          setValidToken(true)
        }
      } catch (error) {
        console.error("Token validation error:", error)
        setErrorMessage("An error occurred while validating your reset link")
      }
    }

    handleTokenValidation()
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match")
      return
    }

    setLoading(true)
    setErrorMessage(null)

    try {
      const formData = new FormData()
      formData.append("password", password)

      const result = await affiliateUpdatePassword(formData)

      if (result.error) {
        setErrorMessage(result.error)
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setSuccess(true)
        toast({
          title: "Password Updated",
          description: "Your password has been updated successfully",
        })

        // Redirect to login after a short delay
        setTimeout(() => {
          router.push("/affiliate/login")
        }, 3000)
      }
    } catch (error) {
      console.error("Update password error:", error)
      setErrorMessage("An unexpected error occurred. Please try again.")
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>Create a new password for your account</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="bg-green-50 text-green-800 p-4 rounded-md">
              <p className="font-medium">Password updated successfully!</p>
              <p className="mt-2 text-sm">
                Your password has been reset. You will be redirected to the login page shortly.
              </p>
            </div>
          ) : !validToken ? (
            <div className="bg-red-50 text-red-800 p-4 rounded-md">
              <p className="font-medium">Invalid Reset Link</p>
              <p className="mt-2 text-sm">
                {errorMessage || "This password reset link is invalid or has expired. Please request a new one."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">{errorMessage}</div>}
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Reset Password"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/affiliate/login" className="text-sm text-blue-600 hover:underline">
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
