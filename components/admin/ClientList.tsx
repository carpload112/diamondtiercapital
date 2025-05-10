"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronDown, ChevronUp, Eye, Archive, MoreHorizontal, Check, X, Filter, Calendar, TagIcon } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import ApplicationFilters from "./ApplicationFilters"

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
  folder_id?: string
}

type Tag = {
  id: string
  name: string
  color: string
}

type ClientListProps = {
  applications: Application[]
  onArchive?: (id: string) => Promise<void>
  onBulkArchive?: (ids: string[]) => Promise<void>
  showArchived?: boolean
}

export function ClientList({ applications, onArchive, onBulkArchive, showArchived = false }: ClientListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectMode, setSelectMode] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [applicationTags, setApplicationTags] = useState<Record<string, Tag[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  // Fetch application tags on component mount
  useEffect(() => {
    fetchApplicationTags()
  }, [applications])

  const fetchApplicationTags = async () => {
    if (applications.length === 0) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const applicationIds = applications.map((app) => app.id)

      // Get all tag relations for these applications
      const { data: relations, error: relationsError } = await supabase
        .from("application_tag_relations")
        .select("application_id, tag_id")
        .in("application_id", applicationIds)

      if (relationsError) throw relationsError

      // Get all unique tag IDs
      const tagIds = [...new Set(relations?.map((r) => r.tag_id) || [])]

      if (tagIds.length === 0) {
        setApplicationTags({})
        setIsLoading(false)
        return
      }

      // Get tag details
      const { data: tags, error: tagsError } = await supabase.from("application_tags").select("*").in("id", tagIds)

      if (tagsError) throw tagsError

      // Organize tags by application
      const tagsByApplication: Record<string, Tag[]> = {}

      relations?.forEach((relation) => {
        const tag = tags?.find((t) => t.id === relation.tag_id)
        if (tag) {
          if (!tagsByApplication[relation.application_id]) {
            tagsByApplication[relation.application_id] = []
          }
          tagsByApplication[relation.application_id].push(tag)
        }
      })

      setApplicationTags(tagsByApplication)
    } catch (error) {
      console.error("Error fetching application tags:", error)
      toast({
        title: "Error",
        description: "Failed to load application tags",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Reset selection when applications change
  useEffect(() => {
    setSelectedIds([])
    setSelectMode(false)
  }, [applications])

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filter applications based on search term, archived status, active folder, and tags
  const filteredApplications = applications.filter((app) => {
    // Filter by archived status
    if (!showArchived && app.status === "archived") return false
    if (showArchived && app.status !== "archived") return false

    // Filter by selected folder
    if (selectedFolder && app.folder_id !== selectedFolder) return false

    // Filter by selected tags
    if (selectedTags.length > 0) {
      const appTags = applicationTags[app.id] || []
      const appTagIds = appTags.map((tag) => tag.id)
      // Check if the application has ALL selected tags
      if (!selectedTags.every((tagId) => appTagIds.includes(tagId))) {
        return false
      }
    }

    // Filter by search term
    const fullName = app.full_name || ""
    const email = app.email || ""
    const businessName = app.business_name || ""
    const referenceId = app.reference_id || ""

    const searchString = `${fullName} ${email} ${businessName} ${referenceId}`.toLowerCase()
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
        return <Badge className="bg-green-100 text-green-800 border-green-200 px-2.5 py-1 font-medium">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-200 px-2.5 py-1 font-medium">Rejected</Badge>
      case "in_review":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-2.5 py-1 font-medium">In Review</Badge>
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200 px-2.5 py-1 font-medium">Archived</Badge>
      default:
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 px-2.5 py-1 font-medium">Pending</Badge>
    }
  }

  const handleArchive = async (id: string) => {
    if (onArchive) {
      await onArchive(id)
    }
  }

  const handleBulkArchive = async () => {
    if (onBulkArchive && selectedIds.length > 0) {
      await onBulkArchive(selectedIds)
      setSelectedIds([])
      setSelectMode(false)
      toast({
        title: "Applications Archived",
        description: `${selectedIds.length} applications have been moved to archive`,
      })
    }
  }

  const toggleSelectMode = () => {
    setSelectMode(!selectMode)
    setSelectedIds([])
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === sortedApplications.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(sortedApplications.map((app) => app.id))
    }
  }

  const toggleSelectItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const getTagBadges = (applicationId: string) => {
    const appTags = applicationTags[applicationId] || []
    if (appTags.length === 0) return null

    // Show up to 2 tags directly, then a +X more indicator
    const displayTags = appTags.slice(0, 2)
    const remainingCount = appTags.length - displayTags.length

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {displayTags.map((tag) => (
          <Badge
            key={tag.id}
            className="px-1.5 py-0 text-xs"
            style={{
              backgroundColor: `${tag.color}20`,
              color: tag.color,
              borderColor: `${tag.color}40`,
            }}
          >
            {tag.name}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <Badge className="px-1.5 py-0 text-xs bg-gray-100 text-gray-700 border-gray-200">
            +{remainingCount} more
          </Badge>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <ApplicationFilters
          onSearchChange={setSearchTerm}
          onTagsChange={setSelectedTags}
          onFolderChange={setSelectedFolder}
          searchValue={searchTerm}
          selectedTags={selectedTags}
          selectedFolder={selectedFolder}
        />
      </div>

      {/* Actions Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant={selectMode ? "secondary" : "outline"}
              size="sm"
              onClick={toggleSelectMode}
              className="whitespace-nowrap"
            >
              {selectMode ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancel Selection
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Select Multiple
                </>
              )}
            </Button>

            <Button variant="outline" size="sm" className="whitespace-nowrap" onClick={() => {}}>
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>

            {!showArchived ? (
              <Button
                variant="secondary"
                size="sm"
                className="whitespace-nowrap font-medium shadow-sm transition-all hover:shadow hover:translate-y-[-1px] active:translate-y-[0px]"
                onClick={() => (window.location.href = "/admin/applications/archived")}
              >
                <Archive className="h-4 w-4 mr-2" />
                View Archived
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="whitespace-nowrap font-medium shadow-sm transition-all hover:shadow hover:translate-y-[-1px] active:translate-y-[0px]"
                onClick={() => (window.location.href = "/admin/applications")}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Active
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 text-sm font-normal">
                  {sortField === "name"
                    ? "Client Name"
                    : sortField === "business"
                      ? "Business Name"
                      : sortField === "amount"
                        ? "Amount"
                        : sortField === "status"
                          ? "Status"
                          : "Date"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSort("name")}>Client Name</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("business")}>Business Name</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("amount")}>Amount</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("status")}>Status</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("created_at")}>Date</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
              className="h-8 px-2"
            >
              {sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Selection Toolbar - Only visible when items are selected */}
        {selectedIds.length > 0 && (
          <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 mr-2">{selectedIds.length} selected</Badge>
              <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
                Clear selection
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => {}}>
                <TagIcon className="h-4 w-4 mr-2" />
                Manage Tags
              </Button>

              <Button variant="outline" size="sm" onClick={() => {}}>
                <Calendar className="h-4 w-4 mr-2" />
                Move to Folder
              </Button>

              {!showArchived && (
                <Button variant="destructive" size="sm" onClick={handleBulkArchive}>
                  <Archive className="h-4 w-4 mr-2" />
                  Send to Archive
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            {sortedApplications.length} {sortedApplications.length === 1 ? "client" : "clients"} found
            {selectedFolder && " in selected folder"}
            {selectedTags.length > 0 && ` with ${selectedTags.length} selected tags`}
          </div>
          {!selectMode && (
            <div className="hidden sm:block text-xs text-blue-600 italic">
              <Eye className="h-3 w-3 inline mr-1" /> Click on any row to view application details
            </div>
          )}
        </div>
      </div>

      {/* Applications Table */}
      <div className="rounded-md border">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow>
              {selectMode && (
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={selectedIds.length === sortedApplications.length && sortedApplications.length > 0}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              <TableHead className={selectMode ? "w-[210px]" : "w-[250px]"}>
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={selectMode ? 7 : 6} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className="ml-2">Loading applications...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : sortedApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={selectMode ? 7 : 6} className="h-24 text-center">
                  {showArchived ? "No archived applications found." : "No clients found."}
                </TableCell>
              </TableRow>
            ) : (
              sortedApplications.map((app) => (
                <TableRow
                  key={app.id}
                  className={`group ${
                    selectedIds.includes(app.id) ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50"
                  } ${selectMode ? "cursor-default" : "cursor-pointer"}`}
                  onClick={selectMode ? undefined : () => (window.location.href = `/admin/applications/${app.id}`)}
                >
                  {selectMode && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.includes(app.id)}
                        onCheckedChange={() =>
                          toggleSelectItem(app.id, { stopPropagation: () => {} } as React.MouseEvent)
                        }
                        aria-label={`Select ${app.full_name}`}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-7 w-7 mr-2">
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                          {getInitials(app.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm group-hover:text-blue-600">{app.full_name}</div>
                        <div className="text-xs text-gray-500">{app.email}</div>
                        {getTagBadges(app.id)}
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
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-8 px-2 py-0 text-xs" asChild>
                        <Link href={`/admin/applications/${app.id}`}>
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/applications/${app.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault()
                              // Open tag editor dialog
                            }}
                          >
                            <TagIcon className="h-4 w-4 mr-2" />
                            Manage Tags
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault()
                              // Open folder selector dialog
                            }}
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Move to Folder
                          </DropdownMenuItem>

                          {!showArchived ? (
                            <DropdownMenuItem onClick={() => handleArchive(app.id)}>
                              <Archive className="h-4 w-4 mr-2" />
                              Move to Archive
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleArchive(app.id)}>
                              <Archive className="h-4 w-4 mr-2" />
                              Restore from Archive
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
