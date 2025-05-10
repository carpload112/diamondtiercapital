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

    // Create the affiliate record - using the correct schema fields
    const { data: affiliate, error } = await supabase
      .from("affiliates")
      .insert({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        referral_code: referralCode,
        // Remove tier field as it doesn't exist in the schema
        status: "active", // Default status
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
        })
      }
    }

    return { success: true, data: affiliate }
  } catch (error) {
    console.error("Error creating affiliate:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create affiliate" }
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
    // Remove tier field if it exists in the data
    const { tier, ...updateData } = data

    const { error } = await supabase.from("affiliates").update(updateData).eq("id", id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error updating affiliate:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update affiliate" }
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
      referral_code: referralCode,
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
    const { count: totalClicks } = await supabase
      .from("affiliate_clicks")
      .select("id", { count: "exact", head: true })
      .eq("affiliate_id", affiliateId)

    // Get total applications
    const { data: applications } = await supabase
      .from("applications")
      .select("id, status")
      .eq("affiliate_id", affiliateId)

    // Get total commissions
    const { data: commissions } = await supabase
      .from("affiliate_commissions")
      .select("amount, status")
      .eq("affiliate_id", affiliateId)

    // Calculate stats
    const totalApplications = applications?.length || 0
    const approvedApplications = applications?.filter((app) => app.status === "approved").length || 0
    const pendingApplications = applications?.filter((app) => app.status === "pending").length || 0
    const rejectedApplications = applications?.filter((app) => app.status === "rejected").length || 0

    const totalCommissions = commissions?.reduce((sum, commission) => sum + Number(commission.amount), 0) || 0
    const paidCommissions =
      commissions
        ?.filter((commission) => commission.status === "paid")
        .reduce((sum, commission) => sum + Number(commission.amount), 0) || 0
    const pendingCommissions =
      commissions
        ?.filter((commission) => commission.status === "pending")
        .reduce((sum, commission) => sum + Number(commission.amount), 0) || 0

    // Calculate conversion rate
    const conversionRate = totalClicks > 0 ? (totalApplications / totalClicks) * 100 : 0

    return {
      data: {
        totalClicks: totalClicks || 0,
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
