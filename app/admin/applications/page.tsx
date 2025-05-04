"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClientClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Download } from "lucide-react"

interface Application {
  id: string
  reference_id: string
  status: string
  created_at: string
  applicant_details: {
    full_name: string
    email: string
  }[]
  business_details: {
    business_name: string
    business_type: string
  }[]
  funding_requests: {
    funding_amount: string
  }[]
  full_name?: string
  business_name?: string
  email?: string
  funding_amount?: string
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    async function fetchApplications() {
      const supabase = createClientClient()

      const { data, error } = await supabase
        .from("applications")
        .select(`
          id,
          reference_id,
          status,
          created_at,
          applicant_details (
            full_name,
            email
          ),
          business_details (
            business_name,
            business_type
          ),
          funding_requests (
            funding_amount
          )
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching applications:", error)
      } else {
        setApplications(data || [])
      }

      setLoading(false)
    }

    fetchApplications()
  }, [])

  const filteredApplications =
    activeTab === "all" ? applications : applications.filter((app) => app.status === activeTab)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "in_review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? Number.parseFloat(amount) : amount
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num)
  }

  const getStatusBadge = (status: string) => {
    const colorClass = getStatusColor(status)
    const displayStatus = status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")

    return <Badge className={colorClass}>{displayStatus}</Badge>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Business Funding Applications</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage and review all submitted applications</p>
        </div>
        <Button className="mt-4 md:mt-0">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in_review">In Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-xl text-gray-500 dark:text-gray-400">No applications found</p>
            <p className="text-gray-400 dark:text-gray-500 mt-2">Applications matching your filter will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Applicant
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Business
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr key={application.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {application.applicant_details?.[0]?.full_name || "Unnamed Applicant"}
                      </div>
                      <div className="text-sm text-gray-500">{application.applicant_details?.[0]?.email || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {application.business_details?.[0]?.business_name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.business_details?.[0]?.business_type || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {application.funding_requests?.[0]?.funding_amount || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1).replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/applications/${application.id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredApplications.map((application) => (
              <div key={application.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">
                    {application.applicant_details?.[0]?.full_name || application.full_name || "No Name"}
                  </h3>
                  {getStatusBadge(application.status || "pending")}
                </div>

                <div className="text-sm text-gray-500 mb-2">
                  Ref: {application.reference_id || application.id.substring(0, 8).toUpperCase()}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <p className="text-gray-500">Business:</p>
                    <p>{application.business_details?.[0]?.business_name || application.business_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Amount:</p>
                    <p>
                      {formatCurrency(
                        application.funding_requests?.[0]?.funding_amount || application.funding_amount || 0,
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date:</p>
                    <p>{formatDate(application.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Contact:</p>
                    <p className="truncate">
                      {application.applicant_details?.[0]?.email || application.email || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/applications/${application.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
