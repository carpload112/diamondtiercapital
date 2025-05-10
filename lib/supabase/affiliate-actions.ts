"use server"

import { createServerClient } from "./server"
import { generateReferralCode } from "../utils/affiliate-utils"

export interface AffiliateData {
  name: string
  email: string
  phone?: string
  company?: string
  tier?: string
  paymentMethod?: string
  paymentDetails?: any
  notes?: string
}

export interface CommissionData {
  affiliateId: string
  applicationId: string
  amount: number
  rate: number
  status?: string
}

export async function createAffiliate(data: AffiliateData) {
  const supabase = createServerClient()

  try {
    // Generate a unique referral code
    const referralCode = await generateReferralCode(data.name)

    // Insert into affiliates table
    const { data: affiliate, error } = await supabase
      .from("affiliates")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        tier: data.tier || "bronze",
        referral_code: referralCode,
        payment_method: data.paymentMethod || null,
        payment_details: data.paymentDetails || null,
        notes: data.notes || null,
      })
      .select()
      .single()

    if (error) throw error

    return { success: true, data: affiliate }
  } catch (error) {
    console.error("Error creating affiliate:", error)
    return { success: false, error: "Failed to create affiliate" }
  }
}

export async function getAffiliates() {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.from("affiliates").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching affiliates:", error)
    return { success: false, error: "Failed to fetch affiliates" }
  }
}

export async function getAffiliateByReferralCode(code: string) {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.from("affiliates").select("*").eq("referral_code", code).single()

    if (error) {
      if (error.code === "PGRST116") {
        return { success: false, error: "Affiliate not found" }
      }
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching affiliate:", error)
    return { success: false, error: "Failed to fetch affiliate" }
  }
}

export async function updateAffiliate(id: string, data: Partial<AffiliateData>) {
  const supabase = createServerClient()

  try {
    const { data: affiliate, error } = await supabase
      .from("affiliates")
      .update({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        tier: data.tier,
        payment_method: data.paymentMethod,
        payment_details: data.paymentDetails,
        notes: data.notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return { success: true, data: affiliate }
  } catch (error) {
    console.error("Error updating affiliate:", error)
    return { success: false, error: "Failed to update affiliate" }
  }
}

export async function createCommission(data: CommissionData) {
  const supabase = createServerClient()

  try {
    const { data: commission, error } = await supabase
      .from("affiliate_commissions")
      .insert({
        affiliate_id: data.affiliateId,
        application_id: data.applicationId,
        amount: data.amount,
        rate: data.rate,
        status: data.status || "pending",
      })
      .select()
      .single()

    if (error) throw error

    return { success: true, data: commission }
  } catch (error) {
    console.error("Error creating commission:", error)
    return { success: false, error: "Failed to create commission" }
  }
}

export async function getAffiliateCommissions(affiliateId: string) {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase
      .from("affiliate_commissions")
      .select(`
        *,
        applications (
          id,
          reference_id,
          status,
          created_at
        )
      `)
      .eq("affiliate_id", affiliateId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching commissions:", error)
    return { success: false, error: "Failed to fetch commissions" }
  }
}

export async function getAffiliateStats(affiliateId: string) {
  const supabase = createServerClient()

  try {
    // Get total clicks
    const { count: totalClicks, error: clicksError } = await supabase
      .from("affiliate_clicks")
      .select("*", { count: "exact", head: true })
      .eq("affiliate_id", affiliateId)

    if (clicksError) throw clicksError

    // Get total applications
    const { data: applications, error: applicationsError } = await supabase
      .from("applications")
      .select("id, status")
      .eq("affiliate_id", affiliateId)

    if (applicationsError) throw applicationsError

    // Get total commissions
    const { data: commissions, error: commissionsError } = await supabase
      .from("affiliate_commissions")
      .select("amount, status")
      .eq("affiliate_id", affiliateId)

    if (commissionsError) throw commissionsError

    // Calculate statistics
    const totalApplications = applications.length
    const approvedApplications = applications.filter((app) => app.status === "approved").length
    const pendingApplications = applications.filter((app) => app.status === "pending").length

    const totalCommissions = commissions.reduce((sum, commission) => sum + Number.parseFloat(commission.amount), 0)
    const paidCommissions = commissions
      .filter((commission) => commission.status === "paid")
      .reduce((sum, commission) => sum + Number.parseFloat(commission.amount), 0)
    const pendingCommissions = commissions
      .filter((commission) => commission.status === "pending")
      .reduce((sum, commission) => sum + Number.parseFloat(commission.amount), 0)

    const conversionRate = totalClicks > 0 ? (totalApplications / totalClicks) * 100 : 0

    return {
      success: true,
      data: {
        totalClicks: totalClicks || 0,
        totalApplications,
        approvedApplications,
        pendingApplications,
        totalCommissions,
        paidCommissions,
        pendingCommissions,
        conversionRate,
      },
    }
  } catch (error) {
    console.error("Error fetching affiliate stats:", error)
    return { success: false, error: "Failed to fetch affiliate statistics" }
  }
}

export async function recordAffiliateClick(
  referralCode: string,
  ipAddress: string,
  userAgent: string,
  referrerUrl: string,
) {
  const supabase = createServerClient()

  try {
    // Get affiliate ID from referral code
    const { data: affiliate, error: affiliateError } = await supabase
      .from("affiliates")
      .select("id")
      .eq("referral_code", referralCode)
      .single()

    if (affiliateError) throw affiliateError

    // Record the click
    const { data: click, error: clickError } = await supabase
      .from("affiliate_clicks")
      .insert({
        affiliate_id: affiliate.id,
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer_url: referrerUrl,
      })
      .select()
      .single()

    if (clickError) throw clickError

    return { success: true, data: click }
  } catch (error) {
    console.error("Error recording affiliate click:", error)
    return { success: false, error: "Failed to record affiliate click" }
  }
}

export async function getTierSettings() {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase
      .from("affiliate_tiers")
      .select("*")
      .order("commission_rate", { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching tier settings:", error)
    return { success: false, error: "Failed to fetch tier settings" }
  }
}

export async function getMLMSettings() {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase
      .from("affiliate_mlm_settings")
      .select("*")
      .order("level", { ascending: true })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching MLM settings:", error)
    return { success: false, error: "Failed to fetch MLM settings" }
  }
}
