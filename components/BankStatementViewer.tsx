"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { getBankStatements, deleteBankStatement, getBankStatementWithData } from "@/lib/supabase/actions"
import { FileIcon, Trash2, Eye, Download, AlertCircle, FileCheck } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface BankStatement {
  id: string
  application_id: string
  file_name: string
  file_url: string
  file_type: string
  file_size: number
  month_year: string
  notes?: string
  uploaded_at?: string // Make this optional since it might not exist
  file_data?: string // This will be populated when viewing a specific statement
}

interface BankStatementViewerProps {
  applicationId: string
  isAdmin?: boolean
  readOnly?: boolean
  onDelete?: () => void
}

export function BankStatementViewer({
  applicationId,
  isAdmin = false,
  readOnly = true,
  onDelete,
}: BankStatementViewerProps) {
  const [statements, setStatements] = useState<BankStatement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatement, setSelectedStatement] = useState<BankStatement | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteInProgress, setDeleteInProgress] = useState<string | null>(null)
  const { toast } = useToast()

  // Load statements on component mount
  useEffect(() => {
    loadStatements()
  }, [applicationId])

  // Function to load bank statements
  const loadStatements = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getBankStatements(applicationId)
      if (result.success && result.data) {
        setStatements(result.data)
      } else {
        setError(result.error || "Failed to load bank statements")
        toast({
          title: "Error",
          description: result.error || "Failed to load bank statements",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error loading bank statements:", err)
      setError("An unexpected error occurred")
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading bank statements",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Function to view a bank statement
  const viewStatement = async (statementId: string) => {
    try {
      const result = await getBankStatementWithData(statementId)
      if (result.success && result.data) {
        setSelectedStatement(result.data)
        setViewDialogOpen(true)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load bank statement data",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error viewing bank statement:", err)
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading the bank statement",
        variant: "destructive",
      })
    }
  }

  // Function to delete a bank statement
  const handleDelete = async (statementId: string) => {
    if (readOnly) return

    if (!confirm("Are you sure you want to delete this bank statement? This action cannot be undone.")) {
      return
    }

    setDeleteInProgress(statementId)

    try {
      const result = await deleteBankStatement(statementId)
      if (result.success) {
        setStatements((prev) => prev.filter((statement) => statement.id !== statementId))
        toast({
          title: "Success",
          description: "Bank statement deleted successfully",
        })

        // Call the onDelete callback if provided
        if (onDelete) {
          onDelete()
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete bank statement",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error deleting bank statement:", err)
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the bank statement",
        variant: "destructive",
      })
    } finally {
      setDeleteInProgress(null)
    }
  }

  // Function to download a bank statement
  const downloadStatement = () => {
    if (!selectedStatement || !selectedStatement.file_data) return

    try {
      // Create a link element
      const link = document.createElement("a")
      link.href = selectedStatement.file_data
      link.download = selectedStatement.file_name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("Error downloading bank statement:", err)
      toast({
        title: "Error",
        description: "Failed to download the bank statement",
        variant: "destructive",
      })
    }
  }

  // Function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  // Function to format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A"

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (e) {
      console.error("Error formatting date:", e)
      return "Invalid date"
    }
  }

  // Function to get file icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return "pdf"
    if (fileType.includes("image")) return "image"
    if (fileType.includes("excel") || fileType.includes("spreadsheet")) return "excel"
    return "document"
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 border border-red-200 bg-red-50 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      ) : statements.length === 0 ? (
        <div className="p-4 border border-gray-200 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-500 text-center">No bank statements have been uploaded yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {statements.map((statement) => (
            <div
              key={statement.id}
              className="p-4 border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-md ${
                      getFileIcon(statement.file_type) === "pdf"
                        ? "bg-red-100 text-red-600"
                        : getFileIcon(statement.file_type) === "image"
                          ? "bg-blue-100 text-blue-600"
                          : getFileIcon(statement.file_type) === "excel"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <FileIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{statement.file_name}</h4>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span>{statement.month_year}</span>
                      <span>{formatFileSize(statement.file_size)}</span>
                      {statement.uploaded_at && <span>Uploaded: {formatDate(statement.uploaded_at)}</span>}
                    </div>
                    {statement.notes && <p className="mt-1 text-xs text-gray-500 line-clamp-2">{statement.notes}</p>}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => viewStatement(statement.id)}>
                    <Eye className="h-4 w-4 mr-1" />
                    <span>View</span>
                  </Button>
                  {!readOnly && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(statement.id)}
                      disabled={deleteInProgress === statement.id}
                    >
                      {deleteInProgress === statement.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Statement Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileCheck className="h-5 w-5 mr-2 text-green-500" />
              {selectedStatement?.file_name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
              <span>Month: {selectedStatement?.month_year}</span>
              <span>
                Size: {selectedStatement?.file_size ? formatFileSize(selectedStatement.file_size) : "Unknown"}
              </span>
              {selectedStatement?.uploaded_at && <span>Uploaded: {formatDate(selectedStatement.uploaded_at)}</span>}
            </div>

            {selectedStatement?.notes && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-sm text-gray-700">{selectedStatement.notes}</p>
              </div>
            )}

            <div className="flex justify-end">
              <Button variant="outline" onClick={downloadStatement} className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            {selectedStatement?.file_data && (
              <div className="border border-gray-200 rounded-md overflow-hidden bg-gray-50">
                {selectedStatement.file_type.includes("pdf") ? (
                  <iframe
                    src={selectedStatement.file_data}
                    className="w-full h-[70vh]"
                    title={selectedStatement.file_name}
                  />
                ) : selectedStatement.file_type.includes("image") ? (
                  <div className="flex justify-center p-4">
                    <img
                      src={selectedStatement.file_data || "/placeholder.svg"}
                      alt={selectedStatement.file_name}
                      className="max-h-[70vh] object-contain"
                    />
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <FileIcon className="h-16 w-16 mx-auto text-gray-400" />
                    <p className="mt-4 text-gray-600">
                      Preview not available for this file type. Please download the file to view it.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
