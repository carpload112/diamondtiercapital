"use server"

import { createServerClient } from "./server"
import { generateReferralCode } from "../utils/affiliate-utils"

/**
 * Create a new affiliate
 */
export async function createAffiliate(data: {
  firstName: string
  lastName: string
  email: string
  phone?: string
  companyName?: string
  paymentMethod?: string
  paymentDetails?: any
  parentAffiliateCode?: string
}) {
  const supabase = createServerClient()

  try {
    // Generate a unique referral code
    const referralCode = generateReferralCode(data.firstName, data.lastName)

    // Create the affiliate record
    const { data: affiliate, error } = await supabase
      .from("affiliates")
      .insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone || null,
        company_name: data.companyName || null,
        referral_code: referralCode,
        payment_method: data.paymentMethod || null,
        payment_details: data.paymentDetails || null,
      })
      .select()
      .single()

    if (error) throw error

    // If there's a parent affiliate, create the relationship
    if (data.parentAffiliateCode) {
      const { data: parentAffiliate } = await supabase
        .from("affiliates")
        .select("id")
        .eq("referral_code", data.parentAffiliateCode)
        .single()

      if (parentAffiliate) {
        // Create the relationship
        await supabase.from("affiliate_relationships").insert({
          parent_affiliate_id: parentAffiliate.id,
          child_affiliate_id: affiliate.id,
          level: 1, // Direct referral
        })
      }
    }

    return { success: true, data: affiliate }
  } catch (error) {
    console.error("Error creating affiliate:", error)
    return { success: false, error: "Failed to create affiliate" }
  }
}

/**
 * Get affiliate by referral code
 */
export async function getAffiliateByReferralCode(referralCode: string) {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.from("affiliates").select("*").eq("referral_code", referralCode).single()

    if (error) throw error

    return { data }
  } catch (error) {
    console.error("Error getting affiliate:", error)
    return { data: null }
  }
}

/**
 * Get affiliate by ID
 */
export async function getAffiliateById(id: string) {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.from("affiliates").select("*").eq("id", id).single()

    if (error) throw error

    return { data }
  } catch (error) {
    console.error("Error getting affiliate:", error)
    return { data: null }
  }
}

/**
 * Get all affiliates
 */
export async function getAllAffiliates() {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.from("affiliates").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return { data }
  } catch (error) {
    console.error("Error getting affiliates:", error)
    return { data: [] }
  }
}

/**
 * Update affiliate
 */
export async function updateAffiliate(id: string, data: any) {
  const supabase = createServerClient()

  try {
    const { error } = await supabase
      .from("affiliates")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error updating affiliate:", error)
    return { success: false, error: "Failed to update affiliate" }
  }
}

/**
 * Record affiliate click
 */
export async function recordAffiliateClick(referralCode: string, ipAddress: string, userAgent: string) {
  const supabase = createServerClient()

  try {
    // Get affiliate ID from referral code
    const { data: affiliate } = await getAffiliateByReferralCode(referralCode)
    if (!affiliate) throw new Error("Affiliate not found")

    // Record the click
    const { error } = await supabase.from("affiliate_clicks").insert({
      affiliate_id: affiliate.id,
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error recording affiliate click:", error)
    return { success: false, error: "Failed to record click" }
  }
}

/**
 * Create commission
 */
export async function createCommission(data: {
  affiliateId: string
  applicationId: string
  amount: number
  rate: number
  status?: string
}) {
  const supabase = createServerClient()

  try {
    const { error } = await supabase.from("affiliate_commissions").insert({
      affiliate_id: data.affiliateId,
      application_id: data.applicationId,
      amount: data.amount,
      rate: data.rate,
      status: data.status || "pending",
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error creating commission:", error)
    return { success: false, error: "Failed to create commission" }
  }
}

/**
 * Get affiliate stats
 */
export async function getAffiliateStats(affiliateId: string) {
  const supabase = createServerClient()

  try {
    // Get total clicks
    const { data: clicks, error: clicksError } = await supabase
      .from("affiliate_clicks")
      .select("id", { count: "exact" })
      .eq("affiliate_id", affiliateId)

    if (clicksError) throw clicksError

    // Get total applications
    const { data: applications, error: applicationsError } = await supabase
      .from("applications")
      .select("id, status", { count: "exact" })
      .eq("affiliate_id", affiliateId)

    if (applicationsError) throw applicationsError

    // Get total commissions
    const { data: commissions, error: commissionsError } = await supabase
      .from("affiliate_commissions")
      .select("amount, status")
      .eq("affiliate_id", affiliateId)

    if (commissionsError) throw commissionsError

    // Calculate stats
    const totalClicks = clicks?.length || 0
    const totalApplications = applications?.length || 0
    const approvedApplications = applications?.filter((app) => app.status === "approved").length || 0
    const pendingApplications = applications?.filter((app) => app.status === "pending").length || 0
    const rejectedApplications = applications?.filter((app) => app.status === "rejected").length || 0

    const totalCommissions =
      commissions?.reduce((sum, commission) => sum + Number.parseFloat(commission.amount), 0) || 0
    const paidCommissions =
      commissions
        ?.filter((commission) => commission.status === "paid")
        .reduce((sum, commission) => sum + Number.parseFloat(commission.amount), 0) || 0
    const pendingCommissions =
      commissions
        ?.filter((commission) => commission.status === "pending")
        .reduce((sum, commission) => sum + Number.parseFloat(commission.amount), 0) || 0

    // Calculate conversion rate
    const conversionRate = totalClicks > 0 ? (totalApplications / totalClicks) * 100 : 0

    return {
      data: {
        totalClicks,
        totalApplications,
        approvedApplications,
        pendingApplications,
        rejectedApplications,
        totalCommissions,
        paidCommissions,
        pendingCommissions,
        conversionRate,
      },
    }
  } catch (error) {
    console.error("Error getting affiliate stats:", error)
    return {
      data: {
        totalClicks: 0,
        totalApplications: 0,
        approvedApplications: 0,
        pendingApplications: 0,
        rejectedApplications: 0,
        totalCommissions: 0,
        paidCommissions: 0,
        pendingCommissions: 0,
        conversionRate: 0,
      },
    }
  }
}

/**
 * Get affiliate tiers
 */
export async function getAffiliateTiers() {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase
      .from("affiliate_tiers")
      .select("*")
      .order("commission_rate", { ascending: false })

    if (error) throw error

    return { data }
  } catch (error) {
    console.error("Error getting affiliate tiers:", error)
    return { data: [] }
  }
}

/**
 * Create or update affiliate payout
 */
export async function createAffiliatePayout(data: {
  affiliateId: string
  amount: number
  paymentMethod: string
  paymentDetails?: any
}) {
  const supabase = createServerClient()

  try {
    // Create payout record
    const { error } = await supabase.from("affiliate_payouts").insert({
      affiliate_id: data.affiliateId,
      amount: data.amount,
      payment_method: data.paymentMethod,
      payment_details: data.paymentDetails || null,
    })

    if (error) throw error

    // Update commissions to paid status
    const { error: updateError } = await supabase
      .from("affiliate_commissions")
      .update({
        status: "paid",
        payout_date: new Date().toISOString(),
      })
      .eq("affiliate_id", data.affiliateId)
      .eq("status", "pending")

    if (updateError) throw updateError

    return { success: true }
  } catch (error) {
    console.error("Error creating affiliate payout:", error)
    return { success: false, error: "Failed to create payout" }
  }
}

/**
 * Get MLM settings
 */
export async function getMLMSettings() {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase
      .from("affiliate_mlm_settings")
      .select("*")
      .order("level", { ascending: true })

    if (error) throw error

    return { data }
  } catch (error) {
    console.error("Error getting MLM settings:", error)
    return { data: [] }
  }
}

/**
 * Update application with affiliate information
 */
export async function updateApplicationWithAffiliate(applicationId: string, affiliateId: string, referralCode: string) {
  const supabase = createServerClient()

  try {
    const { error } = await supabase
      .from("applications")
      .update({
        affiliate_id: affiliateId,
        affiliate_code: referralCode,
      })
      .eq("id", applicationId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error updating application with affiliate:", error)
    return { success: false, error: "Failed to update application" }
  }
}
