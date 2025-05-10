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
  folder?: string
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchApplications()
  }, [])

  async function fetchApplications() {
    const supabase = createClientClient()

    try {
      // Get all applications except archived ones
      const { data: applicationsData, error: applicationsError } = await supabase
        .from("applications")
        .select("*")
        .not("status", "eq", "archived")
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
          folder: app.folder || "",
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

  // Handle archive
  const handleArchive = async (id: string) => {
    try {
      const supabase = createClientClient()

      // Get the current application to store its status
      const app = applications.find((a) => a.id === id)
      if (!app) return

      // Store the previous status in the notes field as JSON
      const notesData = JSON.stringify({
        previousStatus: app.status,
        archivedAt: new Date().toISOString(),
      })

      // Update the application status to archived
      const { error } = await supabase
        .from("applications")
        .update({
          status: "archived",
          notes: notesData,
        })
        .eq("id", id)

      if (error) throw error

      // Remove from local state
      setApplications((prev) => prev.filter((app) => app.id !== id))

      toast({
        title: "Application Archived",
        description: "Application has been moved to archive",
      })
    } catch (error) {
      console.error("Error archiving application:", error)
      toast({
        title: "Error",
        description: "Failed to archive application",
        variant: "destructive",
      })
    }
  }

  // Handle bulk archive
  const handleBulkArchive = async (ids: string[]) => {
    try {
      const supabase = createClientClient()

      // Process each application
      for (const id of ids) {
        const app = applications.find((a) => a.id === id)
        if (!app) continue

        // Store the previous status in the notes field as JSON
        const notesData = JSON.stringify({
          previousStatus: app.status,
          archivedAt: new Date().toISOString(),
        })

        // Update the application status to archived
        await supabase
          .from("applications")
          .update({
            status: "archived",
            notes: notesData,
          })
          .eq("id", id)
      }

      // Remove from local state
      setApplications((prev) => prev.filter((app) => !ids.includes(app.id)))

      return true
    } catch (error) {
      console.error("Error bulk archiving applications:", error)
      toast({
        title: "Error",
        description: "Failed to archive some applications",
        variant: "destructive",
      })
      return false
    }
  }

  // Handle update folder
  const handleUpdateFolder = async (ids: string[], folderId: string) => {
    try {
      const supabase = createClientClient()

      // Update each application
      for (const id of ids) {
        await supabase
          .from("applications")
          .update({
            folder: folderId,
          })
          .eq("id", id)
      }

      // Update local state
      setApplications((prev) => prev.map((app) => (ids.includes(app.id) ? { ...app, folder: folderId } : app)))

      return true
    } catch (error) {
      console.error("Error updating application folders:", error)
      toast({
        title: "Error",
        description: "Failed to update folders for some applications",
        variant: "destructive",
      })
      return false
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold mb-1">Client Applications</h1>
          <p className="text-xs text-gray-500">Manage and review all submitted applications</p>
        </div>
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
            <ClientList
              applications={applications}
              onArchive={handleArchive}
              onBulkArchive={handleBulkArchive}
              onUpdateFolder={handleUpdateFolder}
            />
          )}
        </TabsContent>

        <TabsContent value="kanban">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <KanbanBoard applications={applications} onStatusChange={handleStatusChange} onArchive={handleArchive} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
