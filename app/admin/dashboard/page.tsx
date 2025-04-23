"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getLoanApplications, getCreditRepairClients } from "@/lib/form-service"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function AdminDashboard() {
  const [loanStats, setLoanStats] = useState({
    total: 0,
    new: 0,
    inReview: 0,
    approved: 0,
    rejected: 0,
  })

  const [creditRepairStats, setCreditRepairStats] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    completed: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loanApplications, creditRepairClients] = await Promise.all([
          getLoanApplications(),
          getCreditRepairClients(),
        ])

        // Calculate loan application stats
        const loanStats = {
          total: loanApplications.length,
          new: loanApplications.filter((app) => app.status === "new").length,
          inReview: loanApplications.filter((app) => app.status === "in-review").length,
          approved: loanApplications.filter((app) => app.status === "approved").length,
          rejected: loanApplications.filter((app) => app.status === "rejected").length,
        }

        // Calculate credit repair stats
        const creditRepairStats = {
          total: creditRepairClients.length,
          new: creditRepairClients.filter((client) => client.status === "new").length,
          inProgress: creditRepairClients.filter((client) => client.status === "in-progress").length,
          completed: creditRepairClients.filter((client) => client.status === "completed").length,
        }

        setLoanStats(loanStats)
        setCreditRepairStats(creditRepairStats)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const loanStatusData = [
    { name: "New", value: loanStats.new },
    { name: "In Review", value: loanStats.inReview },
    { name: "Approved", value: loanStats.approved },
    { name: "Rejected", value: loanStats.rejected },
  ]

  const creditRepairStatusData = [
    { name: "New", value: creditRepairStats.new },
    { name: "In Progress", value: creditRepairStats.inProgress },
    { name: "Completed", value: creditRepairStats.completed },
  ]

  const COLORS = ["#0088FE", "#FFBB28", "#00C49F", "#FF8042"]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loanStats.total + creditRepairStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Loan Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loanStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Credit Repair Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{creditRepairStats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Approval Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loanStats.total > 0 ? Math.round((loanStats.approved / loanStats.total) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Loan Applications by Status</CardTitle>
            <CardDescription>Distribution of loan applications by their current status</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={loanStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {loanStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credit Repair Clients by Status</CardTitle>
            <CardDescription>Distribution of credit repair clients by their current status</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={creditRepairStatusData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
