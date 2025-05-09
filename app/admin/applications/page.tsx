"use client"

import { useState, useEffect } from "react"
import { createClientClient } from "@/lib/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KanbanBoard } from "@/components/admin/KanbanBoard"
import { ClientList } from "@/components/admin/ClientList"
import { useToast } from "@/hooks/use-toast"

interface Application {
  id: string
  reference_id: string
  status: string
  created_at: string
  full_name: string
  email: string
  phone: string
  business_name: string
  business_type: string
  amount_requested: string | number
  industry: string
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchApplications() {
      const supabase = createClientClient()

      try {
        // Get all applications
        const { data: applicationsData, error: applicationsError } = await supabase
          .from("applications")
          .select("*")
          .order("created_at", { ascending: false })

        if (applicationsError) throw applicationsError

        // Get all related data
        const { data: applicantData, error: applicantError } = await supabase.from("applicant_details").select("*")

        if (applicantError) throw applicantError

        const { data: businessData, error: businessError } = await supabase.from("business_details").select("*")

        if (businessError) throw businessError

        const { data: fundingData, error: fundingError } = await supabase.from("funding_requests").select("*")

        if (fundingError) throw fundingError

        // Process and combine the data
        const processedApplications = applicationsData.map((app) => {
          // Find related data for this application
          const applicant = applicantData.find((a) => a.application_id === app.id) || {}
          const business = businessData.find((b) => b.application_id === app.id) || {}
          const funding = fundingData.find((f) => f.application_id === app.id) || {}

          // Return a flattened object with all the data we need
          return {
            id: app.id,
            reference_id: app.reference_id || "",
            status: app.status || "pending",
            created_at: app.created_at || new Date().toISOString(),
            full_name: applicant.full_name || "N/A",
            email: applicant.email || "N/A",
            phone: applicant.phone || "N/A",
            business_name: business.business_name || "N/A",
            business_type: business.business_type || "N/A",
            industry: business.industry || "N/A",
            amount_requested: funding.funding_amount || "N/A",
          }
        })

        setApplications(processedApplications)
      } catch (error) {
        console.error("Error fetching applications:", error)
        toast({
          title: "Error",
          description: "Failed to load applications data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [toast])

  // Handle status change from Kanban board
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const supabase = createClientClient()

      const { error } = await supabase.from("applications").update({ status: newStatus }).eq("id", id)

      if (error) throw error

      // Update local state to reflect the change
      setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)))

      toast({
        title: "Status Updated",
        description: "Application status has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating application status:", error)
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      })
    }
  }

  // Debug logging
  console.log("Total applications fetched:", applications.length)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold mb-1">Client Applications</h1>
        <p className="text-xs text-gray-500">Manage and review all submitted applications</p>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ClientList applications={applications} />
          )}
        </TabsContent>

        <TabsContent value="kanban">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <KanbanBoard applications={applications} onStatusChange={handleStatusChange} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
