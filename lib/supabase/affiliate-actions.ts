"use server"

import { createServerClient } from "@/lib/supabase/server"
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
  parentAffiliateCode?: string
}) {
  const supabase = createServerClient()

  try {
    console.log("Creating new affiliate:", data)

    // Generate a unique referral code
    const referralCode = generateReferralCode(data.firstName, data.lastName)

    console.log("Generated referral code:", referralCode)

    // Check if email already exists
    const { data: existingAffiliate, error: checkError } = await supabase
      .from("affiliates")
      .select("id")
      .eq("email", data.email)
      .maybeSingle()

    if (existingAffiliate) {
      return { success: false, error: "An affiliate with this email already exists" }
    }

    // Create the affiliate record - removing the company_name field that doesn't exist
    const { data: affiliate, error } = await supabase
      .from("affiliates")
      .insert({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone || null,
        // company_name: data.companyName || null, // Removing this field as it doesn't exist
        referral_code: referralCode,
        status: "active", // Default status
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating affiliate:", error)
      return { success: false, error: error.message }
    }

    console.log("Successfully created affiliate:", affiliate)

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

// Update an affiliate
export async function updateAffiliate(
  id: string,
  {
    name,
    email,
    status,
    tier,
  }: {
    name?: string
    email?: string
    status?: string
    tier?: string
  },
) {
  try {
    const supabase = createServerClient()

    // Update the affiliate
    const { data, error } = await supabase
      .from("affiliates")
      .update({
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
        ...(status ? { status } : {}),
        ...(tier ? { tier } : {}),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating affiliate:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in updateAffiliate:", error)
    return { success: false, error: "Internal server error" }
  }
}

// Get an affiliate by ID
export async function getAffiliateById(id: string) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("affiliates").select("*").eq("id", id).single()

    if (error) {
      console.error("Error getting affiliate:", error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getAffiliateById:", error)
    return { success: false, error: "Internal server error", data: null }
  }
}

// Get an affiliate by referral code
export async function getAffiliateByReferralCode(referralCode: string) {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("affiliates").select("*").eq("referral_code", referralCode).single()

    if (error) {
      console.error("Error getting affiliate by referral code:", error)
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getAffiliateByReferralCode:", error)
    return { success: false, error: "Internal server error", data: null }
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

    // Get application counts directly with count() for better performance
    const { count: totalApplications, error: countError } = await supabase
      .from("applications")
      .select("id", { count: "exact" })
      .eq("affiliate_id", affiliateId)

    if (countError) throw countError

    // Get counts by status
    const { data: statusCounts, error: statusError } = await supabase
      .from("applications")
      .select("status")
      .eq("affiliate_id", affiliateId)

    if (statusError) throw statusError

    // Calculate counts by status
    const approvedApplications = statusCounts?.filter((app) => app.status === "approved").length || 0
    const pendingApplications =
      statusCounts?.filter((app) => app.status === "pending" || app.status === "in_review").length || 0
    const rejectedApplications = statusCounts?.filter((app) => app.status === "rejected").length || 0

    // Get total commissions
    const { data: commissions } = await supabase
      .from("affiliate_commissions")
      .select("amount, status")
      .eq("affiliate_id", affiliateId)

    // Calculate stats

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

    return {
      data: {
        totalClicks: totalClicks || 0,
        totalApplications: totalApplications || 0,
        approvedApplications,
        pendingApplications,
        rejectedApplications,
        totalCommissions,
        paidCommissions,
        pendingCommissions,
        conversionRate: totalClicks > 0 ? (totalApplications / totalClicks) * 100 : 0,
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

/**
 * Delete an affiliate
 */
export async function deleteAffiliate(id: string) {
  const supabase = createServerClient()

  try {
    // First check if the affiliate has any applications
    const { count, error: countError } = await supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("affiliate_id", id)

    if (countError) {
      console.error("Error checking affiliate applications:", countError)
      return { success: false, error: countError.message }
    }

    // If the affiliate has applications, don't allow deletion
    if (count && count > 0) {
      return {
        success: false,
        error: "Cannot delete affiliate with existing applications. Please set status to inactive instead.",
      }
    }

    // Delete affiliate clicks
    await supabase.from("affiliate_clicks").delete().eq("affiliate_id", id)

    // Delete affiliate commissions
    await supabase.from("affiliate_commissions").delete().eq("affiliate_id", id)

    // Delete affiliate relationships
    await supabase.from("affiliate_relationships").delete().eq("parent_affiliate_id", id)

    await supabase.from("affiliate_relationships").delete().eq("child_affiliate_id", id)

    // Finally, delete the affiliate
    const { error } = await supabase.from("affiliates").delete().eq("id", id)

    if (error) {
      console.error("Error deleting affiliate:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteAffiliate:", error)
    return { success: false, error: "Internal server error" }
  }
}
