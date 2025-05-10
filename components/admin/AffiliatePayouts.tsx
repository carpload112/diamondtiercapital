"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { DollarSign, Download, Loader2 } from "lucide-react"

export function AffiliatePayouts() {
  const [pendingCommissions, setPendingCommissions] = useState([
    {
      id: "1",
      affiliate: "John Doe",
      email: "john@example.com",
      amount: 150.0,
      date: "2025-05-10",
      selected: false,
    },
    {
      id: "2",
      affiliate: "Jane Smith",
      email: "jane@example.com",
      amount: 275.5,
      date: "2025-05-08",
      selected: false,
    },
    {
      id: "3",
      affiliate: "Bob Johnson",
      email: "bob@example.com",
      amount: 420.75,
      date: "2025-05-05",
      selected: false,
    },
  ])
  const [processing, setProcessing] = useState(false)
  const { toast } = useToast()

  const handleSelectAll = (checked: boolean) => {
    setPendingCommissions(
      pendingCommissions.map((commission) => ({
        ...commission,
        selected: checked,
      })),
    )
  }

  const handleSelectCommission = (id: string, checked: boolean) => {
    setPendingCommissions(
      pendingCommissions.map((commission) =>
        commission.id === id ? { ...commission, selected: checked } : commission,
      ),
    )
  }

  const handleProcessPayouts = async () => {
    const selectedCommissions = pendingCommissions.filter((commission) => commission.selected)

    if (selectedCommissions.length === 0) {
      toast({
        title: "No commissions selected",
        description: "Please select at least one commission to process",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)

    try {
      // In a real application, this would call the API to process the payouts
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Remove processed commissions from the list
      setPendingCommissions(pendingCommissions.filter((commission) => !commission.selected))

      toast({
        title: "Payouts Processed",
        description: `Successfully processed ${selectedCommissions.length} payouts`,
      })
    } catch (error) {
      console.error("Error processing payouts:", error)
      toast({
        title: "Processing Failed",
        description: "There was an error processing the payouts",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const totalSelected = pendingCommissions.filter((commission) => commission.selected).length
  const totalAmount = pendingCommissions
    .filter((commission) => commission.selected)
    .reduce((sum, commission) => sum + commission.amount, 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pending Affiliate Payouts</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={handleProcessPayouts}
            disabled={totalSelected === 0 || processing}
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <DollarSign className="h-4 w-4" />
                Process Payouts ({totalSelected})
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {pendingCommissions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No pending payouts to process</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          pendingCommissions.length > 0 && pendingCommissions.every((commission) => commission.selected)
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingCommissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell>
                        <Checkbox
                          checked={commission.selected}
                          onCheckedChange={(checked) => handleSelectCommission(commission.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{commission.affiliate}</TableCell>
                      <TableCell>{commission.email}</TableCell>
                      <TableCell>${commission.amount.toFixed(2)}</TableCell>
                      <TableCell>{new Date(commission.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalSelected > 0 && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Selected: {totalSelected} payouts</p>
                    <p className="text-sm text-gray-500">Total: ${totalAmount.toFixed(2)}</p>
                  </div>
                  <Button onClick={handleProcessPayouts} disabled={processing} className="gap-2">
                    {processing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-4 w-4" />
                        Process Selected
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
