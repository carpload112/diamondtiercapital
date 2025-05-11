"use server"

import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { calculateCommission } from "../utils/affiliate-utils"
import { v4 as uuidv4 } from "uuid"

// Private supabase client for internal use
const supabase = createServerClient()

/**
 * Track a new application with affiliate information
 * @param applicationId The ID of the application
 * @param referenceId The reference ID of the application
 * @param referralCode The affiliate referral code
 * @param fundingAmount The requested funding amount (for commission calculation)
 */
export async function trackApplication(
  applicationId: string,
  referenceId: string,
  referralCode: string | null | undefined,
  fundingAmount?: string,
): Promise<{ success: boolean; error?: string; affiliateId?: string }> {
  try {
    // If no referral code, nothing to track
    if (!referralCode) {
      console.log(`No referral code provided for application ${applicationId}, skipping affiliate tracking`)
      return { success: true }
    }

    console.log(`Tracking application ${applicationId} with referral code ${referralCode}`)

    // Normalize referral code (trim whitespace, etc.)
    const normalizedCode = referralCode.trim()

    // Get the affiliate from the referral code
    const { data: affiliate, error: affiliateError } = await supabase
      .from("affiliates")
      .select("id, tier")
      .eq("referral_code", normalizedCode)
      .single()

    if (affiliateError || !affiliate) {
      console.error("Error finding affiliate with referral code:", normalizedCode, affiliateError)
      return { success: false, error: "Invalid referral code" }
    }

    console.log(`Found affiliate with ID ${affiliate.id} for referral code ${normalizedCode}`)

    // Update the application with the affiliate ID
    const { error: updateError } = await supabase
      .from("applications")
      .update({
        affiliate_id: affiliate.id,
        affiliate_code: normalizedCode,
      })
      .eq("id", applicationId)

    if (updateError) {
      console.error("Error updating application with affiliate:", updateError)
      return { success: false, error: "Failed to update application with affiliate information" }
    }

    console.log(`Successfully linked application ${applicationId} to affiliate ${affiliate.id}`)

    // Record the conversion in affiliate_conversions table
    await recordConversion(affiliate.id, applicationId, referenceId)

    // Calculate and create commission
    await createCommission(affiliate.id, applicationId, fundingAmount)

    // Create notification for real-time updates
    await createNotification(affiliate.id, applicationId, referenceId)

    // Process MLM commissions if applicable
    await processMLMCommissions(affiliate.id, applicationId, fundingAmount)

    return { success: true, affiliateId: affiliate.id }
  } catch (error) {
    console.error("Error in trackApplication:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error tracking affiliate application",
    }
  }
}

/**
 * Record a click on an affiliate link
 * @param referralCode The affiliate referral code
 * @param ipAddress The IP address of the visitor
 * @param userAgent The user agent of the visitor
 * @param landingPage The landing page URL
 */
export async function recordClick(
  referralCode: string,
  ipAddress: string,
  userAgent: string,
  landingPage?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Normalize referral code
    const normalizedCode = referralCode.trim()

    // Get affiliate ID from referral code
    const { data: affiliate, error: affiliateError } = await supabase
      .from("affiliates")
      .select("id")
      .eq("referral_code", normalizedCode)
      .single()

    if (affiliateError || !affiliate) {
      console.error("Error finding affiliate with referral code:", normalizedCode, affiliateError)
      return { success: false, error: "Invalid referral code" }
    }

    // Check for duplicate clicks from the same IP in the last hour to prevent spam
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count: recentClicks, error: countError } = await supabase
      .from("affiliate_clicks")
      .select("id", { count: "exact", head: true })
      .eq("affiliate_id", affiliate.id)
      .eq("ip_address", ipAddress)
      .gte("created_at", oneHourAgo)

    if (countError) {
      console.error("Error checking recent clicks:", countError)
    } else if (recentClicks && recentClicks > 5) {
      // If more than 5 clicks from same IP in last hour, don't record to prevent spam
      console.log("Ignoring potential spam click from IP:", ipAddress)
      return { success: true } // Return success but don't record
    }

    // Record the click
    const { error: insertError } = await supabase.from("affiliate_clicks").insert({
      affiliate_id: affiliate.id,
      referral_code: normalizedCode,
      ip_address: ipAddress,
      user_agent: userAgent,
      landing_page: landingPage || null,
      created_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Error recording affiliate click:", insertError)
      return { success: false, error: "Failed to record click" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in recordClick:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error recording affiliate click",
    }
  }
}

/**
 * Record a conversion (application submission) for an affiliate
 */
async function recordConversion(affiliateId: string, applicationId: string, referenceId: string): Promise<void> {
  try {
    console.log(`Recording conversion for affiliate ${affiliateId}, application ${applicationId}`)

    await supabase.from("affiliate_conversions").insert({
      affiliate_id: affiliateId,
      application_id: applicationId,
      reference_id: referenceId,
      conversion_type: "application",
      created_at: new Date().toISOString(),
    })

    console.log(`Successfully recorded conversion for affiliate ${affiliateId}`)
  } catch (error) {
    console.error("Error recording conversion:", error)
    // Don't throw - we want to continue with other operations even if this fails
  }
}

/**
 * Create a commission record for an affiliate
 */
async function createCommission(affiliateId: string, applicationId: string, fundingAmount?: string): Promise<void> {
  try {
    console.log(`Creating commission for affiliate ${affiliateId}, application ${applicationId}`)

    // Get the affiliate's tier and commission rate
    const { data: affiliate } = await supabase.from("affiliates").select("tier").eq("id", affiliateId).single()

    const { data: tierData } = await supabase
      .from("affiliate_tiers")
      .select("commission_rate")
      .eq("name", affiliate?.tier || "standard")
      .single()

    // Parse funding amount from string if available
    let commissionBaseAmount = 1000 // Default fallback amount
    if (fundingAmount) {
      // Extract numeric value from funding amount string (e.g. "$50,000-$100,000" -> 50000)
      const match = fundingAmount.match(/\$?(\d{1,3}(,\d{3})*(\.\d+)?)/)
      if (match && match[1]) {
        const numericValue = Number(match[1].replace(/,/g, ""))
        if (!isNaN(numericValue)) {
          commissionBaseAmount = numericValue
        }
      }
    }

    const commissionRate = tierData?.commission_rate || 10 // Default 10% if tier not found
    const commissionAmount = calculateCommission(commissionBaseAmount, commissionRate)

    console.log(`Calculated commission: $${commissionAmount} (${commissionRate}% of $${commissionBaseAmount})`)

    // Create the commission record
    await supabase.from("affiliate_commissions").insert({
      affiliate_id: affiliateId,
      application_id: applicationId,
      amount: commissionAmount,
      rate: commissionRate,
      status: "pending",
      created_at: new Date().toISOString(),
    })

    console.log(`Successfully created commission record for affiliate ${affiliateId}`)
  } catch (error) {
    console.error("Error creating commission:", error)
    // Don't throw - we want to continue with other operations even if this fails
  }
}

/**
 * Create a notification for real-time updates
 */
async function createNotification(affiliateId: string, applicationId: string, referenceId: string): Promise<void> {
  try {
    console.log(`Creating notification for affiliate ${affiliateId}, application ${applicationId}`)

    await supabase.from("affiliate_notifications").insert({
      id: uuidv4(),
      affiliate_id: affiliateId,
      type: "new_application",
      application_id: applicationId,
      read: false,
      data: {
        application_reference: referenceId,
        timestamp: new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
    })

    console.log(`Successfully created notification for affiliate ${affiliateId}`)
  } catch (error) {
    console.error("Error creating notification:", error)
    // Don't throw - we want to continue with other operations even if this fails
  }
}

/**
 * Process MLM commissions for parent affiliates
 */
async function processMLMCommissions(
  affiliateId: string,
  applicationId: string,
  fundingAmount?: string,
): Promise<void> {
  try {
    console.log(`Processing MLM commissions for affiliate ${affiliateId}, application ${applicationId}`)

    // Get MLM settings
    const { data: mlmSettings } = await supabase
      .from("affiliate_mlm_settings")
      .select("*")
      .order("level", { ascending: true })

    if (!mlmSettings || mlmSettings.length === 0) {
      console.log("No MLM settings found, skipping MLM commission processing")
      return // No MLM settings, nothing to do
    }

    // Get parent affiliates
    const { data: relationships } = await supabase
      .from("affiliate_relationships")
      .select("parent_affiliate_id, level")
      .eq("child_affiliate_id", affiliateId)
      .order("level", { ascending: true })

    if (!relationships || relationships.length === 0) {
      console.log(`No parent affiliates found for affiliate ${affiliateId}, skipping MLM commission processing`)
      return // No parent affiliates, nothing to do
    }

    console.log(`Found ${relationships.length} parent affiliates for affiliate ${affiliateId}`)

    // Parse funding amount from string if available
    let commissionBaseAmount = 1000 // Default fallback amount
    if (fundingAmount) {
      // Extract numeric value from funding amount string (e.g. "$50,000-$100,000" -> 50000)
      const match = fundingAmount.match(/\$?(\d{1,3}(,\d{3})*(\.\d+)?)/)
      if (match && match[1]) {
        const numericValue = Number(match[1].replace(/,/g, ""))
        if (!isNaN(numericValue)) {
          commissionBaseAmount = numericValue
        }
      }
    }

    // Process each parent affiliate
    for (let i = 0; i < Math.min(relationships.length, mlmSettings.length); i++) {
      const parentId = relationships[i].parent_affiliate_id
      const mlmRate = mlmSettings[i].commission_percentage
      const mlmAmount = calculateCommission(commissionBaseAmount, mlmRate)

      console.log(`Creating MLM commission for parent affiliate ${parentId}: $${mlmAmount} (${mlmRate}%)`)

      // Create commission for the parent affiliate
      await supabase.from("affiliate_commissions").insert({
        affiliate_id: parentId,
        application_id: applicationId,
        amount: mlmAmount,
        rate: mlmRate,
        status: "pending",
        created_at: new Date().toISOString(),
      })

      // Create notification for the parent affiliate
      await supabase.from("affiliate_notifications").insert({
        id: uuidv4(),
        affiliate_id: parentId,
        type: "mlm_commission",
        application_id: applicationId,
        read: false,
        data: {
          amount: mlmAmount,
          level: i + 1,
          timestamp: new Date().toISOString(),
        },
        created_at: new Date().toISOString(),
      })

      console.log(`Successfully created MLM commission and notification for parent affiliate ${parentId}`)
    }
  } catch (error) {
    console.error("Error processing MLM commissions:", error)
    // Don't throw - we want to continue with other operations even if this fails
  }
}

/**
 * Get comprehensive affiliate statistics
 */
// export async function getAffiliateStats(affiliateId: string) {
//   try {
//     console.log(`Getting statistics for affiliate ${affiliateId}`)

//     // Get total clicks with optimized query
//     const { count: totalClicks, error: clickError } = await supabase
//       .from("affiliate_clicks")
//       .select("id", { count: "exact", head: true })
//       .eq("affiliate_id", affiliateId)

//     if (clickError) {
//       console.error("Error getting total clicks:", clickError)
//       throw clickError
//     }

//     // Get application counts with optimized query
//     const { count: totalApplications, error: appError } = await supabase
//       .from("applications")
//       .select("id", { count: "exact", head: true })
//       .eq("affiliate_id", affiliateId)

//     if (appError) {
//       console.error("Error getting total applications:", appError)
//       throw appError
//     }

//     // Get all applications to count by status
//     const { data: applications, error: appStatusError } = await supabase
//       .from("applications")
//       .select("status")
//       .eq("affiliate_id", affiliateId)

//     if (appStatusError) {
//       console.error("Error getting application statuses:", appStatusError)
//       throw appStatusError
//     }

//     // Calculate counts by status
//     let approvedApplications = 0
//     let pendingApplications = 0
//     let rejectedApplications = 0

//     if (applications) {
//       approvedApplications = applications.filter((app) => app.status === "approved").length
//       pendingApplications = applications.filter((app) => app.status === "pending" || app.status === "in_review").length
//       rejectedApplications = applications.filter((app) => app.status === "rejected").length
//     }

//     // Get all commissions to calculate totals
//     const { data: commissions, error: commissionError } = await supabase
//       .from("affiliate_commissions")
//       .select("amount, status")
//       .eq("affiliate_id", affiliateId)

//     if (commissionError) {
//       console.error("Error getting commissions:", commissionError)
//       throw commissionError
//     }

//     // Calculate commission totals
//     let totalCommissions = 0
//     let paidCommissions = 0
//     let pendingCommissions = 0

//     if (commissions) {
//       totalCommissions = commissions.reduce((sum, commission) => sum + Number(commission.amount), 0)
//       paidCommissions = commissions
//         .filter((commission) => commission.status === "paid")
//         .reduce((sum, commission) => sum + Number(commission.amount), 0)
//       pendingCommissions = commissions
//         .filter((commission) => commission.status === "pending")
//         .reduce((sum, commission) => sum + Number(commission.amount), 0)
//     }

//     // Calculate conversion rate
//     const conversionRate = totalClicks > 0 ? (totalApplications / totalClicks) * 100 : 0

//     console.log(`Successfully retrieved statistics for affiliate ${affiliateId}`)

//     return {
//       data: {
//         totalClicks: totalClicks || 0,
//         totalApplications: totalApplications || 0,
//         approvedApplications,
//         pendingApplications,
//         rejectedApplications,
//         totalCommissions,
//         paidCommissions,
//         pendingCommissions,
//         conversionRate,
//       },
//     }
//   } catch (error) {
//     console.error("Error getting affiliate stats:", error)
//     return {
//       data: {
//         totalClicks: 0,
//         totalApplications: 0,
//         approvedApplications: 0,
//         pendingApplications: 0,
//         rejectedApplications: 0,
//         totalCommissions: 0,
//         paidCommissions: 0,
//         pendingCommissions: 0,
//         conversionRate: 0,
//       },
//     }
//   }
// }

/**
 * Check if a referral code is valid
 */
export async function isValidReferralCode(referralCode: string): Promise<boolean> {
  try {
    if (!referralCode) return false

    const { data, error } = await supabase
      .from("affiliates")
      .select("id")
      .eq("referral_code", referralCode.trim())
      .single()

    return !error && !!data
  } catch (error) {
    console.error("Error checking referral code validity:", error)
    return false
  }
}

// Track a referral click
export async function trackReferralClick(referralCode: string) {
  try {
    const supabase = createServerClient()

    // Find the affiliate by referral code
    const { data: affiliate, error: affiliateError } = await supabase
      .from("affiliates")
      .select("id")
      .eq("referral_code", referralCode)
      .single()

    if (affiliateError || !affiliate) {
      console.error("Affiliate not found:", affiliateError)
      return { success: false, error: "Invalid referral code" }
    }

    // Insert a click record
    const { error: clickError } = await supabase.from("affiliate_clicks").insert({
      affiliate_id: affiliate.id,
      referral_code: referralCode,
      ip_address: "anonymous", // For privacy reasons
      user_agent: "anonymous", // For privacy reasons
    })

    if (clickError) {
      console.error("Error tracking click:", clickError)
      return { success: false, error: "Failed to track click" }
    }

    // Store the referral code in a cookie
    cookies().set("referral_code", referralCode, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    })

    return { success: true }
  } catch (error) {
    console.error("Error in trackReferralClick:", error)
    return { success: false, error: "Internal server error" }
  }
}

// Get affiliate stats
export async function getAffiliateStats(affiliateId: string) {
  try {
    const supabase = createServerClient()

    // Get stats using the RPC function
    const { data, error } = await supabase.rpc("get_affiliate_stats", { affiliate_id: affiliateId })

    if (error) {
      console.error("Error getting affiliate stats:", error)
      return {
        success: false,
        error: "Failed to get affiliate stats",
        data: null,
      }
    }

    // If no data is returned, provide default values
    const stats = data?.[0] || {
      total_clicks: 0,
      total_applications: 0,
      approved_applications: 0,
      pending_applications: 0,
      rejected_applications: 0,
      total_commissions: 0,
      paid_commissions: 0,
      pending_commissions: 0,
      conversion_rate: 0,
    }

    return {
      success: true,
      data: stats,
    }
  } catch (error) {
    console.error("Error in getAffiliateStats:", error)
    return {
      success: false,
      error: "Internal server error",
      data: null,
    }
  }
}

// Process affiliate commission when an application is approved
export async function processAffiliateCommission(applicationId: string) {
  try {
    const supabase = createServerClient()

    // Get the application with its affiliate
    const { data: application, error: appError } = await supabase
      .from("applications")
      .select(`
        id,
        affiliate_id,
        status,
        funding_requests:funding_requests_id(amount_requested)
      `)
      .eq("id", applicationId)
      .single()

    if (appError || !application) {
      console.error("Application not found:", appError)
      return { success: false, error: "Application not found" }
    }

    // Only process commissions for approved applications with an affiliate
    if (application.status !== "approved" || !application.affiliate_id) {
      return {
        success: false,
        error: "Application is not approved or has no affiliate",
      }
    }

    // Get the affiliate's commission rate
    const { data: affiliate, error: affiliateError } = await supabase
      .from("affiliates")
      .select("id, tier")
      .eq("id", application.affiliate_id)
      .single()

    if (affiliateError || !affiliate) {
      console.error("Affiliate not found:", affiliateError)
      return { success: false, error: "Affiliate not found" }
    }

    // Get the tier's commission rate
    const { data: tier, error: tierError } = await supabase
      .from("affiliate_tiers")
      .select("commission_rate")
      .eq("name", affiliate.tier || "bronze")
      .single()

    if (tierError) {
      console.error("Error getting tier:", tierError)
      return { success: false, error: "Failed to get commission rate" }
    }

    const commissionRate = tier?.commission_rate || 5 // Default to 5% if tier not found

    // Calculate the commission amount
    const amountRequested = application.funding_requests?.amount_requested || 0
    let amount = 0

    // If amount_requested is a range (e.g., "$50,000 - $100,000"), use the lower value
    if (typeof amountRequested === "string" && amountRequested.includes("-")) {
      const match = amountRequested.match(/\$?([0-9,]+)/)
      if (match && match[1]) {
        amount = Number.parseFloat(match[1].replace(/,/g, ""))
      }
    } else {
      amount =
        typeof amountRequested === "string"
          ? Number.parseFloat(amountRequested.replace(/[^0-9.-]+/g, ""))
          : amountRequested
    }

    const commissionAmount = (amount * commissionRate) / 100

    // Check if a commission already exists for this application
    const { data: existingCommission, error: existingError } = await supabase
      .from("affiliate_commissions")
      .select("id")
      .eq("application_id", applicationId)
      .maybeSingle()

    if (existingError) {
      console.error("Error checking existing commission:", existingError)
    }

    // If a commission already exists, update it
    if (existingCommission) {
      const { error: updateError } = await supabase
        .from("affiliate_commissions")
        .update({
          amount: commissionAmount,
          rate: commissionRate,
          status: "pending",
        })
        .eq("id", existingCommission.id)

      if (updateError) {
        console.error("Error updating commission:", updateError)
        return { success: false, error: "Failed to update commission" }
      }
    } else {
      // Otherwise, create a new commission
      const { error: insertError } = await supabase.from("affiliate_commissions").insert({
        affiliate_id: affiliate.id,
        application_id: applicationId,
        amount: commissionAmount,
        rate: commissionRate,
        status: "pending",
      })

      if (insertError) {
        console.error("Error creating commission:", insertError)
        return { success: false, error: "Failed to create commission" }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in processAffiliateCommission:", error)
    return { success: false, error: "Internal server error" }
  }
}

// Get referral code from cookies
export async function getReferralCodeFromCookies() {
  try {
    const cookieStore = cookies()
    const referralCode = cookieStore.get("referral_code")?.value
    return referralCode || null
  } catch (error) {
    console.error("Error getting referral code from cookies:", error)
    return null
  }
}
