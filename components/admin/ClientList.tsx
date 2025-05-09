"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, ChevronDown, ChevronUp, Eye } from "lucide-react"
import Link from "next/link"

type Application = {
  id: string
  reference_id: string
  status: string
  created_at: string
  full_name: string
  email: string
  business_name: string
  business_type: string
  amount_requested: string | number
  industry: string
}

type ClientListProps = {
  applications: Application[]
}

export function ClientList({ applications }: ClientListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filter applications based on search term
  const filteredApplications = applications.filter((app) => {
    const fullName = app.full_name || ""
    const email = app.email || ""
    const businessName = app.business_name || ""

    const searchString = `${fullName} ${email} ${businessName}`.toLowerCase()
    return searchString.includes(searchTerm.toLowerCase())
  })

  // Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    let aValue, bValue

    switch (sortField) {
      case "name":
        aValue = a.full_name || ""
        bValue = b.full_name || ""
        break
      case "business":
        aValue = a.business_name || ""
        bValue = b.business_name || ""
        break
      case "amount":
        aValue = parseAmountToNumber(a.amount_requested)
        bValue = parseAmountToNumber(b.amount_requested)
        break
      case "status":
        aValue = a.status || ""
        bValue = b.status || ""
        break
      case "created_at":
      default:
        aValue = new Date(a.created_at).getTime()
        bValue = new Date(b.created_at).getTime()
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Helper function to parse amount values
  function parseAmountToNumber(amount: string | number): number {
    if (typeof amount === "number") return amount
    if (!amount || amount === "N/A") return 0

    // Handle string formats like "$50,000 - $100,000"
    const matches = amount.match(/\$?([0-9,]+)/)
    if (matches && matches[1]) {
      return Number(matches[1].replace(/,/g, ""))
    }
    return 0
  }

  const getInitials = (name: string) => {
    if (!name || name === "N/A") return "NA"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const formatCurrency = (amount: string | number | undefined) => {
    if (!amount || amount === "N/A") return "$0"

    // If it's already a formatted range like "$50,000 - $100,000", return as is
    if (typeof amount === "string" && amount.includes("-")) {
      return amount
    }

    const num = typeof amount === "string" ? Number.parseFloat(amount.replace(/[^0-9.-]+/g, "")) : amount
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(num)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "in_review":
        return <Badge className="bg-blue-100 text-blue-800">In Review</Badge>
      default:
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <button
                  className="flex items-center text-xs font-medium text-gray-500"
                  onClick={() => handleSort("name")}
                >
                  Client
                  {sortField === "name" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-3 w-3" />
                    ) : (
                      <ChevronDown className="ml-1 h-3 w-3" />
                    ))}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center text-xs font-medium text-gray-500"
                  onClick={() => handleSort("business")}
                >
                  Business
                  {sortField === "business" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-3 w-3" />
                    ) : (
                      <ChevronDown className="ml-1 h-3 w-3" />
                    ))}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center text-xs font-medium text-gray-500"
                  onClick={() => handleSort("amount")}
                >
                  Amount
                  {sortField === "amount" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-3 w-3" />
                    ) : (
                      <ChevronDown className="ml-1 h-3 w-3" />
                    ))}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center text-xs font-medium text-gray-500"
                  onClick={() => handleSort("status")}
                >
                  Status
                  {sortField === "status" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-3 w-3" />
                    ) : (
                      <ChevronDown className="ml-1 h-3 w-3" />
                    ))}
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center text-xs font-medium text-gray-500"
                  onClick={() => handleSort("created_at")}
                >
                  Date
                  {sortField === "created_at" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-3 w-3" />
                    ) : (
                      <ChevronDown className="ml-1 h-3 w-3" />
                    ))}
                </button>
              </TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No clients found.
                </TableCell>
              </TableRow>
            ) : (
              sortedApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-7 w-7 mr-2">
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                          {getInitials(app.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{app.full_name}</div>
                        <div className="text-xs text-gray-500">{app.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{app.business_name}</div>
                    <div className="text-xs text-gray-500">{app.business_type}</div>
                  </TableCell>
                  <TableCell className="text-sm">{formatCurrency(app.amount_requested)}</TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell className="text-xs text-gray-500">{formatDate(app.created_at)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                      <Link href={`/admin/applications/${app.id}`}>
                        <span className="sr-only">View</span>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
