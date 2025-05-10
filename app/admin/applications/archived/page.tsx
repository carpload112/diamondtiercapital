"use client"

import { useState, useEffect } from "react"
import { createClientClient } from "@/lib/supabase/client"
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
  notes?: string
}

export default function ArchivedApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchArchivedApplications()
  }, [])

  async function fetchArchivedApplications() {
    const supabase = createClientClient()

    try {
      // Get all archived applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from("applications")
        .select("*")
        .eq("status", "archived")
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
          status: app.status || "archived",
          created_at: app.created_at || new Date().toISOString(),
          full_name: applicant.full_name || "N/A",
          email: applicant.email || "N/A",
          phone: applicant.phone || "N/A",
          business_name: business.business_name || "N/A",
          business_type: business.business_type || "N/A",
          industry: business.industry || "N/A",
          amount_requested: funding.funding_amount || "N/A",
          folder: app.folder || "",
          notes: app.notes || "",
        }
      })

      setApplications(processedApplications)
    } catch (error) {
      console.error("Error fetching archived applications:", error)
      toast({
        title: "Error",
        description: "Failed to load archived applications data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle restore from archive
  const handleRestore = async (id: string) => {
    try {
      const supabase = createClientClient()

      // Get the current application to restore its previous status
      const app = applications.find((a) => a.id === id)
      if (!app) return

      // Try to parse the notes to get the previous status
      let previousStatus = "pending"
      try {
        if (app.notes) {
          const notesData = JSON.parse(app.notes)
          if (notesData.previousStatus) {
            previousStatus = notesData.previousStatus
          }
        }
      } catch (e) {
        console.error("Error parsing notes:", e)
      }

      // Update the application status to the previous status
      const { error } = await supabase
        .from("applications")
        .update({
          status: previousStatus,
        })
        .eq("id", id)

      if (error) throw error

      // Remove from local state
      setApplications((prev) => prev.filter((app) => app.id !== id))

      toast({
        title: "Application Restored",
        description: `Application has been restored to ${previousStatus} status`,
      })
    } catch (error) {
      console.error("Error restoring application:", error)
      toast({
        title: "Error",
        description: "Failed to restore application",
        variant: "destructive",
      })
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
      <div>
        <h1 className="text-lg font-semibold mb-1">Archived Applications</h1>
        <p className="text-xs text-gray-500">View and manage archived applications</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ClientList
          applications={applications}
          onArchive={handleRestore}
          onUpdateFolder={handleUpdateFolder}
          showArchived={true}
        />
      )}
    </div>
  )
}
