"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, RefreshCw, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

type RetryRecord = {
  id: string
  application_id: string
  referral_code: string
  error_message: string
  created_at: string
  status: "pending" | "completed" | "failed"
  completed_at?: string
  application?: {
    reference_id: string
    status: string
  }
}

export default function AffiliateTrackingRetries() {
  const [retries, setRetries] = useState<RetryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  // Load retry records
  useEffect(() => {
    async function loadRetries() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("affiliate_tracking_retries")
          .select(`
            *,
            application:application_id(reference_id, status)
          `)
          .order("created_at", { ascending: false })

        if (error) throw error

        setRetries(data || [])
      } catch (error) {
        console.error("Error loading retry records:", error)
        toast({
          title: "Error",
          description: "Failed to load tracking retry records",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadRetries()
  }, [supabase, toast])

  // Handle retry
  const handleRetry = async (record: RetryRecord) => {
    try {
      setProcessingId(record.id)

      const response = await fetch("/api/affiliate/retry-tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: record.application_id,
          referralCode: record.referral_code,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Successfully tracked application with affiliate",
          variant: "default",
        })

        // Update the record in the UI
        setRetries((prev) =>
          prev.map((r) =>
            r.id === record.id
              ? {
                  ...r,
                  status: "completed",
                  completed_at: new Date().toISOString(),
                }
              : r,
          ),
        )
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to track application",
          variant: "destructive",
        })

        // Update the record in the UI
        setRetries((prev) =>
          prev.map((r) =>
            r.id === record.id
              ? {
                  ...r,
                  status: "failed",
                  error_message: result.error || "Unknown error",
                }
              : r,
          ),
        )
      }
    } catch (error) {
      console.error("Error retrying tracking:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            <RefreshCw className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Affiliate Tracking Retries</CardTitle>
        <CardDescription>Applications that failed to track with affiliate referral codes</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : retries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No tracking retry records found</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application</TableHead>
                  <TableHead>Referral Code</TableHead>
                  <TableHead>Error</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {retries.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.application?.reference_id || record.application_id.substring(0, 8)}</TableCell>
                    <TableCell>{record.referral_code}</TableCell>
                    <TableCell className="max-w-xs truncate" title={record.error_message}>
                      {record.error_message}
                    </TableCell>
                    <TableCell>{formatDate(record.created_at)}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      {record.status !== "completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRetry(record)}
                          disabled={processingId === record.id}
                        >
                          {processingId === record.id ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Retry
                            </>
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
