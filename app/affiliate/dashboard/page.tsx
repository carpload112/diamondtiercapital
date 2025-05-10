import { redirect } from "next/navigation"
import { getAffiliateSession } from "@/lib/supabase/affiliate-auth-actions"
import AffiliateDashboardClient from "@/components/affiliate/AffiliateDashboardClient"

export default async function AffiliateDashboard() {
  const { success, affiliate, error } = await getAffiliateSession()

  if (!success || error) {
    redirect("/affiliate/login")
  }

  return <AffiliateDashboardClient affiliate={affiliate} />
}
