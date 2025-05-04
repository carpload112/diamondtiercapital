"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  User,
  Building2,
  DollarSign,
  FileText,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Briefcase,
  BarChart,
  Clock4,
  Target,
  Info,
  MessageSquare,
  CheckCircle,
  XCircleIcon,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Helper function to format dates responsively
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A"

  // Use a simpler format on mobile
  if (typeof window !== "undefined" && window.innerWidth < 640) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [status, setStatus] = useState("")
  const [notes, setNotes] = useState("")
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    fetchApplicationDetails()
  }, [id])

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Log the ID we're trying to fetch
      console.log("Fetching application with ID:", id)

      // First try to get the application data
      const { data: appData, error: appError } = await supabase.from("applications").select("*").eq("id", id).single()

      if (appError) {
        console.error("Error fetching application:", appError)
        throw appError
      }

      console.log("Application data:", appData)

      // Get applicant details
      const { data: applicantData, error: applicantError } = await supabase
        .from("applicant_details")
        .select("*")
        .eq("application_id", id)
        .single()

      if (applicantError && applicantError.code !== "PGRST116") {
        console.error("Error fetching applicant details:", applicantError)
      }

      console.log("Applicant data:", applicantData)

      // Get business details
      const { data: businessData, error: businessError } = await supabase
        .from("business_details")
        .select("*")
        .eq("application_id", id)
        .single()

      if (businessError && businessError.code !== "PGRST116") {
        console.error("Error fetching business details:", businessError)
      }

      console.log("Business data:", businessData)

      // Get funding requests
      const { data: fundingData, error: fundingError } = await supabase
        .from("funding_requests")
        .select("*")
        .eq("application_id", id)
        .single()

      if (fundingError && fundingError.code !== "PGRST116") {
        console.error("Error fetching funding requests:", fundingError)
      }

      console.log("Funding data:", fundingData)

      // Get additional information
      const { data: additionalData, error: additionalError } = await supabase
        .from("additional_information")
        .select("*")
        .eq("application_id", id)
        .single()

      if (additionalError && additionalError.code !== "PGRST116") {
        console.error("Error fetching additional information:", additionalError)
      }

      console.log("Additional data:", additionalData)

      // Combine all data
      const combinedData = {
        ...appData,
        applicant_details: applicantData || {},
        business_details: businessData || {},
        funding_requests: fundingData || {},
        additional_information: additionalData || {},
      }

      // Store debug info
      setDebugInfo({
        appData,
        applicantData,
        businessData,
        fundingData,
        additionalData,
      })

      // If we have a reference_id in the URL but not in the data, try to find by reference_id
      if (!combinedData.reference_id && id.toUpperCase().startsWith("APP")) {
        const { data: refData, error: refError } = await supabase
          .from("applications")
          .select(`
            *,
            applicant_details(*),
            business_details(*),
            funding_requests(*),
            additional_information(*)
          `)
          .eq("reference_id", id.toUpperCase())
          .single()

        if (!refError && refData) {
          console.log("Found by reference_id:", refData)
          setApplication(refData)
          setStatus(refData.status || "pending")
          setNotes(refData.notes || "")
          setLoading(false)
          return
        }
      }

      // Check if we have any data at all
      if (!appData) {
        console.error("No application found with ID:", id)
        toast({
          title: "Error",
          description: "Application not found",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // If we're missing related data, try a direct query approach
      if (!applicantData || !businessData || !fundingData || !additionalData) {
        console.log("Missing related data, trying direct query")

        // Try to get all data in one query
        const { data: fullData, error: fullError } = await supabase
          .from("applications")
          .select(`
            *,
            applicant_details!inner(*),
            business_details!inner(*),
            funding_requests!inner(*),
            additional_information!inner(*)
          `)
          .eq("id", id)
          .single()

        if (!fullError && fullData) {
          console.log("Full data from direct query:", fullData)
          setApplication(fullData)
          setStatus(fullData.status || "pending")
          setNotes(fullData.notes || "")
        } else {
          console.log("Using combined data with partial information")
          setApplication(combinedData)
          setStatus(combinedData.status || "pending")
          setNotes(combinedData.notes || "")
        }
      } else {
        console.log("Using combined data with all information")
        setApplication(combinedData)
        setStatus(combinedData.status || "pending")
        setNotes(combinedData.notes || "")
      }
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

  const formatCurrency = (amount: string | number) => {
    if (!amount) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Number(amount))
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

  // Helper function to safely get nested values
  const getValue = (obj: any, path: string, defaultValue: any = "N/A") => {
    if (!obj) return defaultValue

    const keys = path.split(".")
    let result = obj

    for (const key of keys) {
      if (result && typeof result === "object" && key in result) {
        result = result[key]
      } else {
        return defaultValue
      }
    }

    return result || defaultValue
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-sm sm:text-base text-slate-500">Loading application details...</p>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
        <h2 className="text-lg sm:text-xl font-medium text-slate-900 mb-2">Application Not Found</h2>
        <p className="text-sm sm:text-base text-slate-500 mb-4 sm:mb-6">
          The application you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild size="sm" className="h-9 sm:h-10">
          <Link href="/admin/applications">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Link>
        </Button>
      </div>
    )
  }

  // Get applicant name from various possible sources
  const applicantName =
    getValue(application, "applicant_details.full_name") !== "N/A"
      ? getValue(application, "applicant_details.full_name")
      : getValue(application, "full_name") !== "N/A"
        ? getValue(application, "full_name")
        : getValue(application, "applicant_name") !== "N/A"
          ? getValue(application, "applicant_name")
          : "N/A"

  // Get business name from various possible sources
  const businessName =
    getValue(application, "business_details.business_name") !== "N/A"
      ? getValue(application, "business_details.business_name")
      : getValue(application, "business_name") !== "N/A"
        ? getValue(application, "business_name")
        : "N/A"

  // Get email from various possible sources
  const email =
    getValue(application, "applicant_details.email") !== "N/A"
      ? getValue(application, "applicant_details.email")
      : getValue(application, "email") !== "N/A"
        ? getValue(application, "email")
        : getValue(application, "contact_email") !== "N/A"
          ? getValue(application, "contact_email")
          : "N/A"

  // Get phone from various possible sources
  const phone =
    getValue(application, "applicant_details.phone") !== "N/A"
      ? getValue(application, "applicant_details.phone")
      : getValue(application, "phone") !== "N/A"
        ? getValue(application, "phone")
        : getValue(application, "contact_phone") !== "N/A"
          ? getValue(application, "contact_phone")
          : "N/A"

  // Get funding amount from various possible sources
  const fundingAmount =
    getValue(application, "funding_requests.amount_requested") !== "N/A"
      ? getValue(application, "funding_requests.amount_requested")
      : getValue(application, "funding_requests.funding_amount") !== "N/A"
        ? getValue(application, "funding_requests.funding_amount")
        : getValue(application, "funding_amount") !== "N/A"
          ? getValue(application, "funding_amount")
          : getValue(application, "amount_requested") !== "N/A"
            ? getValue(application, "amount_requested")
            : "N/A"

  // Get business type from various possible sources
  const businessType =
    getValue(application, "business_details.business_type") !== "N/A"
      ? getValue(application, "business_details.business_type")
      : getValue(application, "business_type") !== "N/A"
        ? getValue(application, "business_type")
        : "N/A"

  // Get industry from various possible sources
  const industry =
    getValue(application, "business_details.industry") !== "N/A"
      ? getValue(application, "business_details.industry")
      : getValue(application, "industry") !== "N/A"
        ? getValue(application, "industry")
        : "N/A"

  // Get years in business from various possible sources
  const yearsInBusiness =
    getValue(application, "business_details.years_in_business") !== "N/A"
      ? getValue(application, "business_details.years_in_business")
      : getValue(application, "years_in_business") !== "N/A"
        ? getValue(application, "years_in_business")
        : "N/A"

  // Get annual revenue from various possible sources
  const annualRevenue =
    getValue(application, "business_details.annual_revenue") !== "N/A"
      ? getValue(application, "business_details.annual_revenue")
      : getValue(application, "annual_revenue") !== "N/A"
        ? getValue(application, "annual_revenue")
        : "N/A"

  // Get credit score from various possible sources
  const creditScore =
    getValue(application, "business_details.credit_score") !== "N/A"
      ? getValue(application, "business_details.credit_score")
      : getValue(application, "applicant_details.credit_score") !== "N/A"
        ? getValue(application, "applicant_details.credit_score")
        : getValue(application, "credit_score") !== "N/A"
          ? getValue(application, "credit_score")
          : "N/A"

  // Get funding purpose from various possible sources
  const fundingPurpose =
    getValue(application, "funding_requests.purpose") !== "N/A"
      ? getValue(application, "funding_requests.purpose")
      : getValue(application, "funding_requests.funding_purpose") !== "N/A"
        ? getValue(application, "funding_requests.funding_purpose")
        : getValue(application, "funding_purpose") !== "N/A"
          ? getValue(application, "funding_purpose")
          : getValue(application, "purpose") !== "N/A"
            ? getValue(application, "purpose")
            : "N/A"

  // Get timeframe from various possible sources
  const timeframe =
    getValue(application, "funding_requests.timeframe") !== "N/A"
      ? getValue(application, "funding_requests.timeframe")
      : getValue(application, "timeframe") !== "N/A"
        ? getValue(application, "timeframe")
        : "N/A"

  // Get collateral from various possible sources
  const collateral =
    getValue(application, "funding_requests.collateral") !== "N/A"
      ? getValue(application, "funding_requests.collateral")
      : getValue(application, "collateral") !== "N/A"
        ? getValue(application, "collateral")
        : "N/A"

  // Get preferred contact method from various possible sources
  const preferredContact =
    getValue(application, "applicant_details.preferred_contact") !== "N/A"
      ? getValue(application, "applicant_details.preferred_contact")
      : getValue(application, "preferred_contact") !== "N/A"
        ? getValue(application, "preferred_contact")
        : "N/A"

  // Get heard about us from various possible sources
  const heardAboutUs =
    getValue(application, "additional_information.hear_about_us") !== "N/A"
      ? getValue(application, "additional_information.hear_about_us")
      : getValue(application, "additional_information.referral_source") !== "N/A"
        ? getValue(application, "additional_information.referral_source")
        : getValue(application, "hear_about_us") !== "N/A"
          ? getValue(application, "hear_about_us")
          : getValue(application, "referral_source") !== "N/A"
            ? getValue(application, "referral_source")
            : "N/A"

  // Get marketing consent from various possible sources
  const marketingConsent =
    getValue(application, "additional_information.marketing_consent", null) !== null
      ? getValue(application, "additional_information.marketing_consent")
      : getValue(application, "marketing_consent", null) !== null
        ? getValue(application, "marketing_consent")
        : false

  // Get terms agreed from various possible sources
  const termsAgreed =
    getValue(application, "additional_information.terms_agreed", null) !== null
      ? getValue(application, "additional_information.terms_agreed")
      : getValue(application, "terms_agreed", null) !== null
        ? getValue(application, "terms_agreed")
        : false

  // Get additional comments from various possible sources
  const additionalComments =
    getValue(application, "additional_information.comments") !== "N/A"
      ? getValue(application, "additional_information.comments")
      : getValue(application, "additional_information.additional_info") !== "N/A"
        ? getValue(application, "additional_information.additional_info")
        : getValue(application, "comments") !== "N/A"
          ? getValue(application, "comments")
          : getValue(application, "additional_info") !== "N/A"
            ? getValue(application, "additional_info")
            : "None provided"

  return (
    <div className="space-y-6 pb-8">
      {/* Header with Back Button */}
      <div className="flex items-center mb-2">
        <Link href="/admin/applications" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Applications
        </Link>
      </div>

      {/* Application Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md text-white p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              Application #{application.reference_id || application.id.substring(0, 8).toUpperCase()}
            </h1>
            <p className="text-blue-100 mt-1 text-sm sm:text-base">
              Submitted {formatDate(application.submitted_at || application.created_at)}
            </p>
            <div className="flex items-center mt-2">
              {getStatusIcon(status)}
              <span className="ml-2 font-medium text-sm sm:text-base">
                Status: {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full bg-white/10 border-white/20 text-white h-10">
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
              onClick={updateApplication}
              disabled={updating}
              className="bg-white text-blue-700 hover:bg-blue-50 h-10 w-full sm:w-auto"
            >
              {updating ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Left Column - Applicant & Business */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Details */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  Applicant Details
                </CardTitle>
                <CardDescription>Personal information provided by the applicant</CardDescription>
              </div>
              {email !== "N/A" && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`mailto:${email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </Link>
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="font-medium">{applicantName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-sm break-all">{email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{phone}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Preferred Contact Method</p>
                  <p className="text-sm">{preferredContact}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-500" />
                Business Details
              </CardTitle>
              <CardDescription>Information about the applicant's business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Business Name</p>
                  <p className="font-medium">{businessName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Business Type</p>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{businessType}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Industry</p>
                  <p className="text-sm">{industry}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Years in Business</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{yearsInBusiness}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Annual Revenue</p>
                  <div className="flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{annualRevenue !== "N/A" ? formatCurrency(annualRevenue) : "N/A"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Credit Score</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{creditScore}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funding Request */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-500" />
                Funding Request
              </CardTitle>
              <CardDescription>Details about the requested funding</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Funding Amount</p>
                  <p className="text-lg sm:text-xl font-semibold text-blue-700">
                    {fundingAmount !== "N/A" ? formatCurrency(fundingAmount) : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Funding Purpose</p>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{fundingPurpose}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Timeframe</p>
                  <div className="flex items-center gap-2">
                    <Clock4 className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{timeframe}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Collateral Available</p>
                  <p className="text-sm">{collateral}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Status, Notes & Additional Info */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                Application Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    <span className="font-medium text-sm">
                      {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
                    </span>
                  </div>
                  {getStatusBadge(status)}
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Update Status</p>
                  <div className="space-y-3">
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_review">In Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={updateApplication} disabled={updating} className="w-full h-10">
                      {updating ? "Updating..." : "Update Status"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                Admin Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add notes about this application..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                className="mb-3"
              />
              <Button onClick={updateApplication} disabled={updating} className="w-full">
                {updating ? "Saving..." : "Save Notes"}
              </Button>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Heard About Us</p>
                  <p className="text-sm">{heardAboutUs}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Marketing Consent</p>
                  <div className="flex items-center gap-2">
                    {marketingConsent ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Yes</span>
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="h-4 w-4 text-red-500" />
                        <span className="text-sm">No</span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Terms Agreed</p>
                  <div className="flex items-center gap-2">
                    {termsAgreed ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Yes</span>
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="h-4 w-4 text-red-500" />
                        <span className="text-sm">No</span>
                      </>
                    )}
                  </div>
                </div>
                {additionalComments !== "None provided" && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Additional Comments</p>
                    <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap">{additionalComments}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Application ID Footer */}
      <div className="text-xs sm:text-sm text-gray-500 pt-4 border-t border-gray-200">
        <p>Application ID: {application.id}</p>
        <p>Last Updated: {formatDate(application.updated_at || application.created_at)}</p>
      </div>
    </div>
  )
}
