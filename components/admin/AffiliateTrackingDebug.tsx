"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function AffiliateTrackingDebug() {
  const [applicationId, setApplicationId] = useState("")
  const [referralCode, setReferralCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const { toast } = useToast()

  const handleDebug = async () => {
    if (!applicationId || !referralCode) {
      toast({
        title: "Missing information",
        description: "Please provide both application ID and referral code",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/affiliate/debug-tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId,
          referralCode,
        }),
      })

      const data = await response.json()
      setResults(data)

      if (!data.success) {
        toast({
          title: "Error",
          description: data.error || "Failed to debug tracking",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error debugging tracking:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Affiliate Tracking Debug</CardTitle>
        <CardDescription>Diagnose and fix affiliate tracking issues</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applicationId">Application ID</Label>
              <Input
                id="applicationId"
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                placeholder="Enter application ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="referralCode">Referral Code</Label>
              <Input
                id="referralCode"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="Enter referral code"
              />
            </div>
          </div>
          <Button onClick={handleDebug} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Debugging...
              </>
            ) : (
              "Debug Tracking"
            )}
          </Button>

          {results && (
            <div className="mt-4">
              <Separator className="my-4" />
              <h3 className="text-lg font-medium mb-2">Diagnostic Results</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Application</h4>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(results.diagnostics.application, null, 2)}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-500">Affiliate</h4>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(results.diagnostics.affiliate, null, 2)}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-500">Conversions</h4>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(results.diagnostics.conversions, null, 2)}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-500">Commissions</h4>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(results.diagnostics.commissions, null, 2)}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-500">Tracking Result</h4>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(results.diagnostics.trackingResult, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
