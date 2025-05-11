"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AffiliateTestingTool() {
  const [referralCode, setReferralCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const { toast } = useToast()

  const runTest = async () => {
    if (!referralCode) {
      toast({
        title: "Error",
        description: "Please enter a referral code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setResults(null)

    try {
      const response = await fetch("/api/affiliate/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ referralCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to run affiliate tracking test")
      }

      setResults(data)

      if (data.success) {
        toast({
          title: "Test Completed",
          description: "All affiliate tracking tests passed successfully",
        })
      } else {
        toast({
          title: "Test Failed",
          description: data.error || "Some tests failed. Check the results for details.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error running affiliate test:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to run affiliate tracking test",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "running":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Affiliate Tracking Test Tool</CardTitle>
        <CardDescription>
          Test the affiliate tracking system by entering a referral code and running a comprehensive test.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Enter referral code"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              disabled={isLoading}
            />
            <Button onClick={runTest} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                "Run Test"
              )}
            </Button>
          </div>

          {results && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-full ${
                    results.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {results.success ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-medium">{results.success ? "All Tests Passed" : "Test Failed"}</h3>
                  {!results.success && <p className="text-sm text-red-600">{results.error}</p>}
                </div>
              </div>

              <div className="border rounded-md divide-y">
                {results.steps?.map((step: any, index: number) => (
                  <div key={index} className="p-3">
                    <div className="flex items-center gap-2">
                      {getStepIcon(step.status)}
                      <h4 className="font-medium">{step.name}</h4>
                    </div>
                    {step.error && <p className="mt-1 text-sm text-red-600 ml-7">{step.error}</p>}
                    {step.data && (
                      <div className="mt-1 ml-7 text-xs bg-gray-50 p-2 rounded">
                        <pre className="whitespace-pre-wrap">{JSON.stringify(step.data, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        This tool creates temporary test data that is automatically cleaned up after testing.
      </CardFooter>
    </Card>
  )
}
