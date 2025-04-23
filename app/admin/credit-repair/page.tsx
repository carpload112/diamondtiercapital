"use client"

import { useEffect, useState } from "react"
import {
  getCreditRepairClients,
  updateCreditRepairClient,
  deleteCreditRepairClient,
  type CreditRepairClient,
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

export default function CreditRepairClientsPage() {
  const [clients, setClients] = useState<CreditRepairClient[]>([])
  const [filteredClients, setFilteredClients] = useState<CreditRepairClient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const [selectedClient, setSelectedClient] = useState<CreditRepairClient | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [editForm, setEditForm] = useState({
    status: "",
    currentScore: 0,
    notes: "",
  })

  const fetchClients = async () => {
    setLoading(true)
    try {
      const data = await getCreditRepairClients()
      setClients(data)
      setFilteredClients(data)
    } catch (error) {
      console.error("Error fetching credit repair clients:", error)
      setError("Failed to load credit repair clients")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  useEffect(() => {
    let result = [...clients]

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      result = result.filter(
        (client) =>
          client.fullName.toLowerCase().includes(lowerSearchTerm) ||
          client.email.toLowerCase().includes(lowerSearchTerm),
      )
    }

    if (statusFilter) {
      result = result.filter((client) => client.status === statusFilter)
    }

    setFilteredClients(result)
  }, [clients, searchTerm, statusFilter])

  const handleViewClient = (client: CreditRepairClient) => {
    setSelectedClient(client)
    setIsViewDialogOpen(true)
  }

  const handleEditClient = (client: CreditRepairClient) => {
    setSelectedClient(client)
    setEditForm({
      status: client.status,
      currentScore: client.currentScore,
      notes: client.notes || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteClient = (client: CreditRepairClient) => {
    setSelectedClient(client)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedClient?.id) return

    try {
      await updateCreditRepairClient(selectedClient.id, {
        status: editForm.status as CreditRepairClient["status"],
        currentScore: editForm.currentScore,
        notes: editForm.notes,
      })

      setClients((prev) =>
        prev.map((client) =>
          client.id === selectedClient.id
            ? {
                ...client,
                status: editForm.status as CreditRepairClient["status"],
                currentScore: editForm.currentScore,
                notes: editForm.notes,
              }
            : client,
        ),
      )

      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating client:", error)
      setError("Failed to update client")
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedClient?.id) return

    try {
      await deleteCreditRepairClient(selectedClient.id)
      setClients((prev) => prev.filter((client) => client.id !== selectedClient.id))
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting client:", error)
      setError("Failed to delete client")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500">New</Badge>
      case "in-progress":
        return <Badge className="bg-yellow-500">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getScoreImprovement = (current: number, desired: number) => {
    const improvement = current - desired
    if (improvement > 0) {
      return <span className="text-green-600">+{improvement}</span>
    }
    return <span className="text-gray-600">Target: {desired}</span>
  }

  if (loading && clients.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Credit Repair Clients</h1>
        <Button onClick={fetchClients} variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="w-full sm:w-48">
          <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value || null)}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Current Score</TableHead>
              <TableHead>Target Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No credit repair clients found
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.fullName}</TableCell>
                  <TableCell>{client.currentScore}</TableCell>
                  <TableCell>{client.desiredScore}</TableCell>
                  <TableCell>{getStatusBadge(client.status)}</TableCell>
                  <TableCell>
                    {client.createdAt instanceof Date ? format(client.createdAt, "MMM d, yyyy") : "Unknown"}
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
                        <DropdownMenuItem onClick={() => handleViewClient(client)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClient(client)}>Update Status</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClient(client)} className="text-red-600">
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

      {/* View Client Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Credit Repair Client Details</DialogTitle>
            <DialogDescription>
              Submitted on{" "}
              {selectedClient?.createdAt instanceof Date ? format(selectedClient.createdAt, "MMMM d, yyyy") : "Unknown"}
            </DialogDescription>
          </DialogHeader>

          {selectedClient && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Client Information</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-sm text-gray-500">Full Name</div>
                    <div>{selectedClient.fullName}</div>

                    <div className="text-sm text-gray-500">Email</div>
                    <div>{selectedClient.email}</div>

                    <div className="text-sm text-gray-500">Phone</div>
                    <div>{selectedClient.phone}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Credit Information</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-sm text-gray-500">Current Score</div>
                    <div>{selectedClient.currentScore}</div>

                    <div className="text-sm text-gray-500">Target Score</div>
                    <div>{selectedClient.desiredScore}</div>

                    <div className="text-sm text-gray-500">Status</div>
                    <div>{getStatusBadge(selectedClient.status)}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Credit Issues</h3>
                  <ul className="list-disc pl-5 mt-2">
                    {selectedClient.issues.map((issue, index) => (
                      <li key={index} className="text-gray-700">
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedClient.notes && (
                  <div>
                    <h3 className="text-lg font-semibold">Notes</h3>
                    <div className="mt-2 text-gray-700 whitespace-pre-wrap">{selectedClient.notes}</div>
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
                if (selectedClient) handleEditClient(selectedClient)
              }}
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Client Status</DialogTitle>
            <DialogDescription>Update the status and credit score for {selectedClient?.fullName}</DialogDescription>
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
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentScore">Current Credit Score</Label>
              <Input
                id="currentScore"
                type="number"
                value={editForm.currentScore}
                onChange={(e) => setEditForm({ ...editForm, currentScore: Number.parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                placeholder="Add notes about this client"
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
              This will permanently delete the credit repair client record for {selectedClient?.fullName}. This action
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
