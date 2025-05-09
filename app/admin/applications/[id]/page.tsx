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
  User,
  Building2,
  DollarSign,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Briefcase,
  BarChart,
  Clock4,
  Target,
  MessageSquare,
  CheckCircle,
  XCircle,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [status, setStatus] = useState("")
  const [notes, setNotes] = useState("")
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [contactMenuOpen, setContactMenuOpen] = useState(false)

  useEffect(() => {
    fetchApplicationDetails()
  }, [id])

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Get the application data
      const { data: appData, error: appError } = await supabase.from("applications").select("*").eq("id", id).single()

      if (appError) throw appError

      // Get applicant details
      const { data: applicantData, error: applicantError } = await supabase
        .from("applicant_details")
        .select("*")
        .eq("application_id", id)
        .single()

      if (applicantError && applicantError.code !== "PGRST116") {
        console.error("Error fetching applicant details:", applicantError)
      }

      // Get business details
      const { data: businessData, error: businessError } = await supabase
        .from("business_details")
        .select("*")
        .eq("application_id", id)
        .single()

      if (businessError && businessError.code !== "PGRST116") {
        console.error("Error fetching business details:", businessError)
      }

      // Get funding requests
      const { data: fundingData, error: fundingError } = await supabase
        .from("funding_requests")
        .select("*")
        .eq("application_id", id)
        .single()

      if (fundingError && fundingError.code !== "PGRST116") {
        console.error("Error fetching funding requests:", fundingError)
      }

      // Get additional information
      const { data: additionalData, error: additionalError } = await supabase
        .from("additional_information")
        .select("*")
        .eq("application_id", id)
        .single()

      if (additionalError && additionalError.code !== "PGRST116") {
        console.error("Error fetching additional information:", additionalError)
      }

      // Combine all data
      const combinedData = {
        ...appData,
        applicant_details: applicantData || {},
        business_details: businessData || {},
        funding_requests: fundingData || {},
        additional_information: additionalData || {},
      }

      setApplication(combinedData)
      setStatus(combinedData?.status || "pending")
      setNotes(combinedData?.notes || "")
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

  const formatCurrency = (amount: string | number) => {
    if (!amount) return "N/A"
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(Number(amount))
    } catch (error) {
      return amount.toString()
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

  // Helper function to safely get nested values
  const getValue = (obj: any, path: string, defaultValue: any = "N/A") => {
    if (!obj) return defaultValue

    try {
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
    } catch (error) {
      console.error("Error getting value:", error)
      return defaultValue
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

  // Get applicant name from applicant_details
  const applicantName = getValue(application, "applicant_details.full_name")

  // Get business name from business_details
  const businessName = getValue(application, "business_details.business_name")

  // Get email from applicant_details
  const email = getValue(application, "applicant_details.email")

  // Get phone from applicant_details
  const phone = getValue(application, "applicant_details.phone")

  // Get funding amount from funding_requests
  const fundingAmount = getValue(application, "funding_requests.funding_amount")

  // Get business type from business_details
  const businessType = getValue(application, "business_details.business_type")

  // Get industry from business_details
  const industry = getValue(application, "business_details.industry")

  // Get years in business from business_details
  const yearsInBusiness = getValue(application, "business_details.years_in_business")

  // Get annual revenue from business_details
  const annualRevenue = getValue(application, "business_details.annual_revenue")

  // Get credit score from business_details
  const creditScore = getValue(application, "business_details.credit_score")

  // Get funding purpose from funding_requests
  const fundingPurpose = getValue(application, "funding_requests.funding_purpose")

  // Get timeframe from funding_requests
  const timeframe = getValue(application, "funding_requests.timeframe")

  // Get additional comments from additional_information
  const additionalComments = getValue(application, "additional_information.additional_info")

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
        {/* Section headers */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold">Application Details</h2>
            <div className="text-xs text-gray-500">(All information visible on one page)</div>
          </div>

          {/* Status Button in Corner */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">{getStatusBadge(status)}</div>
            <Button onClick={() => setIsDrawerOpen(true)} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <MessageSquare className="h-4 w-4 mr-2" />
              Status & Notes
            </Button>
          </div>
        </div>

        {/* Application Content in Full-Width Grid */}
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
                  <p className="text-xs font-medium text-gray-500">Credit Score</p>
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3 text-gray-400" />
                    <p>{creditScore}</p>
                  </div>
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
                  <p>{businessType}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Years in Business</p>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <p>{yearsInBusiness}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Industry</p>
                  <p>{industry}</p>
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
                  <p>{fundingPurpose}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Timeframe</p>
                  <div className="flex items-center gap-1">
                    <Clock4 className="h-3 w-3 text-gray-400" />
                    <p>{timeframe}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Annual Revenue</p>
                  <div className="flex items-center gap-1">
                    <BarChart className="h-3 w-3 text-gray-400" />
                    <p>{annualRevenue}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card className="md:col-span-2 xl:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-500" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-medium text-gray-500">Business Name</p>
                  <p className="font-medium">{businessName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Business Type</p>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3 text-gray-400" />
                    <p>{businessType}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Industry</p>
                  <p>{industry}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Years in Business</p>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <p>{yearsInBusiness}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Annual Revenue</p>
                  <div className="flex items-center gap-1">
                    <BarChart className="h-3 w-3 text-gray-400" />
                    <p>{annualRevenue}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Credit Score</p>
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3 text-gray-400" />
                    <p>{creditScore}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funding Details */}
          <Card className="md:col-span-2 xl:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                Funding Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-medium text-gray-500">Funding Amount</p>
                  <p className="text-base font-semibold text-blue-700">
                    {fundingAmount !== "N/A" ? fundingAmount : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Funding Purpose</p>
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3 text-gray-400" />
                    <p>{fundingPurpose}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Timeframe</p>
                  <div className="flex items-center gap-1">
                    <Clock4 className="h-3 w-3 text-gray-400" />
                    <p>{timeframe}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Comments */}
          {additionalComments !== "N/A" && (
            <Card className="md:col-span-2 xl:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  Additional Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{additionalComments}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Status & Notes Drawer - Using React state instead of DOM manipulation */}
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
