import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, User, DollarSign, BarChart, LinkIcon } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import { getAffiliateById } from "@/lib/supabase/affiliate-actions"
import { affiliateTrackingService } from "@/lib/services/affiliate-tracking-service"
import { formatCurrency } from "@/lib/utils/affiliate-utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AffiliateRealTimeUpdater } from "@/components/admin/AffiliateRealTimeUpdater"

export default async function AffiliateDetailPage({ params }: { params: { id: string } }) {
  const { id } = params

  // Get affiliate details
  const { data: affiliate } = await getAffiliateById(id)

  if (!affiliate) {
    notFound()
  }

  // Get affiliate stats using the improved service
  const { data: stats } = await affiliateTrackingService.getAffiliateStats(id)

  // Get affiliate's applications
  const supabase = createServerClient()
  const { data: applications } = await supabase
    .from("applications")
    .select(`
      id,
      reference_id,
      status,
      created_at,
      applicant_details!inner(full_name, email),
      business_details!inner(business_name, business_type)
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
      applications!inner(reference_id)
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

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-2">
        <Link href="/admin/affiliates" className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-3 w-3 mr-1" />
          Back to Affiliates
        </Link>
      </div>

      {/* Affiliate Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">
                {affiliate.first_name} {affiliate.last_name}
              </h1>
              {getTierBadge(affiliate.tier)}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {affiliate.email} {affiliate.company_name && `• ${affiliate.company_name}`}
            </p>
            <AffiliateRealTimeUpdater affiliateId={id} />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-md">
              <code className="text-xs font-mono">{affiliate.referral_code}</code>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Copy className="h-3 w-3" />
              </Button>
            </div>

            <Button size="sm" className="gap-1">
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
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-green-100 text-green-800">{stats.approvedApplications} Approved</Badge>
              <Badge className="bg-amber-100 text-amber-800">{stats.pendingApplications} Pending</Badge>
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
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalCommissions)}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-green-100 text-green-800">{formatCurrency(stats.paidCommissions)} Paid</Badge>
              <Badge className="bg-amber-100 text-amber-800">{formatCurrency(stats.pendingCommissions)} Pending</Badge>
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
            <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-500 mt-1">
              {stats.totalClicks} clicks → {stats.totalApplications} applications
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Applications and Commissions */}
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-9">
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
                        <TableCell>{app.applicant_details.full_name}</TableCell>
                        <TableCell>{app.business_details.business_name}</TableCell>
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
                        <TableCell className="font-mono text-xs">{commission.applications.reference_id}</TableCell>
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
