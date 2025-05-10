"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/lib/admin-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardStats } from "@/components/admin/DashboardStats"
import { KanbanBoard } from "@/components/admin/KanbanBoard"
import { ClientList } from "@/components/admin/ClientList"

export default function AdminPage() {
  const { isAuthenticated, login } = useAdminAuth()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
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
      const fetchData = async () => {
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

          // Get rejected applications count
          const { count: rejectedCount } = await supabase
            .from("applications")
            .select("*", { count: "exact", head: true })
            .eq("status", "rejected")

          // Get all applications
          const { data: allApplications } = await supabase
            .from("applications")
            .select(`
              id, 
              reference_id, 
              status, 
              created_at,
              applicant_details (
                full_name, 
                email
              ),
              business_details (
                business_name,
                business_type
              ),
              funding_requests (
                amount_requested
              )
            `)
            .order("created_at", { ascending: false })

          setStats({
            totalApplications: totalCount || 0,
            pendingApplications: pendingCount || 0,
            approvedApplications: approvedCount || 0,
            rejectedApplications: rejectedCount || 0,
          })

          setApplications(allApplications || [])
        } catch (error) {
          console.error("Error fetching data:", error)
        }
      }

      fetchData()
    }
  }, [isAuthenticated])

  // Handle status change from Kanban board
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

      const { error } = await supabase.from("applications").update({ status: newStatus }).eq("id", id)

      if (error) throw error

      // Update local state to reflect the change
      setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)))

      // Update stats
      const newStats = { ...stats }

      // Decrement old status count
      const oldApp = applications.find((app) => app.id === id)
      if (oldApp) {
        switch (oldApp.status) {
          case "pending":
            newStats.pendingApplications--
            break
          case "approved":
            newStats.approvedApplications--
            break
          case "rejected":
            newStats.rejectedApplications--
            break
        }
      }

      // Increment new status count
      switch (newStatus) {
        case "pending":
          newStats.pendingApplications++
          break
        case "approved":
          newStats.approvedApplications++
          break
        case "rejected":
          newStats.rejectedApplications++
          break
      }

      setStats(newStats)
    } catch (error) {
      console.error("Error updating application status:", error)
    }
  }

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
      <DashboardStats
        totalApplications={stats.totalApplications}
        pendingApplications={stats.pendingApplications}
        approvedApplications={stats.approvedApplications}
        rejectedApplications={stats.rejectedApplications}
      />

      {/* Tabs for different views */}
      <Tabs defaultValue="kanban" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="list">Client List</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="space-y-4">
          <KanbanBoard applications={applications} onStatusChange={handleStatusChange} />
        </TabsContent>

        <TabsContent value="list">
          <ClientList applications={applications} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
