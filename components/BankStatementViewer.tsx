"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getBankStatements, deleteBankStatement } from "@/lib/supabase/actions"
import { FileText, FileImage, FileSpreadsheet, File, Download, Trash2, ExternalLink, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface BankStatementViewerProps {
  applicationId: string
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
  uploaded_at: string
}

export function BankStatementViewer({ applicationId, isAdmin = false }: BankStatementViewerProps) {
  const [statements, setStatements] = useState<BankStatement[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchBankStatements()
  }, [applicationId])

  const fetchBankStatements = async () => {
    try {
      setLoading(true)
      const result = await getBankStatements(applicationId)

      if (result.success && result.data) {
        setStatements(result.data)
      } else {
        throw new Error(result.error || "Failed to fetch bank statements")
      }
    } catch (error) {
      console.error("Error fetching bank statements:", error)
      toast({
        title: "Error",
        description: "Failed to load bank statements",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (statementId: string) => {
    try {
      setDeleting(statementId)
      const result = await deleteBankStatement(statementId)

      if (result.success) {
        setStatements(statements.filter((statement) => statement.id !== statementId))
        toast({
          title: "Statement Deleted",
          description: "Bank statement has been deleted successfully",
        })
      } else {
        throw new Error(result.error || "Failed to delete bank statement")
      }
    } catch (error) {
      console.error("Error deleting bank statement:", error)
      toast({
        title: "Error",
        description: "Failed to delete bank statement",
        variant: "destructive",
      })
    } finally {
      setDeleting(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) {
      return <FileText className="h-8 w-8 text-red-500" />
    } else if (fileType.includes("image")) {
      return <FileImage className="h-8 w-8 text-blue-500" />
    } else if (fileType.includes("spreadsheet") || fileType.includes("excel")) {
      return <FileSpreadsheet className="h-8 w-8 text-green-500" />
    } else {
      return <File className="h-8 w-8 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-sm text-gray-500">Loading bank statements...</span>
      </div>
    )
  }

  if (statements.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-lg">
        <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Bank Statements</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          {isAdmin
            ? "This application doesn't have any bank statements uploaded yet."
            : "Please upload your last 3 months of bank statements to complete your application."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {statements.map((statement) => (
        <Card key={statement.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="mr-4">{getFileIcon(statement.file_type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{statement.month_year} Statement</h3>
                  <span className="text-xs text-gray-500">
                    Uploaded {formatDistanceToNow(new Date(statement.uploaded_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-1">{statement.file_name}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2">
                  <span className="text-xs text-gray-500">{formatFileSize(statement.file_size)}</span>
                  {statement.notes && <span className="text-xs text-gray-500 italic">Note: {statement.notes}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => window.open(statement.file_url, "_blank")}
                  title="View"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    const link = document.createElement("a")
                    link.href = statement.file_url
                    link.download = statement.file_name
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                  }}
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download</span>
                </Button>
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(statement.id)}
                    disabled={deleting === statement.id}
                    title="Delete"
                  >
                    {deleting === statement.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    <span className="sr-only">Delete</span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
