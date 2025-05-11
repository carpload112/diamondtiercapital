import type { Metadata } from "next"
import { createServerClient } from "@/lib/supabase/server"
import { AffiliateManagement } from "@/components/admin/AffiliateManagement"
import { MLMSettings } from "@/components/admin/MLMSettings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/admin/DashboardHeader"

export const metadata: Metadata = {
  title: "Affiliate Management | Diamond Tier Capital",
  description: "Manage your affiliate partners and commission structure",
}

export default async function AffiliatesPage() {
  const supabase = createServerClient()

  // Get all affiliates with their stats
  const { data: affiliates } = await supabase
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

  // Get affiliate tiers
  const { data: tiers } = await supabase.from("affiliate_tiers").select("*").order("min_referrals", { ascending: true })

  // Get MLM settings
  const { data: mlmSettings } = await supabase.from("mlm_settings").select("*").order("level", { ascending: true })

  // Get affiliate stats
  const { data: affiliateStats } = await supabase.rpc("get_all_affiliate_stats")

  // Merge affiliate stats with affiliates
  const affiliatesWithStats = affiliates?.map((affiliate) => {
    const stats = affiliateStats?.find((stat) => stat.affiliate_id === affiliate.id)
    return {
      ...affiliate,
      total_applications: stats?.total_applications || 0,
      total_commissions: stats?.total_commissions || 0,
    }
  })

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Affiliate Management"
        description="Manage your affiliate partners and commission structure"
      />

      <Tabs defaultValue="affiliates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="affiliates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Partners</CardTitle>
              <CardDescription>
                View and manage your affiliate partners. Track their performance and commissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AffiliateManagement affiliates={affiliatesWithStats || []} tiers={tiers || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <MLMSettings mlmSettings={mlmSettings || []} tiers={tiers || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
