import type { Metadata } from "next"
import AffiliateTrackingRetries from "@/components/admin/AffiliateTrackingRetries"
import DashboardHeader from "@/components/admin/DashboardHeader"
import AdminAuthWrapper from "@/components/admin/AdminAuthWrapper"

export const metadata: Metadata = {
  title: "Affiliate Tracking Management | Diamond Tier Capital",
  description: "Manage affiliate tracking issues and retries",
}

export default function AffiliateTrackingPage() {
  return (
    <AdminAuthWrapper>
      <div className="container mx-auto py-6 space-y-8">
        <DashboardHeader
          title="Affiliate Tracking Management"
          description="Manage and resolve affiliate tracking issues"
        />

        <AffiliateTrackingRetries />
      </div>
    </AdminAuthWrapper>
  )
}
