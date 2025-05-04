"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [status, setStatus] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    fetchApplicationDetails()
  }, [id])

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          applicant_details(*),
          business_details(*),
          funding_requests(*),
          additional_information(*)
        `)
        .eq("id", id)
        .single()

      if (error) throw error

      setApplication(data)
      setStatus(data.status)
      setNotes(data.notes || "")
    } catch (error) {
      console.error("Error fetching application details:", error)
      toast({
        title: "Error",
        description: "Failed to load application details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateApplication = async () => {
    try {
      setUpdating(true)
      const supabase = createClient()

      const { error } = await supabase.from("applications").update({ status, notes }).eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Application has been updated",
      })

      // Refresh the application data
      fetchApplicationDetails()
    } catch (error) {
      console.error("Error updating application:", error)
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "in_review":
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-amber-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading application details...</p>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-xl font-medium text-slate-900 mb-2">Application Not Found</h2>
        <p className="text-slate-500 mb-6">The application you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/admin/applications">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/admin/applications"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Applications
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Application {application.reference_id}</h1>
          <div className="flex items-center mt-1">
            {getStatusIcon(application.status)}
            <span
              className={`ml-2 text-sm font-medium ${
                application.status === "approved"
                  ? "text-green-700"
                  : application.status === "rejected"
                    ? "text-red-700"
                    : application.status === "in_review"
                      ? "text-blue-700"
                      : "text-amber-700"
              }`}
            >
              {application.status.charAt(0).toUpperCase() + application.status.slice(1).replace("_", " ")}
            </span>
            <span className="mx-2 text-slate-300">•</span>
            <span className="text-sm text-slate-500">
              Submitted {formatDate(application.submitted_at || application.created_at)}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_review">In Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={updateApplication} disabled={updating}>
            {updating ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </div>

      {/* Application Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Applicant Details */}
        <Card>
          <CardHeader>
            <CardTitle>Applicant Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Full Name</p>
                <p className="text-slate-900">{application.applicant_details?.full_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Email</p>
                <p className="text-slate-900">{application.applicant_details?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Phone</p>
                <p className="text-slate-900">{application.applicant_details?.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Credit Score</p>
                <p className="text-slate-900">{application.applicant_details?.credit_score || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Details */}
        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Business Name</p>
                <p className="text-slate-900">{application.business_details?.business_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Business Type</p>
                <p className="text-slate-900">{application.business_details?.business_type || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Years in Business</p>
                <p className="text-slate-900">{application.business_details?.years_in_business || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Annual Revenue</p>
                <p className="text-slate-900">
                  {application.business_details?.annual_revenue
                    ? `$${Number(application.business_details.annual_revenue).toLocaleString()}`
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Funding Request */}
        <Card>
          <CardHeader>
            <CardTitle>Funding Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Funding Type</p>
                <p className="text-slate-900">{application.funding_requests?.funding_type || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Amount Requested</p>
                <p className="text-slate-900">
                  {application.funding_requests?.amount_requested
                    ? `$${Number(application.funding_requests.amount_requested).toLocaleString()}`
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Purpose</p>
                <p className="text-slate-900">{application.funding_requests?.purpose || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Timeframe</p>
                <p className="text-slate-900">{application.funding_requests?.timeframe || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Additional Comments</p>
              <p className="text-slate-900">{application.additional_information?.comments || "None provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">How did they hear about us?</p>
              <p className="text-slate-900">{application.additional_information?.referral_source || "N/A"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add notes about this application..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="mb-4"
          />
          <Button onClick={updateApplication} disabled={updating}>
            {updating ? "Saving..." : "Save Notes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
