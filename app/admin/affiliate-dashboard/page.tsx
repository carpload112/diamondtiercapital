import { createServerClient } from "@/lib/supabase/server"
import { AffiliateDashboard } from "@/components/admin/AffiliateDashboard"
import { DashboardHeader } from "@/components/admin/DashboardHeader"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Affiliate Dashboard | Diamond Tier Capital",
  description: "Comprehensive performance metrics for your affiliate program",
}

export default async function AffiliateDashboardPage() {
  const supabase = createServerClient()

  // Get affiliate performance metrics
  const { data: affiliateMetrics } = await supabase.rpc("get_all_affiliate_stats")

  // Get conversion metrics over time
  const { data: conversionTrends } = await supabase.rpc("get_affiliate_conversion_trends")

  // Get top performing affiliates
  const { data: topAffiliates } = await supabase
    .from("affiliates")
    .select(`
      id, 
      name, 
      email, 
      referral_code, 
      status, 
      created_at,
      tier
    `)
    .order("created_at", { ascending: false })
    .limit(10)

  // Get affiliate tiers
  const { data: tiers } = await supabase
    .from("affiliate_tiers")
    .select("*")
    .order("commission_rate", { ascending: false })

  // Get recent commissions
  const { data: recentCommissions } = await supabase
    .from("affiliate_commissions")
    .select(`
      id,
      affiliate_id,
      application_id,
      amount,
      status,
      created_at,
      affiliates (
        name,
        email,
        referral_code
      )
    `)
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Affiliate Performance Dashboard"
        description="Comprehensive metrics and insights for your affiliate program"
      />

      <AffiliateDashboard
        affiliateMetrics={affiliateMetrics || []}
        conversionTrends={conversionTrends || []}
        topAffiliates={topAffiliates || []}
        tiers={tiers || []}
        recentCommissions={recentCommissions || []}
      />
    </div>
  )
}
