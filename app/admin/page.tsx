"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/app/components/LoadingSpinner"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

export default function AdminPage() {
  const { user, isAdmin, signIn } = useAuth()
  const [email, setEmail] = useState("hysen@diamondtier.solutions")
  const [password, setPassword] = useState("HYbr2016$$")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("Submitting login with:", email)
      const { error } = await signIn(email, password)
      if (error) {
        console.error("Login error:", error)
        setError(error.message || "Authentication failed")
      }
    } catch (err: any) {
      console.error("Unexpected login error:", err)
      setError(err.message || "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // If already authenticated as admin, show dashboard
  if (isAdmin) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <CardDescription>All time application count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Loading...</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <CardDescription>Applications awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Loading...</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved Applications</CardTitle>
            <CardDescription>Successfully approved applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Loading...</div>
            <p className="text-xs text-muted-foreground">+0% from last month</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Otherwise, show login form
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
          <CardTitle className="text-xl">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <div className="text-right">
                  <Link href="/admin/reset-password" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size="sm" /> : "Sign In"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 items-center">
          <div className="text-center text-sm text-gray-500">
            <Link href="/api/setup-admin" className="text-blue-600 hover:underline">
              Setup Admin Account
            </Link>
          </div>
          <div className="text-center text-sm text-gray-500">
            <span>Having trouble? Try </span>
            <Link href="/admin/direct-login" className="text-blue-600 hover:underline">
              Direct Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
