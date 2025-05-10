"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AffiliateStats } from "@/components/admin/AffiliateStats"
import { createServerClient } from "@/lib/supabase/server"
import { getAffiliateStats, getAffiliateCommissions } from "@/lib/supabase/affiliate-actions"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Copy, Users } from "lucide-react"
import Link from "next/link"

export default function AffiliateDashboardPage() {
  const params = useParams()
  const { id } = params
  const [affiliate, setAffiliate] = useState(null)
  const [stats, setStats] = useState({
    totalClicks: 0,
    totalApplications: 0,
    approvedApplications: 0,
    pendingApplications: 0,
    totalCommissions: 0,
    paidCommissions: 0,
    pendingCommissions: 0,
    conversionRate: 0,
  })
  const [commissions, setCommissions] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (id) {
      fetchAffiliateData()
    }
  }, [id])

  const fetchAffiliateData = async () => {
    setLoading(true)
    try {
      const supabase = createServerClient()

      // Get affiliate details
      const { data: affiliateData, error: affiliateError } = await supabase
        .from("affiliates")
        .select("*")
        .eq("id", id)
        .single()

      if (affiliateError) throw affiliateError

      setAffiliate(affiliateData)

      // Get affiliate stats
      const { success: statsSuccess, data: statsData, error: statsError } = await getAffiliateStats(id)

      if (statsSuccess) {
        setStats(statsData)
      } else if (statsError) {
        console.error("Error fetching affiliate stats:", statsError)
      }

      // Get affiliate commissions
      const {
        success: commissionsSuccess,
        data: commissionsData,
        error: commissionsError,
      } = await getAffiliateCommissions(id)

      if (commissionsSuccess) {
        setCommissions(commissionsData || [])
      } else if (commissionsError) {
        console.error("Error fetching affiliate commissions:", commissionsError)
      }
    } catch (error) {
      console.error("Error fetching affiliate data:", error)
      toast({
        title: "Error",
        description: "Failed to load affiliate data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    })
  }

  const getTierBadge = (tier) => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-slate-500">Loading affiliate data...</p>
        </div>
      </div>
    )
  }

  if (!affiliate) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <h2 className="text-lg font-medium text-slate-900 mb-2">Affiliate Not Found</h2>
        <p className="text-sm text-slate-500 mb-4">
          The affiliate you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild size="sm">
          <Link href="/admin/affiliates">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Affiliates
          </Link>
        </Button>
      </div>
    )
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
              <h1 className="text-lg font-semibold">{affiliate.name}</h1>
              {getTierBadge(affiliate.tier)}
            </div>
            <p className="text-sm text-gray-500">{affiliate.email}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
              <code className="text-xs">{`https://diamondtiercapital.com/applynow?ref=${affiliate.referral_code}`}</code>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() =>
                  copyToClipboard(`https://diamondtiercapital.com/applynow?ref=${affiliate.referral_code}`)
                }
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Affiliate Stats */}
      <AffiliateStats stats={stats} />

      {/* Tabs for different views */}
      <Tabs defaultValue="commissions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="downline">Downline</TabsTrigger>
        </TabsList>

        <TabsContent value="commissions">
          <Card>
            <CardHeader>
              <CardTitle>Commission History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 border-b px-4 py-2 font-medium text-sm">
                  <div>Date</div>
                  <div>Application</div>
                  <div>Amount</div>
                  <div>Rate</div>
                  <div>Status</div>
                </div>
                <div className="divide-y">
                  {commissions.length > 0 ? (
                    commissions.map((commission) => (
                      <div key={commission.id} className="grid grid-cols-5 px-4 py-3 text-sm">
                        <div>{new Date(commission.created_at).toLocaleDateString()}</div>
                        <div>{commission.applications?.reference_id || "N/A"}</div>
                        <div>${Number.parseFloat(commission.amount).toFixed(2)}</div>
                        <div>{Number.parseFloat(commission.rate).toFixed(2)}%</div>
                        <div>
                          <Badge
                            className={
                              commission.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {commission.status.charAt(0).toUpperCase() + commission.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center text-sm text-gray-500">No commission history available</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Application Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 border-b px-4 py-2 font-medium text-sm">
                  <div>Date</div>
                  <div>Reference ID</div>
                  <div>Client</div>
                  <div>Amount</div>
                  <div>Status</div>
                </div>
                <div className="divide-y">
                  {stats.totalApplications > 0 ? (
                    <div className="grid grid-cols-5 px-4 py-3 text-sm">
                      <div>May 10, 2025</div>
                      <div>APP12345</div>
                      <div>John Doe</div>
                      <div>$50,000 - $100,000</div>
                      <div>
                        <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-center text-sm text-gray-500">
                      No application referrals available
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downline">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Downline Affiliates</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-sm text-gray-500">
                <p>No downline affiliates found</p>
                <Button variant="outline" size="sm" className="mt-4">
                  Add Sub-Affiliate
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
