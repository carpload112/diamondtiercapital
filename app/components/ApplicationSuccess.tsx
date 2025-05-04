import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

interface ApplicationSuccessProps {
  referenceId: string
}

export default function ApplicationSuccess({ referenceId }: ApplicationSuccessProps) {
  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Application Submitted!</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
        Thank you for your application. Our team will review your information and contact you shortly.
      </p>

      <Card className="max-w-md mx-auto mb-8 bg-gray-50 dark:bg-gray-800/50 border-0">
        <CardContent className="p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Your Application Reference ID</p>
          <p className="text-xl font-mono font-bold">{referenceId}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Please save this reference ID for future inquiries.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" asChild>
          <Link href="/">Return to Home</Link>
        </Button>
        <Button className="gap-2" asChild>
          <Link href="/contact">
            <span>Contact Us</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
