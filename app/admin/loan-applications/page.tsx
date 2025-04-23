"use client"

import { useEffect, useState } from "react"
import {
  getLoanApplications,
  updateLoanApplication,
  deleteLoanApplication,
  type LoanApplication,
} from "@/lib/form-service"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { MoreHorizontal, Search, Filter, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default function LoanApplicationsPage() {
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<LoanApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [editForm, setEditForm] = useState({
    status: "",
    notes: "",
  })

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const data = await getLoanApplications()
      setApplications(data)
      setFilteredApplications(data)
    } catch (error) {
      console.error("Error fetching loan applications:", error)
      setError("Failed to load loan applications")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    let result = [...applications]

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      result = result.filter(
        (app) =>
          app.fullName.toLowerCase().includes(lowerSearchTerm) ||
          app.email.toLowerCase().includes(lowerSearchTerm) ||
          app.businessName.toLowerCase().includes(lowerSearchTerm),
      )
    }

    if (statusFilter) {
      result = result.filter((app) => app.status === statusFilter)
    }

    setFilteredApplications(result)
  }, [applications, searchTerm, statusFilter])

  const handleViewApplication = (application: LoanApplication) => {
    setSelectedApplication(application)
    setIsViewDialogOpen(true)
  }

  const handleEditApplication = (application: LoanApplication) => {
    setSelectedApplication(application)
    setEditForm({
      status: application.status,
      notes: application.notes || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteApplication = (application: LoanApplication) => {
    setSelectedApplication(application)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedApplication?.id) return

    try {
      await updateLoanApplication(selectedApplication.id, {
        status: editForm.status as LoanApplication["status"],
        notes: editForm.notes,
      })

      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApplication.id
            ? { ...app, status: editForm.status as LoanApplication["status"], notes: editForm.notes }
            : app,
        ),
      )

      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating application:", error)
      setError("Failed to update application")
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedApplication?.id) return

    try {
      await deleteLoanApplication(selectedApplication.id)
      setApplications((prev) => prev.filter((app) => app.id !== selectedApplication.id))
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting application:", error)
      setError("Failed to delete application")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500">New</Badge>
      case "in-review":
        return <Badge className="bg-yellow-500">In Review</Badge>
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading && applications.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Loan Applications</h1>
        <Button onClick={fetchApplications} variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by name, email, or business..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="w-full sm:w-48">
          <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Loan Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No loan applications found
                </TableCell>
              </TableRow>
            ) : (
              filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.businessName}</TableCell>
                  <TableCell>{application.fullName}</TableCell>
                  <TableCell>${application.loanAmount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell>
                    {application.createdAt instanceof Date ? format(application.createdAt, "MMM d, yyyy") : "Unknown"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewApplication(application)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditApplication(application)}>
                          Update Status
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteApplication(application)} className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Application Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Loan Application Details</DialogTitle>
            <DialogDescription>
              Submitted on{" "}
              {selectedApplication?.createdAt instanceof Date
                ? format(selectedApplication.createdAt, "MMMM d, yyyy")
                : "Unknown"}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Applicant Information</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-sm text-gray-500">Full Name</div>
                    <div>{selectedApplication.fullName}</div>

                    <div className="text-sm text-gray-500">Email</div>
                    <div>{selectedApplication.email}</div>

                    <div className="text-sm text-gray-500">Phone</div>
                    <div>{selectedApplication.phone}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Business Information</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-sm text-gray-500">Business Name</div>
                    <div>{selectedApplication.businessName}</div>

                    <div className="text-sm text-gray-500">Business Type</div>
                    <div>{selectedApplication.businessType}</div>

                    <div className="text-sm text-gray-500">Years in Business</div>
                    <div>{selectedApplication.yearsInBusiness}</div>

                    <div className="text-sm text-gray-500">Annual Revenue</div>
                    <div>${selectedApplication.annualRevenue.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Loan Information</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-sm text-gray-500">Loan Amount</div>
                    <div>${selectedApplication.loanAmount.toLocaleString()}</div>

                    <div className="text-sm text-gray-500">Loan Purpose</div>
                    <div>{selectedApplication.loanPurpose}</div>

                    <div className="text-sm text-gray-500">Collateral</div>
                    <div>{selectedApplication.collateral}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Financial Information</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-sm text-gray-500">Credit Score</div>
                    <div>{selectedApplication.creditScore}</div>

                    <div className="text-sm text-gray-500">Bankruptcy</div>
                    <div>{selectedApplication.bankruptcy}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Status</h3>
                  <div className="mt-2">{getStatusBadge(selectedApplication.status)}</div>
                </div>

                {selectedApplication.notes && (
                  <div>
                    <h3 className="text-lg font-semibold">Notes</h3>
                    <div className="mt-2 text-gray-700 whitespace-pre-wrap">{selectedApplication.notes}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button
              onClick={() => {
                setIsViewDialogOpen(false)
                if (selectedApplication) handleEditApplication(selectedApplication)
              }}
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Application Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
            <DialogDescription>
              Update the status and add notes for {selectedApplication?.businessName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={editForm.status} onValueChange={(value) => setEditForm({ ...editForm, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                placeholder="Add notes about this application"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the loan application for {selectedApplication?.businessName}. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
