"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { formatCurrency } from "@/lib/utils/affiliate-utils"

interface AffiliateStatsProps {
  stats: {
    totalClicks: number
    totalApplications: number
    approvedApplications: number
    pendingApplications: number
    rejectedApplications: number
    totalCommissions: number
    paidCommissions: number
    pendingCommissions: number
    conversionRate: number
  }
}

export function AffiliateStats({ stats }: AffiliateStatsProps) {
  // Prepare data for application status chart
  const applicationStatusData = [
    { name: "Approved", value: stats.approvedApplications, color: "#10b981" },
    { name: "Pending", value: stats.pendingApplications, color: "#f59e0b" },
    { name: "Rejected", value: stats.rejectedApplications, color: "#ef4444" },
  ]

  // Prepare data for commission status chart
  const commissionStatusData = [
    { name: "Paid", value: stats.paidCommissions, color: "#10b981" },
    { name: "Pending", value: stats.pendingCommissions, color: "#f59e0b" },
  ]

  // Prepare data for conversion funnel
  const conversionData = [
    { name: "Clicks", value: stats.totalClicks },
    { name: "Applications", value: stats.totalApplications },
    { name: "Approved", value: stats.approvedApplications },
  ]

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Visitors from your affiliate links</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">{stats.conversionRate.toFixed(1)}% conversion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Commissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalCommissions)}</div>
            <p className="text-xs text-gray-500 mt-1">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Pending Commissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{formatCurrency(stats.pendingCommissions)}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting payment</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-9">
          <TabsTrigger value="applications" className="text-xs">
            Applications
          </TabsTrigger>
          <TabsTrigger value="commissions" className="text-xs">
            Commissions
          </TabsTrigger>
          <TabsTrigger value="conversion" className="text-xs">
            Conversion
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 10, right: 30, left: 30, bottom: 50 }}>
                    <Pie
                      data={applicationStatusData}
                      cx="50%"
                      cy="40%"
                      labelLine={true}
                      outerRadius={90}
                      innerRadius={30}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      paddingAngle={2}
                    >
                      {applicationStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} Applications`, "Count"]} />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ paddingTop: 20 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Commission Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 10, right: 30, left: 30, bottom: 50 }}>
                    <Pie
                      data={commissionStatusData}
                      cx="50%"
                      cy="40%"
                      labelLine={true}
                      outerRadius={90}
                      innerRadius={30}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      paddingAngle={2}
                    >
                      {commissionStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Amount"]} />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ paddingTop: 20 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={conversionData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => value.toLocaleString()} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => [value.toLocaleString(), "Count"]} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
