"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  ChevronDown,
  ChevronUp,
  Eye,
  Plus,
  Edit,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  createAffiliate,
  updateAffiliate,
  getAllAffiliates,
  getAffiliateStats,
  deleteAffiliate,
} from "@/lib/supabase/affiliate-actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils/affiliate-utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Affiliate = {
  id: string
  name: string
  email: string
  referral_code: string
  status: string
  created_at: string
  tier?: string
  total_applications?: number
  total_commissions?: number
  stats?: AffiliateStats
}

type AffiliateStats = {
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

type AffiliateTier = {
  name: string
  description: string
  commission_rate: number
}

interface AffiliateManagementProps {
  affiliates: Affiliate[]
  tiers: AffiliateTier[]
}

export function AffiliateManagement({ affiliates: initialAffiliates, tiers }: AffiliateManagementProps) {
  const { toast } = useToast()
  const [affiliates, setAffiliates] = useState<Affiliate[]>(initialAffiliates || [])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [baseUrl, setBaseUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    status: "active",
    tier: "bronze",
  })

  // Get the base URL for referral links
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      setBaseUrl(`${url.protocol}//${url.host}`)
    }
  }, [])

  // Fetch affiliates
  const fetchAffiliates = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await getAllAffiliates()
      if (data) {
        // Fetch stats for each affiliate
        const affiliatesWithStats = await Promise.all(
          data.map(async (affiliate) => {
            const { data: stats } = await getAffiliateStats(affiliate.id)
            return {
              ...affiliate,
              stats,
            }
          }),
        )
        setAffiliates(affiliatesWithStats)
      }
    } catch (error) {
      console.error("Error fetching affiliates:", error)
      toast({
        title: "Error",
        description: "Failed to fetch affiliates",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Initial fetch
  useEffect(() => {
    if (initialAffiliates.length === 0) {
      fetchAffiliates()
    }
  }, [fetchAffiliates, initialAffiliates])

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filter affiliates based on search term and active tab
  const filteredAffiliates = affiliates.filter((affiliate) => {
    // Filter by search term
    const fullName = affiliate.name || ""
    const email = affiliate.email || ""
    const code = affiliate.referral_code || ""
    const searchString = `${fullName} ${email} ${code}`.toLowerCase()
    const matchesSearch = searchString.includes(searchTerm.toLowerCase())

    // Filter by tab
    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && affiliate.status === "active"
    if (activeTab === "inactive") return matchesSearch && affiliate.status === "inactive"
    if (activeTab === "pending") return matchesSearch && affiliate.status === "pending"

    return matchesSearch
  })

  // Sort affiliates
  const sortedAffiliates = [...filteredAffiliates].sort((a, b) => {
    let aValue, bValue

    switch (sortField) {
      case "name":
        aValue = a.name || ""
        bValue = b.name || ""
        break
      case "email":
        aValue = a.email || ""
        bValue = b.email || ""
        break
      case "status":
        aValue = a.status || ""
        bValue = b.status || ""
        break
      case "applications":
        aValue = a.stats?.totalApplications || 0
        bValue = b.stats?.totalApplications || 0
        break
      case "commissions":
        aValue = a.stats?.totalCommissions || 0
        bValue = b.stats?.totalCommissions || 0
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

  const handleEditClick = (affiliate: Affiliate) => {
    setSelectedAffiliate(affiliate)

    // Split the name into first and last name for the form
    const nameParts = affiliate.name.split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    setFormData({
      firstName,
      lastName,
      email: affiliate.email,
      phone: "",
      companyName: "",
      status: affiliate.status,
      tier: affiliate.tier || "bronze",
    })

    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (affiliate: Affiliate) => {
    setSelectedAffiliate(affiliate)
    setIsDeleteDialogOpen(true)
  }

  const getReferralLink = (code: string) => {
    return `${baseUrl}/applynow?ref=${code}`
  }

  const copyToClipboard = (code: string) => {
    try {
      const referralLink = getReferralLink(code)
      navigator.clipboard.writeText(referralLink)
      setCopiedCode(code)

      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      })

      setTimeout(() => setCopiedCode(null), 2000)
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      toast({
        title: "Error",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openReferralLink = (code: string) => {
    const referralLink = getReferralLink(code)
    window.open(referralLink, "_blank")
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
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>
      default:
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      companyName: "",
      status: "active",
      tier: "bronze",
    })
  }

  const handleAddAffiliate = async () => {
    try {
      setIsSubmitting(true)

      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const result = await createAffiliate({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName,
        tier: formData.tier,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Affiliate has been created successfully",
        })
        setIsAddDialogOpen(false)
        resetForm()
        // Refresh affiliates list
        fetchAffiliates()
      } else {
        throw new Error(result.error || "Failed to create affiliate")
      }
    } catch (error) {
      console.error("Error adding affiliate:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create affiliate",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditAffiliate = async () => {
    if (!selectedAffiliate) return

    try {
      setIsSubmitting(true)

      const result = await updateAffiliate(selectedAffiliate.id, {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        status: formData.status,
        tier: formData.tier,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Affiliate has been updated successfully",
        })
        setIsEditDialogOpen(false)
        // Refresh affiliates list
        fetchAffiliates()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error updating affiliate:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update affiliate",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAffiliate = async () => {
    if (!selectedAffiliate) return

    try {
      setIsSubmitting(true)

      const result = await deleteAffiliate(selectedAffiliate.id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Affiliate has been deleted successfully",
        })
        setIsDeleteDialogOpen(false)
        // Refresh affiliates list
        fetchAffiliates()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error deleting affiliate:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete affiliate",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search affiliates by name, email or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                <span>Add Affiliate</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Affiliate</DialogTitle>
                <DialogDescription>Create a new affiliate partner for your program.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(123) 456-7890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name (Optional)</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Acme Inc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tier">Tier</Label>
                  <Select value={formData.tier} onValueChange={(value) => handleSelectChange("tier", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiers.map((tier) => (
                        <SelectItem key={tier.name} value={tier.name.toLowerCase()}>
                          {tier.name} ({tier.commission_rate}% commission)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAffiliate} disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Affiliate"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={fetchAffiliates} disabled={isLoading}>
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Affiliates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Affiliate Partners</CardTitle>
          <CardDescription>Manage your affiliate partners and track their performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    <button
                      className="flex items-center text-xs font-medium text-gray-500"
                      onClick={() => handleSort("name")}
                    >
                      Affiliate
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
                      onClick={() => handleSort("email")}
                    >
                      Email
                      {sortField === "email" &&
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
                      onClick={() => handleSort("applications")}
                    >
                      Applications
                      {sortField === "applications" &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-3 w-3" />
                        ) : (
                          <ChevronDown className="ml-1 h-3 w-3" />
                        ))}
                    </button>
                  </TableHead>
                  <TableHead>Referral Link</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 text-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span className="ml-2">Loading affiliates...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : sortedAffiliates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {searchTerm ? (
                        <div className="flex flex-col items-center justify-center">
                          <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                          <p>No matching affiliates found.</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <Plus className="h-8 w-8 text-gray-400 mb-2" />
                          <p>No affiliates found. Add your first affiliate!</p>
                          <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                            Add Affiliate
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedAffiliates.map((affiliate) => (
                    <TableRow key={affiliate.id}>
                      <TableCell>
                        <div className="font-medium text-sm">{affiliate.name}</div>
                        <div className="text-xs text-gray-500">Joined {formatDate(affiliate.created_at)}</div>
                      </TableCell>
                      <TableCell className="text-sm">{affiliate.email}</TableCell>
                      <TableCell>{getStatusBadge(affiliate.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{affiliate.stats?.totalApplications || 0}</div>
                        {affiliate.stats?.totalApplications > 0 && (
                          <div className="text-xs text-gray-500">
                            {formatCurrency(affiliate.stats?.totalCommissions || 0)} earned
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-2">
                                  <Input
                                    readOnly
                                    value={getReferralLink(affiliate.referral_code)}
                                    className="h-8 text-xs font-mono bg-gray-50"
                                    onClick={() => copyToClipboard(affiliate.referral_code)}
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Click to copy referral link</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => copyToClipboard(affiliate.referral_code)}
                            >
                              {copiedCode === affiliate.referral_code ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => openReferralLink(affiliate.referral_code)}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleEditClick(affiliate)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" asChild className="h-7 w-7 p-0">
                            <Link href={`/admin/affiliates/${affiliate.id}`}>
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteClick(affiliate)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            Showing {sortedAffiliates.length} of {affiliates.length} affiliates
          </div>
        </CardFooter>
      </Card>

      {/* Edit Affiliate Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Affiliate</DialogTitle>
            <DialogDescription>Update affiliate information and settings.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier">Tier</Label>
              <Select value={formData.tier} onValueChange={(value) => handleSelectChange("tier", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  {tiers.map((tier) => (
                    <SelectItem key={tier.name} value={tier.name.toLowerCase()}>
                      {tier.name} ({tier.commission_rate}% commission)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAffiliate} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Affiliate Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the affiliate {selectedAffiliate?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAffiliate}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
