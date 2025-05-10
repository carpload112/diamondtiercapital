"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Copy, LineChart, BarChart, PieChart, ArrowUpRight, Download, Users, LogOut } from "lucide-react"
import { createClientClient } from "@/lib/supabase/client"

export default function AffiliateDashboardClient({ affiliate }: { affiliate: any }) {
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
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientClient()
  const siteUrl = "https://www.diamondtiercapital.com"

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real implementation, this would fetch actual stats from the server
        // For now, we'll use mock data
        setStats({
          totalClicks: 156,
          totalApplications: 12,
          approvedApplications: 5,
          pendingApplications: 7,
          totalCommissions: 2500,
          paidCommissions: 1500,
          pendingCommissions: 1000,
          conversionRate: 7.69,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [affiliate.id])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/affiliate/login")
    router.refresh()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-slate-500">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Affiliate Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {affiliate.first_name} {affiliate.last_name} |{" "}
            {getTierBadge(affiliate.tier?.name || "bronze")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
            <Input
              value={`${siteUrl}/applynow?ref=${affiliate.referral_code}`}
              readOnly
              className="h-9 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => copyToClipboard(`${siteUrl}/applynow?ref=${affiliate.referral_code}`)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <LineChart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClicks}</div>
            <p className="text-xs text-gray-500">Visitors from your affiliate link</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <BarChart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Approved: {stats.approvedApplications}</span>
              <span>Pending: {stats.pendingApplications}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Commissions</CardTitle>
            <PieChart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalCommissions)}</div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Paid: {formatCurrency(stats.paidCommissions)}</span>
              <span>Pending: {formatCurrency(stats.pendingCommissions)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate.toFixed(2)}%</div>
            <p className="text-xs text-gray-500">Clicks to applications</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="marketing">Marketing Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Performance Overview</CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <LineChart className="h-16 w-16 mx-auto mb-2 opacity-20" />
                <p>Performance chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <PieChart className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>Traffic sources chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>Conversion funnel chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Commission History</CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 border-b px-4 py-2 font-medium">
                  <div>Date</div>
                  <div>Application</div>
                  <div>Amount</div>
                  <div>Rate</div>
                  <div>Status</div>
                </div>
                <div className="divide-y">
                  <div className="grid grid-cols-5 px-4 py-3">
                    <div className="text-sm">May 10, 2025</div>
                    <div className="text-sm">APP12345</div>
                    <div className="text-sm">{formatCurrency(1000)}</div>
                    <div className="text-sm">15%</div>
                    <div className="text-sm">
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 px-4 py-3">
                    <div className="text-sm">May 5, 2025</div>
                    <div className="text-sm">APP12344</div>
                    <div className="text-sm">{formatCurrency(1500)}</div>
                    <div className="text-sm">15%</div>
                    <div className="text-sm">
                      <Badge className="bg-green-100 text-green-800">Paid</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Payment Method</h3>
                    <p className="text-sm text-gray-500">{affiliate.payment_method || "Bank Transfer"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Payment Schedule</h3>
                    <p className="text-sm text-gray-500">Monthly (15th of each month)</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Next Payment</h3>
                  <p className="text-sm text-gray-500">{formatCurrency(stats.pendingCommissions)} on June 15, 2025</p>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm">
                    Update Payment Information
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Application Referrals</CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 border-b px-4 py-2 font-medium">
                  <div>Date</div>
                  <div>Reference ID</div>
                  <div>Client</div>
                  <div>Amount</div>
                  <div>Status</div>
                </div>
                <div className="divide-y">
                  <div className="grid grid-cols-5 px-4 py-3">
                    <div className="text-sm">May 10, 2025</div>
                    <div className="text-sm">APP12345</div>
                    <div className="text-sm">John Smith</div>
                    <div className="text-sm">$50,000 - $100,000</div>
                    <div className="text-sm">
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 px-4 py-3">
                    <div className="text-sm">May 5, 2025</div>
                    <div className="text-sm">APP12344</div>
                    <div className="text-sm">Jane Doe</div>
                    <div className="text-sm">$100,000 - $250,000</div>
                    <div className="text-sm">
                      <Badge className="bg-green-100 text-green-800">Approved</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Banners & Graphics</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Download high-quality banners and graphics to promote our services.
                  </p>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Assets
                  </Button>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Email Templates</h3>
                  <p className="text-sm text-gray-500 mb-4">Ready-to-use email templates to send to your network.</p>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Templates
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Custom Landing Pages</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Create custom landing pages with your branding and referral code.
                </p>
                <Button className="gap-2">
                  <Users className="h-4 w-4" />
                  Create Landing Page
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Referral Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Main Referral Link</h3>
                  <div className="flex items-center gap-2">
                    <Input
                      value={`${siteUrl}/applynow?ref=${affiliate.referral_code}`}
                      readOnly
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(`${siteUrl}/applynow?ref=${affiliate.referral_code}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">SBA Loans Referral Link</h3>
                  <div className="flex items-center gap-2">
                    <Input
                      value={`${siteUrl}/sba-loans?ref=${affiliate.referral_code}`}
                      readOnly
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(`${siteUrl}/sba-loans?ref=${affiliate.referral_code}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Business Credit Cards Referral Link</h3>
                  <div className="flex items-center gap-2">
                    <Input
                      value={`${siteUrl}/business-credit-cards?ref=${affiliate.referral_code}`}
                      readOnly
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(`${siteUrl}/business-credit-cards?ref=${affiliate.referral_code}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
