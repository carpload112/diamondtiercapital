"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronDown, ChevronUp, Eye, Plus, Edit, Copy, Check, ExternalLink } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createAffiliate, updateAffiliate } from "@/lib/supabase/affiliate-actions"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Affiliate = {
  id: string
  name: string
  email: string
  referral_code: string
  status: string
  created_at: string
  total_applications?: number
  total_commissions?: number
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

export function AffiliateManagement({ affiliates, tiers }: AffiliateManagementProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    status: "active",
  })
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [baseUrl, setBaseUrl] = useState("https://www.diamondtiercapital.com")

  // Get the base URL for referral links
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      setBaseUrl(`${url.protocol}//${url.host}`)
    }
  }, [])

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filter affiliates based on search term
  const filteredAffiliates = affiliates.filter((affiliate) => {
    const fullName = affiliate.name || ""
    const email = affiliate.email || ""
    const code = affiliate.referral_code || ""

    const searchString = `${fullName} ${email} ${code}`.toLowerCase()
    return searchString.includes(searchTerm.toLowerCase())
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
        aValue = a.total_applications || 0
        bValue = b.total_applications || 0
        break
      case "commissions":
        aValue = a.total_commissions || 0
        bValue = b.total_commissions || 0
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
    })
  }

  const handleAddAffiliate = async () => {
    try {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      const result = await createAffiliate({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Affiliate has been created successfully",
        })
        setIsAddDialogOpen(false)
        resetForm()
        // Refresh the page to show the new affiliate
        window.location.reload()
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
    }
  }

  const handleEditAffiliate = async () => {
    if (!selectedAffiliate) return

    try {
      // Split the name into first and last name for display purposes only
      const nameParts = formData.firstName.split(" ")
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(" ")

      const result = await updateAffiliate(selectedAffiliate.id, {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        status: formData.status,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Affiliate has been updated",
        })
        setIsEditDialogOpen(false)
        // Refresh the page to show the updated affiliate
        window.location.reload()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error updating affiliate:", error)
      toast({
        title: "Error",
        description: "Failed to update affiliate",
        variant: "destructive",
      })
    }
  }

  const handleEditClick = (affiliate: Affiliate) => {
    setSelectedAffiliate(affiliate)

    // Split the name into first and last name for the form
    const nameParts = affiliate.name.split(" ")
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(" ")

    setFormData({
      firstName: firstName,
      lastName: lastName,
      email: affiliate.email,
      phone: "",
      companyName: "",
      status: affiliate.status,
    })
    setIsEditDialogOpen(true)
  }

  const getReferralLink = (code: string) => {
    return `${baseUrl}/applynow?ref=${code}`
  }

  const copyToClipboard = (code: string) => {
    const referralLink = getReferralLink(code)
    navigator.clipboard.writeText(referralLink)
    setCopiedCode(code)

    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    })

    setTimeout(() => setCopiedCode(null), 2000)
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search affiliates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-4 gap-1">
              <Plus className="h-4 w-4" />
              <span>Add Affiliate</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAffiliate}>Create Affiliate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
                  onClick={() => handleSort("created_at")}
                >
                  Joined
                  {sortField === "created_at" &&
                    (sortDirection === "asc" ? (
                      <ChevronUp className="ml-1 h-3 w-3" />
                    ) : (
                      <ChevronDown className="ml-1 h-3 w-3" />
                    ))}
                </button>
              </TableHead>
              <TableHead>Referral Link</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAffiliates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No affiliates found.
                </TableCell>
              </TableRow>
            ) : (
              sortedAffiliates.map((affiliate) => (
                <TableRow key={affiliate.id}>
                  <TableCell>
                    <div className="font-medium text-sm">{affiliate.name}</div>
                  </TableCell>
                  <TableCell className="text-sm">{affiliate.email}</TableCell>
                  <TableCell>{getStatusBadge(affiliate.status)}</TableCell>
                  <TableCell className="text-xs text-gray-500">{formatDate(affiliate.created_at)}</TableCell>
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
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAffiliate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
