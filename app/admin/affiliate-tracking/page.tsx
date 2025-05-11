import type { Metadata } from "next"
import AffiliateTrackingRetries from "@/components/admin/AffiliateTrackingRetries"
import DashboardHeader from "@/components/admin/DashboardHeader"
import { checkAdminAuth } from "@/lib/admin-auth"

export const metadata: Metadata = {
  title: "Affiliate Tracking Management | Diamond Tier Capital",
  description: "Manage affiliate tracking issues and retries",
}

export default async function AffiliateTrackingPage() {
  // Check admin authentication
  await checkAdminAuth()

  return (
    <div className="container mx-auto py-6 space-y-8">
      <DashboardHeader
        title="Affiliate Tracking Management"
        description="Manage and resolve affiliate tracking issues"
      />

      <AffiliateTrackingRetries />
    </div>
  )
}
