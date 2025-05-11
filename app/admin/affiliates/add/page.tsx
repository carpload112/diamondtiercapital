import { DashboardHeader } from "@/components/admin/DashboardHeader"
import { AffiliateForm } from "@/components/admin/AffiliateForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AddAffiliatePage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Add New Affiliate"
        description="Create a new affiliate partner for your program"
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/affiliates">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Affiliates
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Affiliate Information</CardTitle>
          <CardDescription>
            Enter the details of your new affiliate partner. They will receive a unique referral code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AffiliateForm
            mode="create"
            onSuccess={() => {
              window.location.href = "/admin/affiliates"
            }}
            onCancel={() => {
              window.location.href = "/admin/affiliates"
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
