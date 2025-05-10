import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AffiliateStats } from "@/components/admin/AffiliateStats"
import { AffiliateManagement } from "@/components/admin/AffiliateManagement"
import { MLMSettings } from "@/components/admin/MLMSettings"
import { createServerClient } from "@/lib/supabase/server"
import { getAllAffiliates, getAffiliateTiers, getMLMSettings } from "@/lib/supabase/affiliate-actions"

export default async function AffiliatesPage() {
  const supabase = createServerClient()

  // Get all affiliates
  const { data: affiliates } = await getAllAffiliates()

  // Get affiliate tiers
  const { data: tiers } = await getAffiliateTiers()

  // Get MLM settings
  const { data: mlmSettings } = await getMLMSettings()

  // Calculate overall stats
  const overallStats = {
    totalClicks: 0,
    totalApplications: 0,
    approvedApplications: 0,
    pendingApplications: 0,
    rejectedApplications: 0,
    totalCommissions: 0,
    paidCommissions: 0,
    pendingCommissions: 0,
    conversionRate: 0,
  }

  // Get total clicks
  const { count: totalClicks } = await supabase.from("affiliate_clicks").select("*", { count: "exact", head: true })

  if (totalClicks) {
    overallStats.totalClicks = totalClicks
  }

  // Get application stats
  const { data: applications } = await supabase
    .from("applications")
    .select("id, status, affiliate_id")
    .not("affiliate_id", "is", null)

  if (applications) {
    overallStats.totalApplications = applications.length
    overallStats.approvedApplications = applications.filter((app) => app.status === "approved").length
    overallStats.pendingApplications = applications.filter((app) => app.status === "pending").length
    overallStats.rejectedApplications = applications.filter((app) => app.status === "rejected").length
  }

  // Get commission stats
  const { data: commissions } = await supabase.from("affiliate_commissions").select("amount, status")

  if (commissions) {
    overallStats.totalCommissions = commissions.reduce(
      (sum, commission) => sum + Number.parseFloat(commission.amount),
      0,
    )
    overallStats.paidCommissions = commissions
      .filter((commission) => commission.status === "paid")
      .reduce((sum, commission) => sum + Number.parseFloat(commission.amount), 0)
    overallStats.pendingCommissions = commissions
      .filter((commission) => commission.status === "pending")
      .reduce((sum, commission) => sum + Number.parseFloat(commission.amount), 0)
  }

  // Calculate conversion rate
  if (overallStats.totalClicks > 0) {
    overallStats.conversionRate = (overallStats.totalApplications / overallStats.totalClicks) * 100
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold mb-2">Affiliate Program</h1>
        <p className="text-sm text-gray-500">
          Manage your affiliate partners, track performance, and configure commission settings.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-9">
          <TabsTrigger value="overview" className="text-xs">
            Overview
          </TabsTrigger>
          <TabsTrigger value="affiliates" className="text-xs">
            Affiliates
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Suspense fallback={<div>Loading stats...</div>}>
            <AffiliateStats stats={overallStats} />
          </Suspense>
        </TabsContent>

        <TabsContent value="affiliates" className="mt-4">
          <Suspense fallback={<div>Loading affiliates...</div>}>
            <AffiliateManagement affiliates={affiliates} tiers={tiers} />
          </Suspense>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Suspense fallback={<div>Loading settings...</div>}>
            <MLMSettings mlmSettings={mlmSettings} tiers={tiers} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
