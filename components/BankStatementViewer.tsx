"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getBankStatements, getBankStatementWithData, deleteBankStatement } from "@/lib/supabase/actions"
import { useToast } from "@/hooks/use-toast"
import { FileIcon, Trash2, Download, FileText, Eye, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface BankStatementViewerProps {
  applicationId: string
  onDelete?: () => void
  readOnly?: boolean
  isAdmin?: boolean
}

interface BankStatement {
  id: string
  application_id: string
  file_name: string
  file_url: string
  file_type: string
  file_size: number
  month_year: string
  notes: string | null
  created_at: string
  file_data?: string // Base64 data
}

export function BankStatementViewer({
  applicationId,
  onDelete,
  readOnly = false,
  isAdmin = false,
}: BankStatementViewerProps) {
  const [statements, setStatements] = useState<BankStatement[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selectedStatement, setSelectedStatement] = useState<BankStatement | null>(null)
  const [loadingStatement, setLoadingStatement] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (applicationId) {
      loadStatements()
    }
  }, [applicationId])

  const loadStatements = async () => {
    setLoading(true)
    try {
      const { success, data, error } = await getBankStatements(applicationId)
      if (success && data) {
        setStatements(data)
      } else {
        console.error("Error loading bank statements:", error)
        toast({
          title: "Error loading bank statements",
          description: error || "Failed to load bank statements",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error in loadStatements:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (statementId: string) => {
    if (confirm("Are you sure you want to delete this bank statement?")) {
      setDeleting(statementId)
      try {
        const { success, error } = await deleteBankStatement(statementId)
        if (success) {
          setStatements((prev) => prev.filter((s) => s.id !== statementId))
          toast({
            title: "Bank statement deleted",
            description: "The bank statement has been deleted successfully",
          })
          if (onDelete) {
            onDelete()
          }
        } else {
          toast({
            title: "Error deleting bank statement",
            description: error || "Failed to delete bank statement",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error in handleDelete:", error)
      } finally {
        setDeleting(null)
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const viewStatement = async (statement: BankStatement) => {
    // If we already have the file data, just show it
    if (statement.file_data) {
      setSelectedStatement(statement)
      return
    }

    // Otherwise, we need to fetch the file data
    setLoadingStatement(statement.id)
    try {
      const { success, data, error } = await getBankStatementWithData(statement.id)

      if (success && data) {
        // Check if this is a placeholder for a very large file
        if (data.file_data && data.file_data.includes("placeholder=true")) {
          toast({
            title: "Very large file",
            description: "This file is too large to preview. Please download it instead.",
            variant: "warning",
          })
          setLoadingStatement(null)
          return
        }

        setSelectedStatement(data)
      } else {
        toast({
          title: "Error loading file",
          description: error || "Failed to load file data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading statement data:", error)
      toast({
        title: "Error",
        description: "Failed to load file data",
        variant: "destructive",
      })
    } finally {
      setLoadingStatement(null)
    }
  }

  const downloadStatement = async (statement: BankStatement) => {
    // If we already have the file data, use it
    if (statement.file_data) {
      // Check if this is a placeholder
      if (statement.file_data.includes("placeholder=true")) {
        toast({
          title: "Cannot download file directly",
          description: "This file is too large for direct download. Please contact support.",
          variant: "warning",
        })
        return
      }

      // Create a download link for the base64 data
      const link = document.createElement("a")
      link.href = statement.file_data
      link.download = statement.file_name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return
    }

    // Otherwise, we need to fetch the file data first
    setLoadingStatement(statement.id)
    try {
      const { success, data, error } = await getBankStatementWithData(statement.id)

      if (success && data && data.file_data) {
        // Check if this is a placeholder
        if (data.file_data.includes("placeholder=true")) {
          toast({
            title: "Cannot download file directly",
            description: "This file is too large for direct download. Please contact support.",
            variant: "warning",
          })
          setLoadingStatement(null)
          return
        }

        // Create a download link
        const link = document.createElement("a")
        link.href = data.file_data
        link.download = data.file_name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        toast({
          title: "Error downloading file",
          description: error || "Failed to download file",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error downloading statement:", error)
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      })
    } finally {
      setLoadingStatement(null)
    }
  }

  const isVeryLargeFile = (statement: BankStatement) => {
    return statement.file_size > 50 * 1024 * 1024
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <FileIcon className="h-5 w-5 mr-2 text-blue-500" />
          Bank Statements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
          </div>
        ) : statements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No bank statements have been uploaded yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {statements.map((statement) => (
              <div
                key={statement.id}
                className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileIcon className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium">{statement.file_name}</p>
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span>{statement.month_year}</span>
                      <span className="flex items-center">
                        {formatFileSize(statement.file_size)}
                        {isVeryLargeFile(statement) && (
                          <AlertTriangle className="h-3 w-3 text-amber-500 ml-1" title="Very large file" />
                        )}
                      </span>
                      <span>{formatDate(statement.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!isVeryLargeFile(statement) && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                          onClick={() => viewStatement(statement)}
                          disabled={loadingStatement === statement.id}
                        >
                          {loadingStatement === statement.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-1"></div>
                          ) : (
                            <Eye className="h-4 w-4 mr-1" />
                          )}
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>{selectedStatement?.file_name}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 max-h-[70vh] overflow-auto">
                          {selectedStatement?.file_type.startsWith("image/") ? (
                            <img
                              src={selectedStatement.file_data || "/placeholder.svg"}
                              alt={selectedStatement.file_name}
                              className="max-w-full h-auto"
                            />
                          ) : selectedStatement?.file_type === "application/pdf" ? (
                            <iframe
                              src={selectedStatement.file_data}
                              title={selectedStatement.file_name}
                              className="w-full h-[70vh]"
                            />
                          ) : (
                            <div className="p-4 bg-gray-100 rounded-md text-center">
                              <FileText className="h-16 w-16 mx-auto mb-2 text-gray-400" />
                              <p>
                                This file type ({selectedStatement?.file_type}) cannot be previewed. Please download the
                                file to view it.
                              </p>
                              <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => downloadStatement(selectedStatement!)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download File
                              </Button>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={() => downloadStatement(statement)}
                    disabled={loadingStatement === statement.id}
                  >
                    {loadingStatement === statement.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-1"></div>
                    ) : (
                      <Download className="h-4 w-4 mr-1" />
                    )}
                    Download
                  </Button>
                  {!readOnly && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(statement.id)}
                      disabled={deleting === statement.id}
                    >
                      {deleting === statement.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-1"></div>
                      ) : (
                        <Trash2 className="h-4 w-4 mr-1" />
                      )}
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
