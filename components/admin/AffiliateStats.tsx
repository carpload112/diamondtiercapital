"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "lucide-react"

interface AffiliateStatsProps {
  stats: {
    totalClicks: number
    totalApplications: number
    approvedApplications: number
    pendingApplications: number
    totalCommissions: number
    paidCommissions: number
    pendingCommissions: number
    conversionRate: number
  }
}

export function AffiliateStats({ stats }: AffiliateStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <LineChart className="h-4 w-4 text-gray-500" />
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
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <LineChart className="h-16 w-16 mx-auto mb-2 opacity-20" />
                <p>Performance chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-4 border-b px-4 py-2 font-medium">
                  <div>Date</div>
                  <div>Application</div>
                  <div>Amount</div>
                  <div>Status</div>
                </div>
                <div className="divide-y">
                  {stats.totalCommissions > 0 ? (
                    <div className="grid grid-cols-4 px-4 py-3">
                      <div className="text-sm">May 10, 2025</div>
                      <div className="text-sm">APP12345</div>
                      <div className="text-sm">{formatCurrency(stats.pendingCommissions)}</div>
                      <div className="text-sm">
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                          Pending
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-center text-sm text-gray-500">No commission history available</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-4 border-b px-4 py-2 font-medium">
                  <div>Date</div>
                  <div>Client</div>
                  <div>Amount</div>
                  <div>Status</div>
                </div>
                <div className="divide-y">
                  {stats.totalApplications > 0 ? (
                    <div className="grid grid-cols-4 px-4 py-3">
                      <div className="text-sm">May 10, 2025</div>
                      <div className="text-sm">John Doe</div>
                      <div className="text-sm">$50,000 - $100,000</div>
                      <div className="text-sm">
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                          Pending
                        </span>
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
      </Tabs>
    </div>
  )
}
