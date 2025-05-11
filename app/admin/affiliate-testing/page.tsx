import { AffiliateTestingTool } from "@/components/admin/AffiliateTestingTool"

export default function AffiliateTestingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Affiliate Tracking System Testing</h1>
        <p className="text-gray-500">Use this tool to test and validate the affiliate tracking system functionality.</p>
      </div>

      <AffiliateTestingTool />

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h2 className="text-lg font-medium text-blue-800 mb-2">How to use this tool</h2>
        <ol className="list-decimal list-inside space-y-2 text-blue-700">
          <li>Enter a valid affiliate referral code in the input field</li>
          <li>Click "Run Test" to start the comprehensive test</li>
          <li>
            The tool will perform the following tests:
            <ul className="list-disc list-inside ml-6 mt-1 text-blue-600">
              <li>Verify the referral code exists</li>
              <li>Record a test click</li>
              <li>Create a test application</li>
              <li>Track the application with the affiliate</li>
              <li>Verify the application was associated with the affiliate</li>
              <li>Verify a commission was created</li>
              <li>Verify a notification was created</li>
              <li>Clean up all test data</li>
            </ul>
          </li>
          <li>Review the results to ensure all steps passed successfully</li>
        </ol>
      </div>
    </div>
  )
}
