"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/lib/admin-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Clock, FileText } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"

export default function AdminPage() {
  const { isAuthenticated, login } = useAdminAuth()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    recentApplications: [],
  })
  const router = useRouter()

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    setTimeout(() => {
      const success = login(password)
      if (!success) {
        setError("Invalid password. Please try again.")
      }
      setIsLoading(false)
    }, 500)
  }

  // Fetch dashboard stats if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchStats = async () => {
        try {
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          )

          // Get total applications count
          const { count: totalCount } = await supabase.from("applications").select("*", { count: "exact", head: true })

          // Get pending applications count
          const { count: pendingCount } = await supabase
            .from("applications")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending")

          // Get approved applications count
          const { count: approvedCount } = await supabase
            .from("applications")
            .select("*", { count: "exact", head: true })
            .eq("status", "approved")

          // Get recent applications
          const { data: recentApps } = await supabase
            .from("applications")
            .select(`
              id, 
              status, 
              reference_id, 
              created_at,
              applicant_details!inner(full_name, email)
            `)
            .order("created_at", { ascending: false })
            .limit(5)

          setStats({
            totalApplications: totalCount || 0,
            pendingApplications: pendingCount || 0,
            approvedApplications: approvedCount || 0,
            recentApplications: recentApps || [],
          })
        } catch (error) {
          console.error("Error fetching stats:", error)
        }
      }

      fetchStats()
    }
  }, [isAuthenticated])

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
              <p className="text-slate-500 mt-2">Enter your password to access the admin dashboard</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center mb-4">
                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // If authenticated, show dashboard
  return (
    <div className="space-y-6">
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-slate-500">Total Applications</h3>
              <p className="text-2xl font-bold text-slate-900">{stats.totalApplications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-amber-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-slate-500">Pending Applications</h3>
              <p className="text-2xl font-bold text-slate-900">{stats.pendingApplications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-slate-500">Approved Applications</h3>
              <p className="text-2xl font-bold text-slate-900">{stats.approvedApplications}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent applications */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-medium text-slate-900">Recent Applications</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {stats.recentApplications.length > 0 ? (
            stats.recentApplications.map((app: any) => (
              <div key={app.id} className="p-6 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{app.applicant_details?.[0]?.full_name || "Unknown"}</p>
                  <p className="text-sm text-slate-500">
                    {app.applicant_details?.[0]?.email || "No email"} • Ref: {app.reference_id}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(app.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      app.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : app.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : app.status === "in_review"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1).replace("_", " ")}
                  </span>
                  <Link
                    href={`/admin/applications/${app.id}`}
                    className="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-slate-500">No recent applications found.</div>
          )}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <Link href="/admin/applications" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View all applications →
          </Link>
        </div>
      </div>
    </div>
  )
}
