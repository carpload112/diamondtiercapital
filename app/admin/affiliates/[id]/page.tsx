"use client"

import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, User, DollarSign, BarChart, LinkIcon } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import { formatCurrency } from "@/lib/utils/affiliate-utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AffiliateRealTimeUpdater } from "@/components/admin/AffiliateRealTimeUpdater"
import { DashboardHeader } from "@/components/admin/DashboardHeader"

export default async function AffiliateDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const supabase = createServerClient()

  // Get affiliate details
  const { data: affiliate, error } = await supabase.from("affiliates").select("*").eq("id", id).single()

  if (error || !affiliate) {
    notFound()
  }

  // Get affiliate stats
  const { data: statsData } = await supabase.rpc("get_affiliate_stats", { affiliate_id: id })

  const stats = statsData?.[0] || {
    total_clicks: 0,
    total_applications: 0,
    approved_applications: 0,
    pending_applications: 0,
    rejected_applications: 0,
    total_commissions: 0,
    paid_commissions: 0,
    pending_commissions: 0,
    conversion_rate: 0,
  }

  // Get affiliate's applications
  const { data: applications } = await supabase
    .from("applications")
    .select(`
      id,
      reference_id,
      status,
      created_at,
      applicant_details:applicant_details_id(full_name, email),
      business_details:business_details_id(business_name, business_type)
    `)
    .eq("affiliate_id", id)
    .order("created_at", { ascending: false })

  // Get affiliate's commissions
  const { data: commissions } = await supabase
    .from("affiliate_commissions")
    .select(`
      id,
      amount,
      rate,
      status,
      created_at,
      payout_date,
      application:application_id(reference_id)
    `)
    .eq("affiliate_id", id)
    .order("created_at", { ascending: false })

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

  // Get base URL for referral links
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.diamondtiercapital.com"

  return (
    <div className="space-y-6">
      <DashboardHeader
        title={`${affiliate.name}`}
        description="Affiliate Partner Details"
        backLink="/admin/affiliates"
        backLinkText="Back to Affiliates"
      />

      {/* Affiliate Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{affiliate.name}</h1>
              {getTierBadge(affiliate.tier || "bronze")}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {affiliate.email} {affiliate.company_name && `• ${affiliate.company_name}`}
            </p>
            <AffiliateRealTimeUpdater affiliateId={id} />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-md">
              <code className="text-xs font-mono">{affiliate.referral_code}</code>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(affiliate.referral_code)
                    // You could add a toast notification here if you have a toast component
                  } catch (err) {
                    console.error("Failed to copy text: ", err)
                  }
                }}
                title="Copy referral code"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>

            <Button
              size="sm"
              className="gap-1"
              onClick={async () => {
                const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
                const referralLink = `${baseUrl}/applynow?ref=${affiliate.referral_code}`
                try {
                  await navigator.clipboard.writeText(referralLink)
                  // You could add a toast notification here if you have a toast component
                } catch (err) {
                  console.error("Failed to copy link: ", err)
                }
              }}
            >
              <LinkIcon className="h-3.5 w-3.5" />
              <span>Copy Referral Link</span>
            </Button>
          </div>
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
            <div className="text-2xl font-bold">{stats.total_applications}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-green-100 text-green-800">{stats.approved_applications} Approved</Badge>
              <Badge className="bg-amber-100 text-amber-800">{stats.pending_applications} Pending</Badge>
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
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.total_commissions)}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-green-100 text-green-800">{formatCurrency(stats.paid_commissions)} Paid</Badge>
              <Badge className="bg-amber-100 text-amber-800">{formatCurrency(stats.pending_commissions)} Pending</Badge>
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
            <div className="text-2xl font-bold">{stats.conversion_rate.toFixed(1)}%</div>
            <div className="text-sm text-gray-500 mt-1">
              {stats.total_clicks} clicks → {stats.total_applications} applications
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Applications and Commissions */}
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 h-9">
          <TabsTrigger value="applications" className="text-xs">
            Applications
          </TabsTrigger>
          <TabsTrigger value="commissions" className="text-xs">
            Commissions
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
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell className="text-xs text-gray-500">{formatDate(app.created_at)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-gray-500">
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
                      <TableRow key={commission.id}>
                        <TableCell className="font-mono text-xs">
                          {commission.application?.reference_id || "N/A"}
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(commission.amount)}</TableCell>
                        <TableCell>{commission.rate}%</TableCell>
                        <TableCell>{getStatusBadge(commission.status)}</TableCell>
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
    </div>
  )
}
