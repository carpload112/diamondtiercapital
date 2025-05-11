"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { getApplicationDetails } from "@/lib/supabase/application-actions"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  User,
  Building2,
  DollarSign,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  BarChart,
  Clock4,
  Target,
  MessageSquare,
  CheckCircle,
  XCircle,
  ChevronDown,
  Archive,
  CalendarClock,
  FileText,
  Shield,
  Info,
  AlertCircle,
  LineChart,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ApplicationTagsEditor from "@/components/admin/ApplicationTagsEditor"
import ApplicationFolderSelector from "@/components/admin/ApplicationFolderSelector"
import { BankStatementViewer } from "@/components/BankStatementViewer"
import { getNestedValue } from "@/lib/utils/form-data-utils"
import FileSaver from "file-saver"

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()
  const [application, setApplication] = useState<any>(null)
  const [organizedData, setOrganizedData] = useState<any>(null)
  const [debugLog, setDebugLog] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [status, setStatus] = useState("")
  const [notes, setNotes] = useState("")
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [contactMenuOpen, setContactMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [showDebugInfo, setShowDebugInfo] = useState(false)

  useEffect(() => {
    fetchApplicationDetails()
  }, [id])

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true)

      // Use the enhanced server action to get application details
      const result = await getApplicationDetails(id)

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch application details")
      }

      setApplication(result.rawData)
      setOrganizedData(result.organizedData)
      setDebugLog(result.debugLog)
      setStatus(result.rawData?.status || "pending")
      setNotes(result.rawData?.notes || "")

      console.log("Application data loaded successfully")
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
      setIsDrawerOpen(false)
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      case "in_review":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Review</Badge>
      default:
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>
    }
  }

  const getInitials = (name: string) => {
    if (!name || name === "N/A") return "NA"
    try {
      return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    } catch (error) {
      return "NA"
    }
  }

  const getIconForSection = (iconName: string) => {
    switch (iconName) {
      case "User":
        return <User className="h-4 w-4 text-blue-500" />
      case "Building2":
        return <Building2 className="h-4 w-4 text-blue-500" />
      case "DollarSign":
        return <DollarSign className="h-4 w-4 text-blue-500" />
      case "LineChart":
        return <LineChart className="h-4 w-4 text-blue-500" />
      case "FileText":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "Shield":
        return <Shield className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-slate-500">Loading application details...</p>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <h2 className="text-lg font-medium text-slate-900 mb-2">Application Not Found</h2>
        <p className="text-sm text-slate-500 mb-4">
          The application you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild size="sm">
          <Link href="/admin/applications">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Link>
        </Button>
      </div>
    )
  }

  // Get key data for quick access
  const applicantName = getNestedValue(application, "applicant_details.full_name")
  const businessName = getNestedValue(application, "business_details.business_name")
  const email = getNestedValue(application, "applicant_details.email")
  const phone = getNestedValue(application, "applicant_details.phone")
  const fundingAmount = getNestedValue(application, "funding_requests.funding_amount")
  const fundingPurpose = getNestedValue(application, "funding_requests.funding_purpose")
  const timeframe = getNestedValue(application, "funding_requests.timeframe")
  const collateral = getNestedValue(application, "funding_requests.collateral")

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "success"
      case "rejected":
        return "destructive"
      case "in_review":
        return "secondary"
      default:
        return "default"
    }
  }

  const UpdateStatusForm = ({ applicationId, currentStatus }: { applicationId: string; currentStatus: string }) => {
    const [status, setStatus] = useState(currentStatus)
    const [isUpdating, setIsUpdating] = useState(false)
    const { toast } = useToast()

    const updateStatus = async () => {
      try {
        setIsUpdating(true)
        const supabase = createClient()

        const { error } = await supabase.from("applications").update({ status }).eq("id", applicationId)

        if (error) throw error

        toast({
          title: "Status updated",
          description: `Application status changed to ${status.replace("_", " ")}`,
        })
      } catch (error) {
        console.error("Error updating status:", error)
        toast({
          title: "Error",
          description: "Failed to update application status",
          variant: "destructive",
        })
      } finally {
        setIsUpdating(false)
      }
    }

    return (
      <div className="space-y-2">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={updateStatus}
          disabled={isUpdating || status === currentStatus}
        >
          {isUpdating ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Updating...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Update Status
            </>
          )}
        </Button>
      </div>
    )
  }

  const exportToExcel = async () => {
    try {
      toast({
        title: "Preparing export",
        description: "Generating Excel file...",
      })

      const XLSX = await import("xlsx")
      const wb = XLSX.utils.book_new()

      // Create a sheet for each form section
      Object.keys(organizedData).forEach((sectionKey) => {
        const section = organizedData[sectionKey]
        const sheetData = [
          [section.title, ""],
          ["Field", "Value"],
        ]

        section.fields.forEach((field: any) => {
          sheetData.push([field.label, field.value])
        })

        const ws = XLSX.utils.aoa_to_sheet(sheetData)
        XLSX.utils.book_append_sheet(wb, ws, section.title.substring(0, 31)) // Excel sheet names limited to 31 chars
      })

      // Add application metadata
      const metadataSheet = [
        ["Application Details", ""],
        ["Application ID", application.id],
        ["Reference ID", application.reference_id || "N/A"],
        ["Status", application.status?.replace(/_/g, " ") || "Pending"],
        ["Submission Date", application.submitted_at ? new Date(application.submitted_at).toLocaleDateString() : "N/A"],
        ["Notes", application.notes || ""],
      ]

      const wsMetadata = XLSX.utils.aoa_to_sheet(metadataSheet)
      XLSX.utils.book_append_sheet(wb, wsMetadata, "Application Info")

      // Add bank statements if available
      if (application.bank_statements && application.bank_statements.length > 0) {
        const bankStatementsData = [["Month/Year", "File Name", "File Type", "File Size (KB)", "Notes", "Uploaded"]]

        application.bank_statements.forEach((statement: any) => {
          bankStatementsData.push([
            statement.month_year,
            statement.file_name,
            statement.file_type,
            Math.round(statement.file_size / 1024).toString(),
            statement.notes || "",
            new Date(statement.uploaded_at).toLocaleDateString(),
          ])
        })

        const wsBankStatements = XLSX.utils.aoa_to_sheet(bankStatementsData)
        XLSX.utils.book_append_sheet(wb, wsBankStatements, "Bank Statements")
      }

      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      // Generate filename with client name and date
      const fileName = `${businessName.replace(/[^a-z0-9]/gi, "_")}_Application_${new Date().toISOString().split("T")[0]}.xlsx`

      // Save file
      FileSaver.saveAs(blob, fileName)

      toast({
        title: "Export successful",
        description: "Application data has been exported to Excel",
      })
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting the application data",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4 pb-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-2">
        <Link href="/admin/applications" className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-3 w-3 mr-1" />
          Back to Applications
        </Link>
        <div className="text-xs text-gray-500">
          ID: {application.reference_id || application.id?.substring(0, 8).toUpperCase() || "N/A"}
        </div>
      </div>

      {/* Client Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarFallback className="bg-blue-100 text-blue-700">{getInitials(applicantName)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold">{applicantName}</h1>
              <p className="text-sm text-gray-500">{businessName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(status)}
            {(email !== "N/A" || phone !== "N/A") && (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 flex items-center gap-1"
                  onClick={() => setContactMenuOpen(!contactMenuOpen)}
                >
                  <MessageSquare className="h-3 w-3" />
                  Contact
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
                {contactMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setContactMenuOpen(false)} />
                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg overflow-hidden z-20 border border-gray-200">
                      <div className="py-1">
                        {email !== "N/A" && (
                          <Link
                            href={`mailto:${email}`}
                            className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                            onClick={() => setContactMenuOpen(false)}
                          >
                            <Mail className="h-3 w-3 mr-2 text-gray-500" />
                            Send Email
                          </Link>
                        )}
                        {phone !== "N/A" && (
                          <Link
                            href={`tel:${phone}`}
                            className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                            onClick={() => setContactMenuOpen(false)}
                          >
                            <Phone className="h-3 w-3 mr-2 text-gray-500" />
                            Call Client
                          </Link>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Application Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="text-lg">{applicantName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="text-lg">{email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <p className="text-lg">{phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <Badge variant={getStatusVariant(application.status)} className="capitalize mt-1">
                  {application.status?.replace(/_/g, " ")}
                </Badge>
              </div>
              <div>
                <ApplicationTagsEditor applicationId={params.id} />
              </div>
              <div>
                <ApplicationFolderSelector applicationId={params.id} />
              </div>
            </div>
          </div>

          <div className="w-full md:w-80">
            <h2 className="text-2xl font-bold mb-4">Actions</h2>
            <div className="space-y-2">
              <UpdateStatusForm applicationId={params.id} currentStatus={application.status} />

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  if (email !== "N/A") {
                    window.location.href = `mailto:${email}`
                  } else {
                    toast({
                      title: "No email available",
                      description: "This applicant doesn't have an email address",
                      variant: "destructive",
                    })
                  }
                }}
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  if (phone !== "N/A") {
                    window.location.href = `tel:${phone}`
                  } else {
                    toast({
                      title: "No phone available",
                      description: "This applicant doesn't have a phone number",
                      variant: "destructive",
                    })
                  }
                }}
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Client
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  toast({
                    title: "Schedule Meeting",
                    description: "Calendar integration coming soon",
                  })
                }}
              >
                <CalendarClock className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>

              <Button variant="outline" className="w-full justify-start" onClick={exportToExcel}>
                <FileText className="mr-2 h-4 w-4" />
                Export to Excel
              </Button>

              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={async () => {
                  try {
                    const supabase = createClient()
                    const { error } = await supabase.from("applications").update({ archived: true }).eq("id", params.id)
                    if (error) throw error
                    toast({
                      title: "Application archived",
                      description: "The application has been archived successfully",
                    })
                    router.push("/admin/applications")
                  } catch (error) {
                    console.error("Error archiving application:", error)
                    toast({
                      title: "Error",
                      description: "Failed to archive application",
                      variant: "destructive",
                    })
                  }
                }}
              >
                <Archive className="mr-2 h-4 w-4" />
                Archive Application
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start mt-4"
                onClick={() => setShowDebugInfo(!showDebugInfo)}
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                {showDebugInfo ? "Hide Debug Info" : "Show Debug Info"}
              </Button>
            </div>
          </div>
        </div>

        {/* Debug Information */}
        {showDebugInfo && (
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Debug Information
              </CardTitle>
              <CardDescription>This section shows raw application data for debugging purposes</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto bg-gray-100 p-4 rounded-md max-h-96">{debugLog}</pre>
            </CardContent>
          </Card>
        )}

        {/* Application Content Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="form-data">Form Data</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <Button onClick={() => setIsDrawerOpen(true)} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <MessageSquare className="h-4 w-4 mr-2" />
              Status & Notes
            </Button>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {/* Applicant Details */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-500" />
                    Applicant Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Full Name</p>
                      <p>{applicantName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Email Address</p>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <p className="break-all">{email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Phone Number</p>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <p>{phone}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Preferred Contact</p>
                      <p>{getNestedValue(application, "applicant_details.preferred_contact")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    Business Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Business Name</p>
                      <p>{businessName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Business Type</p>
                      <p>{getNestedValue(application, "business_details.business_type")}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Years in Business</p>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <p>{getNestedValue(application, "business_details.years_in_business")}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Industry</p>
                      <p>{getNestedValue(application, "business_details.industry")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Funding Request */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-500" />
                    Funding Request
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Amount Requested</p>
                      <p className="text-base font-semibold text-blue-700">
                        {fundingAmount !== "N/A" ? fundingAmount : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Purpose</p>
                      <p>{fundingPurpose !== "N/A" ? fundingPurpose : "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Timeframe</p>
                      <div className="flex items-center gap-1">
                        <Clock4 className="h-3 w-3 text-gray-400" />
                        <p>{timeframe !== "N/A" ? timeframe : "N/A"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Collateral</p>
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3 text-gray-400" />
                        <p>{collateral !== "N/A" ? collateral : "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Information */}
              <Card className="md:col-span-2 xl:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-blue-500" />
                    Financial Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Annual Revenue</p>
                      <div className="flex items-center gap-1">
                        <BarChart className="h-3 w-3 text-gray-400" />
                        <p>{getNestedValue(application, "business_details.annual_revenue")}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Monthly Deposits</p>
                      <div className="flex items-center gap-1">
                        <BarChart className="h-3 w-3 text-gray-400" />
                        <p>{getNestedValue(application, "business_details.estimated_monthly_deposits")}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Credit Score</p>
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3 text-gray-400" />
                        <p>{getNestedValue(application, "business_details.credit_score")}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Bankruptcy History</p>
                      <div className="flex items-center gap-1">
                        {getNestedValue(application, "business_details.bankruptcy_history") === "Yes" ? (
                          <CheckCircle className="h-3 w-3 text-red-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-green-500" />
                        )}
                        <p>{getNestedValue(application, "business_details.bankruptcy_history")}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Consent Information */}
              <Card className="md:col-span-2 xl:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    Consent Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Terms Agreed</p>
                      <div className="flex items-center gap-1 mt-1">
                        {getNestedValue(application, "additional_information.terms_agreed") === "Yes" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <p>{getNestedValue(application, "additional_information.terms_agreed")}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Marketing Consent</p>
                      <div className="flex items-center gap-1 mt-1">
                        {getNestedValue(application, "additional_information.marketing_consent") === "Yes" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                        <p>{getNestedValue(application, "additional_information.marketing_consent")}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">How They Heard About Us</p>
                      <p>{getNestedValue(application, "additional_information.hear_about_us")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Comments */}
              {getNestedValue(application, "additional_information.additional_info") !== "N/A" && (
                <Card className="md:col-span-2 xl:col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      Additional Comments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {getNestedValue(application, "additional_information.additional_info")}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Bank Statements in Overview */}
              <Card className="md:col-span-2 xl:col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    Bank Statements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BankStatementViewer
                    applicationId={params.id}
                    isAdmin={true}
                    readOnly={true}
                    onDelete={() => {
                      toast({
                        title: "Bank statement deleted",
                        description: "The bank statement has been deleted successfully",
                      })
                      fetchApplicationDetails() // Refresh data after deletion
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Form Data Tab - Shows all form data organized by the original form structure */}
          <TabsContent value="form-data">
            <Card>
              <CardHeader>
                <CardTitle>Complete Form Data</CardTitle>
                <CardDescription>All data submitted through the application form, organized by section</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {Object.keys(organizedData || {}).map((sectionKey) => {
                    const section = organizedData[sectionKey]
                    return (
                      <AccordionItem value={sectionKey} key={sectionKey}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-2">
                            {getIconForSection(section.icon)}
                            <span>{section.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                            {section.fields.map((field: any, index: number) => (
                              <div key={index} className="border-b border-gray-100 pb-2">
                                <p className="text-xs font-medium text-gray-500">{field.label}</p>
                                <p className="text-sm">{field.value}</p>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Bank Statements & Documents</CardTitle>
                <CardDescription>View and manage uploaded bank statements and other documents</CardDescription>
              </CardHeader>
              <CardContent>
                <BankStatementViewer
                  applicationId={params.id}
                  isAdmin={true}
                  readOnly={false}
                  onDelete={() => {
                    toast({
                      title: "Bank statement deleted",
                      description: "The bank statement has been deleted successfully",
                    })
                    fetchApplicationDetails() // Refresh data after deletion
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Admin Notes</CardTitle>
                <CardDescription>Internal notes about this application</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add notes about this application..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={8}
                  className="mb-4"
                />
                <Button onClick={updateApplication} disabled={updating}>
                  {updating ? "Saving..." : "Save Notes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Status & Notes Drawer */}
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/20" onClick={() => setIsDrawerOpen(false)} />
            <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-lg p-4 overflow-y-auto">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Status & Notes</h3>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsDrawerOpen(false)}>
                    <XCircle className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>

                <div className="space-y-4 flex-1">
                  {/* Status Card */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Application Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {status === "approved" ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : status === "rejected" ? (
                            <XCircle className="h-3 w-3 text-red-500" />
                          ) : (
                            <Clock4 className="h-3 w-3 text-amber-500" />
                          )}
                          <span className="text-xs font-medium">
                            {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
                          </span>
                        </div>
                        {getStatusBadge(status)}
                      </div>

                      <Separator />

                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">Update Status</p>
                        <div className="space-y-2">
                          <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in_review">In Review</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Admin Notes */}
                  <Card className="flex-1">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        Admin Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Add notes about this application..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={6}
                        className="mb-2 text-xs"
                      />
                    </CardContent>
                  </Card>
                </div>

                <Button onClick={updateApplication} disabled={updating} className="w-full mt-4">
                  {updating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
