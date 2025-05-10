"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { FileText, Download, Trash2, RefreshCw, ExternalLink, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BankStatement {
  id: string
  file_name: string
  file_url: string
  file_type: string
  file_size: number
  month_year: string
  uploaded_at: string
  notes: string | null
}

interface BankStatementViewerProps {
  applicationId: string
  isAdmin?: boolean
  refreshTrigger?: number
}

export function BankStatementViewer({ applicationId, isAdmin = false, refreshTrigger = 0 }: BankStatementViewerProps) {
  const [statements, setStatements] = useState<BankStatement[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [statementToDelete, setStatementToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchBankStatements()
  }, [applicationId, refreshTrigger])

  const fetchBankStatements = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("bank_statements")
        .select("*")
        .eq("application_id", applicationId)
        .order("month_year", { ascending: false })

      if (error) throw error

      setStatements(data || [])
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

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true)
      const { error } = await supabase.from("bank_statements").delete().eq("id", id)

      if (error) throw error

      setStatements((prev) => prev.filter((statement) => statement.id !== id))
      toast({
        title: "Statement deleted",
        description: "Bank statement has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting bank statement:", error)
      toast({
        title: "Error",
        description: "Failed to delete bank statement",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setStatementToDelete(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return "📄"
    if (fileType.includes("image")) return "🖼️"
    if (fileType.includes("excel") || fileType.includes("spreadsheet")) return "📊"
    return "📁"
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-500" />
            Bank Statements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-sm text-gray-500">Loading bank statements...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-500" />
            Bank Statements
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={fetchBankStatements} title="Refresh">
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {statements.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-md">
            <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-1">No bank statements uploaded yet</p>
            {!isAdmin && (
              <p className="text-xs text-gray-400">Please upload your last 3 months of business bank statements</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {statements.map((statement) => (
              <div
                key={statement.id}
                className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-3">{getFileIcon(statement.file_type)}</div>
                  <div>
                    <div className="font-medium text-sm">{statement.month_year}</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <span className="truncate max-w-[150px] sm:max-w-[250px]">{statement.file_name}</span>
                      <span className="mx-1">•</span>
                      <span>{formatFileSize(statement.file_size)}</span>
                    </div>
                    {statement.notes && (
                      <div className="text-xs text-gray-500 italic mt-1 truncate max-w-[200px] sm:max-w-[300px]">
                        Note: {statement.notes}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                    <a href={statement.file_url} target="_blank" rel="noopener noreferrer" title="View">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                    <a href={statement.file_url} download={statement.file_name} title="Download">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </a>
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setStatementToDelete(statement.id)
                        setDeleteDialogOpen(true)
                      }}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Bank Statement</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this bank statement? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => statementToDelete && handleDelete(statementToDelete)}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
