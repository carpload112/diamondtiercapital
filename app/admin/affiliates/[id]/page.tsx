"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, DollarSign, BarChart, RefreshCw, WrenchIcon, ArrowLeft } from "lucide-react"
import { formatCurrency } from "@/lib/utils/affiliate-utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AffiliateRealTimeUpdater } from "@/components/admin/AffiliateRealTimeUpdater"
import { AffiliateReferralButtons } from "@/components/admin/AffiliateReferralButtons"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function AffiliateDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [affiliate, setAffiliate] = useState<any>(null)
  const [stats, setStats] = useState<any>({
    total_clicks: 0,
    total_applications: 0,
    approved_applications: 0,
    pending_applications: 0,
    rejected_applications: 0,
    total_commissions: 0,
    paid_commissions: 0,
    pending_commissions: 0,
    conversion_rate: 0,
  })
  const [applications, setApplications] = useState<any[]>([])
  const [commissions, setCommissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [debugInfo, setDebugInfo] = useState<any>(null)

  // Safe currency formatter that handles all edge cases
  const safeCurrency = (value: any): string => {
    if (value === null || value === undefined) return formatCurrency(0)
    if (typeof value === "number") return formatCurrency(value)
    if (typeof value === "string") {
      const cleaned = value.replace(/[^0-9.]/g, "")
      const num = Number.parseFloat(cleaned)
      return formatCurrency(isNaN(num) ? 0 : num)
    }
    return formatCurrency(0)
  }

  // Safe number formatter for currency
  const safeFormatCurrency = (value: any) => {
    if (value === null || value === undefined) return formatCurrency(0)
    const num = typeof value === "string" ? Number.parseFloat(value) : value
    return formatCurrency(isNaN(num) ? 0 : num)
  }

  const { id } = params

  // Create Supabase client
  const supabase = createClientComponentClient()

  // Safe number conversion
  const safeNumber = (value: any): number => {
    if (value === null || value === undefined) return 0

    // If it's already a number, return it
    if (typeof value === "number") return value

    // Try to convert string to number
    const num = Number(value)
    return isNaN(num) ? 0 : num
  }

  // Calculate stats from raw data
  const calculateStats = (clicks: any[], applications: any[], commissions: any[]) => {
    // Log raw commission data for debugging
    console.log("Raw commission data:", commissions)

    // Debug info for UI
    const debugCommissions = commissions.map((c) => ({
      id: c.id,
      amount: c.amount,
      amount_type: typeof c.amount,
      parsed: safeNumber(c.amount),
      status: c.status,
    }))

    setDebugInfo({
      commissions: debugCommissions,
      clicks: clicks.length,
      applications: applications.length,
    })

    // Count applications by status
    const approvedApplications = applications.filter((app) => app.status === "approved").length
    const pendingApplications = applications.filter(
      (app) => app.status === "pending" || app.status === "in_review",
    ).length
    const rejectedApplications = applications.filter((app) => app.status === "rejected").length

    // Calculate commission amounts with safer parsing
    let totalCommissions = 0
    let paidCommissions = 0
    let pendingCommissions = 0

    commissions.forEach((commission) => {
      const amount = safeNumber(commission.amount)
      totalCommissions += amount

      if (commission.status === "paid") {
        paidCommissions += amount
      } else if (commission.status === "pending" || !commission.status) {
        pendingCommissions += amount
      }
    })

    // Add $100 for each pending application that doesn't have a commission
    const applicationIdsWithCommissions = new Set(commissions.map((c) => c.application_id))
    const pendingAppsWithoutCommissions = applications.filter(
      (app) => (app.status === "pending" || app.status === "in_review") && !applicationIdsWithCommissions.has(app.id),
    ).length

    // Add $100 for each pending application without a commission
    const additionalPendingCommissions = pendingAppsWithoutCommissions * 100
    pendingCommissions += additionalPendingCommissions
    totalCommissions += additionalPendingCommissions

    // Calculate conversion rate (applications per click)
    const conversionRate = clicks.length > 0 ? (applications.length / clicks.length) * 100 : 0

    console.log("Calculated stats:", {
      total_applications: applications.length,
      approved_applications: approvedApplications,
      pending_applications: pendingApplications,
      rejected_applications: rejectedApplications,
      total_commissions: totalCommissions,
      paid_commissions: paidCommissions,
      pending_commissions: pendingCommissions,
      conversion_rate: conversionRate,
      pending_apps_without_commissions: pendingAppsWithoutCommissions,
      additional_pending_commissions: additionalPendingCommissions,
    })

    return {
      total_clicks: clicks.length,
      total_applications: applications.length,
      approved_applications: approvedApplications,
      pending_applications: pendingApplications,
      rejected_applications: rejectedApplications,
      total_commissions: totalCommissions,
      paid_commissions: paidCommissions,
      pending_commissions: pendingCommissions,
      conversion_rate: conversionRate,
    }
  }

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        console.log("Loading affiliate data for ID:", id)

        // Get affiliate details
        const { data: affiliateData, error: affiliateError } = await supabase
          .from("affiliates")
          .select("*")
          .eq("id", id)
          .single()

        if (affiliateError) {
          console.error("Error loading affiliate:", affiliateError)
          setError(`Failed to load affiliate: ${affiliateError.message}`)
          return
        }

        if (!affiliateData) {
          console.error("No affiliate found with ID:", id)
          setError("Affiliate not found")
          return
        }

        console.log("Affiliate data loaded:", affiliateData)
        setAffiliate(affiliateData)

        // Get affiliate clicks
        const { data: clicksData, error: clicksError } = await supabase
          .from("affiliate_clicks")
          .select("*")
          .eq("affiliate_id", id)

        if (clicksError) {
          console.error("Error loading clicks:", clicksError)
        } else {
          console.log(`Loaded ${clicksData?.length || 0} clicks`)
        }

        // First, get basic application data
        const { data: basicApplicationsData, error: basicApplicationsError } = await supabase
          .from("applications")
          .select(`
            id,
            reference_id,
            status,
            created_at,
            affiliate_code,
            affiliate_id
          `)
          .or(`affiliate_id.eq.${id},affiliate_code.eq.${affiliateData.referral_code}`)
          .order("created_at", { ascending: false })

        if (basicApplicationsError) {
          console.error("Error loading applications:", basicApplicationsError)
          setError(`Failed to load applications: ${basicApplicationsError.message}`)
        } else if (basicApplicationsData && basicApplicationsData.length > 0) {
          console.log(`Loaded ${basicApplicationsData.length} basic applications`)

          // Get application IDs to fetch related data
          const applicationIds = basicApplicationsData.map((app) => app.id)

          // Fetch applicant details
          const { data: applicantDetailsData, error: applicantDetailsError } = await supabase
            .from("applicant_details")
            .select("*")
            .in("application_id", applicationIds)

          if (applicantDetailsError) {
            console.error("Error loading applicant details:", applicantDetailsError)
          } else {
            console.log(`Loaded ${applicantDetailsData?.length || 0} applicant details`)
          }

          // Fetch business details
          const { data: businessDetailsData, error: businessDetailsError } = await supabase
            .from("business_details")
            .select("*")
            .in("application_id", applicationIds)

          if (businessDetailsError) {
            console.error("Error loading business details:", businessDetailsError)
          } else {
            console.log(`Loaded ${businessDetailsData?.length || 0} business details`)
          }

          // Create lookup maps
          const applicantDetailsMap = new Map()
          if (applicantDetailsData) {
            applicantDetailsData.forEach((detail) => {
              applicantDetailsMap.set(detail.application_id, detail)
            })
          }

          const businessDetailsMap = new Map()
          if (businessDetailsData) {
            businessDetailsData.forEach((detail) => {
              businessDetailsMap.set(detail.application_id, detail)
            })
          }

          // Combine data
          const enhancedApplications = basicApplicationsData.map((app) => {
            const applicantDetails = applicantDetailsMap.get(app.id) || {}
            const businessDetails = businessDetailsMap.get(app.id) || {}

            return {
              ...app,
              applicant_details: {
                full_name: applicantDetails.full_name || "N/A",
                email: applicantDetails.email || "N/A",
              },
              business_details: {
                business_name: businessDetails.business_name || "N/A",
                business_type: businessDetails.business_type || "N/A",
              },
            }
          })

          setApplications(enhancedApplications)
        } else {
          setApplications([])
        }

        // Get affiliate's commissions with a direct SQL query for accurate totals
        try {
          // First try to get commission totals directly from SQL for accuracy
          const { data: commissionTotals, error: totalsError } = await supabase.rpc("get_affiliate_commission_totals", {
            affiliate_id_param: id,
          })

          if (!totalsError && commissionTotals && commissionTotals.length > 0) {
            console.log("Commission totals from SQL:", commissionTotals[0])
            stats.total_commissions = commissionTotals[0].total_amount || 0
            stats.paid_commissions = commissionTotals[0].paid_amount || 0
            stats.pending_commissions = commissionTotals[0].pending_amount || 0
          } else {
            console.log("SQL totals not available, falling back to manual calculation")
          }
        } catch (sqlError) {
          console.log("SQL calculation error:", sqlError)
        }

        // Get raw commission data for display and fallback calculation
        const { data: commissionsData, error: commissionsError } = await supabase
          .from("affiliate_commissions")
          .select(`
            id,
            amount,
            rate,
            status,
            created_at,
            payout_date,
            application_id
          `)
          .eq("affiliate_id", id)
          .order("created_at", { ascending: false })

        if (commissionsError) {
          console.error("Error loading commissions:", commissionsError)
        } else {
          console.log(`Loaded ${commissionsData?.length || 0} commissions`)

          // Log the raw commission data to see what we're working with
          console.log(
            "Raw commission data sample:",
            commissionsData?.slice(0, 3).map((c) => ({
              id: c.id,
              amount: c.amount,
              amount_type: typeof c.amount,
              status: c.status,
            })),
          )

          // Manual calculation as fallback
          if (
            (!stats.total_commissions || stats.total_commissions === 0) &&
            commissionsData &&
            commissionsData.length > 0
          ) {
            let totalAmount = 0
            let paidAmount = 0
            let pendingAmount = 0

            commissionsData.forEach((commission) => {
              // Handle all possible data formats
              let amount = 0

              if (commission.amount !== null && commission.amount !== undefined) {
                if (typeof commission.amount === "number") {
                  amount = commission.amount
                } else if (typeof commission.amount === "string") {
                  // Remove any non-numeric characters except decimal point
                  const cleanedAmount = commission.amount.replace(/[^0-9.]/g, "")
                  amount = Number.parseFloat(cleanedAmount)
                }
              }

              // Only add valid numbers
              if (!isNaN(amount)) {
                totalAmount += amount

                if (commission.status === "paid") {
                  paidAmount += amount
                } else {
                  pendingAmount += amount
                }
              }
            })

            console.log("Manually calculated commission totals:", {
              total: totalAmount,
              paid: paidAmount,
              pending: pendingAmount,
            })

            stats.total_commissions = totalAmount
            stats.paid_commissions = paidAmount
            stats.pending_commissions = pendingAmount
          }

          // Get all application IDs from commissions
          const applicationIds = commissionsData.map((comm) => comm.application_id).filter(Boolean)

          // Create a set of application IDs that already have commissions
          const applicationIdsWithCommissions = new Set(applicationIds)

          // Find pending applications without commissions
          const pendingAppsWithoutCommissions =
            basicApplicationsData?.filter(
              (app) =>
                (app.status === "pending" || app.status === "in_review") && !applicationIdsWithCommissions.has(app.id),
            ) || []

          console.log(`Found ${pendingAppsWithoutCommissions.length} pending applications without commissions`)

          // Create virtual commission entries for pending applications without commissions
          const virtualCommissions = pendingAppsWithoutCommissions.map((app) => ({
            id: `virtual-${app.id}`,
            amount: 100,
            rate: 10,
            status: "pending",
            created_at: app.created_at,
            payout_date: null,
            application_id: app.id,
            application: {
              reference_id: app.reference_id || "N/A",
            },
            isVirtual: true,
          }))

          if (applicationIds.length > 0) {
            // Get reference IDs for these applications
            const { data: appRefData } = await supabase
              .from("applications")
              .select("id, reference_id")
              .in("id", applicationIds)

            // Create a lookup map
            const appRefMap = new Map()
            if (appRefData) {
              appRefData.forEach((app) => {
                appRefMap.set(app.id, app.reference_id)
              })
            }

            // Enhance commission data with reference IDs
            const enhancedCommissions = commissionsData.map((comm) => ({
              ...comm,
              application: {
                reference_id: appRefMap.get(comm.application_id) || "N/A",
              },
            }))

            // Combine real commissions with virtual ones
            setCommissions([...enhancedCommissions, ...virtualCommissions])
          } else {
            // If no real commissions, just use virtual ones
            setCommissions(virtualCommissions)
          }
        }

        // Calculate stats from the raw data
        const calculatedStats = calculateStats(clicksData || [], basicApplicationsData || [], commissionsData || [])
        setStats(calculatedStats)

        setLastUpdated(new Date())
      } catch (error) {
        console.error("Error loading data:", error)
        setError("An unexpected error occurred while loading data")
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    }

    loadData()
  }, [id, refreshing, supabase])

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "in_review":
        return <Badge className="bg-blue-100 text-blue-800">In Review</Badge>
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      default:
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
    }
  }

  // Get tier badge
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "platinum":
        return <Badge className="bg-purple-100 text-purple-800">Platinum</Badge>
      case "gold":
        return <Badge className="bg-yellow-100 text-yellow-800">Gold</Badge>
      case "silver":
        return <Badge className="bg-gray-100 text-gray-800">Silver</Badge>
      default:
        return <Badge className="bg-amber-100 text-amber-800">Bronze</Badge>
    }
  }

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true)
  }

  // Handle fix tracking
  const handleFixTracking = async () => {
    try {
      setRefreshing(true)
      const response = await fetch("/api/affiliate/fix-tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error fixing tracking:", errorData)
      } else {
        const result = await response.json()
        console.log("Fix tracking result:", result)
      }

      // Wait a moment for the database to update
      setTimeout(() => {
        setRefreshing(false)
      }, 1000)
    } catch (error) {
      console.error("Error fixing tracking:", error)
      setRefreshing(false)
    }
  }

  // Get base URL for referral links
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.diamondtiercapital.com"

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading affiliate data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <p className="mt-2 text-gray-600">{error}</p>
        <Button className="mt-4" onClick={() => router.push("/admin/affiliates")}>
          Back to Affiliates
        </Button>
      </div>
    )
  }

  if (!affiliate) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-600">Affiliate not found</h2>
        <p className="mt-2 text-gray-600">The affiliate you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-4" onClick={() => router.push("/admin/affiliates")}>
          Back to Affiliates
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/affiliates")} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{affiliate.name}</h1>
            <p className="text-sm text-gray-500">Affiliate Partner Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Last updated: {lastUpdated.toLocaleTimeString()}</span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>
          <button
            onClick={handleFixTracking}
            disabled={refreshing}
            className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-600 px-3 py-1 rounded-md text-sm disabled:opacity-50"
          >
            <WrenchIcon className="h-3 w-3" /> Fix Tracking
          </button>
        </div>
      </div>

      {/* Affiliate Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{affiliate.name}</h1>
              {affiliate.tier && getTierBadge(affiliate.tier)}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {affiliate.email} {affiliate.company_name && `• ${affiliate.company_name}`}
            </p>
            <div className="text-xs text-gray-500 mt-1">
              Referral Code: <span className="font-mono">{affiliate.referral_code}</span>
            </div>
            <AffiliateRealTimeUpdater affiliateId={id} />
          </div>

          <AffiliateReferralButtons referralCode={affiliate.referral_code} baseUrl={baseUrl} />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" />
              Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_applications || 0}</div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge className="bg-green-100 text-green-800">{stats.approved_applications || 0} Approved</Badge>
              <Badge className="bg-amber-100 text-amber-800">{stats.pending_applications || 0} Pending</Badge>
              {stats.rejected_applications > 0 && (
                <Badge className="bg-red-100 text-red-800">{stats.rejected_applications} Rejected</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              Commissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {typeof stats.total_commissions === "number"
                ? formatCurrency(stats.total_commissions)
                : formatCurrency(0)}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge className="bg-green-100 text-green-800">
                {typeof stats.paid_commissions === "number"
                  ? formatCurrency(stats.paid_commissions)
                  : formatCurrency(0)}{" "}
                Paid
              </Badge>
              <Badge className="bg-amber-100 text-amber-800">
                {typeof stats.pending_commissions === "number"
                  ? formatCurrency(stats.pending_commissions)
                  : formatCurrency(0)}{" "}
                Pending
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart className="h-4 w-4 text-blue-500" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.conversion_rate || 0).toFixed(1)}%</div>
            <div className="text-sm text-gray-500 mt-1">
              {stats.total_clicks || 0} clicks → {stats.total_applications || 0} applications
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Applications and Commissions */}
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 h-9">
          <TabsTrigger value="applications" className="text-xs">
            Applications ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="commissions" className="text-xs">
            Commissions ({commissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
              <CardDescription>Applications referred by this affiliate.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Referral Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications && applications.length > 0 ? (
                    applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-mono text-xs">
                          <Link href={`/admin/applications/${app.id}`} className="text-blue-600 hover:underline">
                            {app.reference_id}
                          </Link>
                        </TableCell>
                        <TableCell>{app.applicant_details?.full_name || "N/A"}</TableCell>
                        <TableCell>{app.business_details?.business_name || "N/A"}</TableCell>
                        <TableCell className="font-mono text-xs">{app.affiliate_code || "N/A"}</TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell className="text-xs text-gray-500">{formatDate(app.created_at)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                        No applications found for this affiliate.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Commissions</CardTitle>
              <CardDescription>Commissions earned by this affiliate.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissions && commissions.length > 0 ? (
                    commissions.map((commission) => (
                      <TableRow key={commission.id} className={commission.isVirtual ? "bg-amber-50" : ""}>
                        <TableCell className="font-mono text-xs">
                          {commission.application?.reference_id || "N/A"}
                        </TableCell>
                        <TableCell className="font-medium">{safeCurrency(commission.amount)}</TableCell>
                        <TableCell>{commission.rate}%</TableCell>
                        <TableCell>{getStatusBadge(commission.status || "pending")}</TableCell>
                        <TableCell className="text-xs text-gray-500">{formatDate(commission.created_at)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                        No commissions found for this affiliate.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === "development" && debugInfo && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Debug Information</h3>
          <pre className="text-xs overflow-auto max-h-40">{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
