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
      .select("id, tier, status")
      .eq("referral_code", normalizedCode)
      .single()

    if (affiliateError) {
      console.error("Error finding affiliate with referral code:", normalizedCode, affiliateError)
      return { success: false, error: `Invalid referral code: ${affiliateError.message}` }
    }

    if (!affiliate) {
      console.error("No affiliate found with referral code:", normalizedCode)
      return { success: false, error: "Invalid referral code: No affiliate found" }
    }

    // Check if affiliate is active
    if (affiliate.status !== "active") {
      console.warn(`Affiliate with ID ${affiliate.id} is not active (status: ${affiliate.status})`)
      return { success: false, error: "Affiliate is not active" }
    }

    console.log(`Found affiliate with ID ${affiliate.id} for referral code ${normalizedCode}`)

    // Check if application already has an affiliate
    const { data: existingApp, error: checkError } = await supabase
      .from("applications")
      .select("affiliate_id, affiliate_code")
      .eq("id", applicationId)
      .single()

    if (checkError) {
      console.error("Error checking application:", checkError)
      return { success: false, error: `Failed to check application: ${checkError.message}` }
    }

    if (existingApp?.affiliate_id && existingApp.affiliate_id !== affiliate.id) {
      console.warn(
        `Application ${applicationId} already has affiliate ${existingApp.affiliate_id}, not overriding with ${affiliate.id}`,
      )
      return {
        success: false,
        error: "Application already has a different affiliate",
      }
    }

    // Update the application with the affiliate ID
    const { error: updateError } = await supabase
      .from("applications")
      .update({
        affiliate_id: affiliate.id,
        affiliate_code: normalizedCode,
        updated_at: new Date().toISOString(),
      })
      .eq("id", applicationId)

    if (updateError) {
      console.error("Error updating application with affiliate:", updateError)
      return { success: false, error: `Failed to update application: ${updateError.message}` }
    }

    console.log(`Successfully linked application ${applicationId} to affiliate ${affiliate.id}`)

    // Record the conversion in affiliate_conversions table
    const conversionResult = await recordConversion(affiliate.id, applicationId, referenceId)
    if (!conversionResult.success) {
      console.warn("Warning recording conversion:", conversionResult.error)
      // Continue with other operations even if this fails
    }

    // Calculate and create commission
    const commissionResult = await createCommission(affiliate.id, applicationId, fundingAmount)
    if (!commissionResult.success) {
      console.warn("Warning creating commission:", commissionResult.error)
      // Continue with other operations even if this fails
    }

    // Create notification for real-time updates
    const notificationResult = await createNotification(affiliate.id, applicationId, referenceId)
    if (!notificationResult.success) {
      console.warn("Warning creating notification:", notificationResult.error)
      // Continue with other operations even if this fails
    }

    // Process MLM commissions if applicable
    const mlmResult = await processMLMCommissions(affiliate.id, applicationId, fundingAmount)
    if (!mlmResult.success) {
      console.warn("Warning processing MLM commissions:", mlmResult.error)
      // Continue with other operations even if this fails
    }

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
      .select("id, status")
      .eq("referral_code", normalizedCode)
      .single()

    if (affiliateError || !affiliate) {
      console.error("Error finding affiliate with referral code:", normalizedCode, affiliateError)
      return { success: false, error: "Invalid referral code" }
    }

    // Check if affiliate is active
    if (affiliate.status !== "active") {
      console.warn(`Affiliate with ID ${affiliate.id} is not active (status: ${affiliate.status})`)
      return { success: false, error: "Affiliate is not active" }
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
async function recordConversion(
  affiliateId: string,
  applicationId: string,
  referenceId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Recording conversion for affiliate ${affiliateId}, application ${applicationId}`)

    // Check if conversion already exists
    const { data: existingConversion, error: checkError } = await supabase
      .from("affiliate_conversions")
      .select("id")
      .eq("affiliate_id", affiliateId)
      .eq("application_id", applicationId)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing conversion:", checkError)
      return { success: false, error: `Failed to check existing conversion: ${checkError.message}` }
    }

    if (existingConversion) {
      console.log(`Conversion already exists for affiliate ${affiliateId}, application ${applicationId}`)
      return { success: true }
    }

    const { error: insertError } = await supabase.from("affiliate_conversions").insert({
      affiliate_id: affiliateId,
      application_id: applicationId,
      reference_id: referenceId,
      conversion_type: "application",
      created_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Error recording conversion:", insertError)
      return { success: false, error: `Failed to record conversion: ${insertError.message}` }
    }

    console.log(`Successfully recorded conversion for affiliate ${affiliateId}`)
    return { success: true }
  } catch (error) {
    console.error("Error recording conversion:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error recording conversion",
    }
  }
}

/**
 * Create a commission record for an affiliate
 */
async function createCommission(
  affiliateId: string,
  applicationId: string,
  fundingAmount?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Creating commission for affiliate ${affiliateId}, application ${applicationId}`)

    // Check if commission already exists
    const { data: existingCommission, error: checkError } = await supabase
      .from("affiliate_commissions")
      .select("id")
      .eq("affiliate_id", affiliateId)
      .eq("application_id", applicationId)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing commission:", checkError)
      return { success: false, error: `Failed to check existing commission: ${checkError.message}` }
    }

    if (existingCommission) {
      console.log(`Commission already exists for affiliate ${affiliateId}, application ${applicationId}`)
      return { success: true }
    }

    // Get the affiliate's tier and commission rate
    const { data: affiliate, error: affiliateError } = await supabase
      .from("affiliates")
      .select("tier")
      .eq("id", affiliateId)
      .single()

    if (affiliateError) {
      console.error("Error getting affiliate tier:", affiliateError)
      return { success: false, error: `Failed to get affiliate tier: ${affiliateError.message}` }
    }

    const { data: tierData, error: tierError } = await supabase
      .from("affiliate_tiers")
      .select("commission_rate")
      .eq("name", affiliate?.tier || "standard")
      .single()

    if (tierError) {
      console.error("Error getting tier data:", tierError)
      return { success: false, error: `Failed to get tier data: ${tierError.message}` }
    }

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
    const { error: insertError } = await supabase.from("affiliate_commissions").insert({
      affiliate_id: affiliateId,
      application_id: applicationId,
      amount: commissionAmount,
      rate: commissionRate,
      status: "pending",
      created_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Error creating commission:", insertError)
      return { success: false, error: `Failed to create commission: ${insertError.message}` }
    }

    console.log(`Successfully created commission record for affiliate ${affiliateId}`)
    return { success: true }
  } catch (error) {
    console.error("Error creating commission:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error creating commission",
    }
  }
}

/**
 * Create a notification for real-time updates
 */
async function createNotification(
  affiliateId: string,
  applicationId: string,
  referenceId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Creating notification for affiliate ${affiliateId}, application ${applicationId}`)

    // Check if notification already exists
    const { data: existingNotification, error: checkError } = await supabase
      .from("affiliate_notifications")
      .select("id")
      .eq("affiliate_id", affiliateId)
      .eq("application_id", applicationId)
      .eq("type", "new_application")
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing notification:", checkError)
      return { success: false, error: `Failed to check existing notification: ${checkError.message}` }
    }

    if (existingNotification) {
      console.log(`Notification already exists for affiliate ${affiliateId}, application ${applicationId}`)
      return { success: true }
    }

    const { error: insertError } = await supabase.from("affiliate_notifications").insert({
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

    if (insertError) {
      console.error("Error creating notification:", insertError)
      return { success: false, error: `Failed to create notification: ${insertError.message}` }
    }

    console.log(`Successfully created notification for affiliate ${affiliateId}`)
    return { success: true }
  } catch (error) {
    console.error("Error creating notification:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error creating notification",
    }
  }
}

/**
 * Process MLM commissions for parent affiliates
 */
async function processMLMCommissions(
  affiliateId: string,
  applicationId: string,
  fundingAmount?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Processing MLM commissions for affiliate ${affiliateId}, application ${applicationId}`)

    // Get MLM settings
    const { data: mlmSettings, error: settingsError } = await supabase
      .from("affiliate_mlm_settings")
      .select("*")
      .order("level", { ascending: true })

    if (settingsError) {
      console.error("Error getting MLM settings:", settingsError)
      return { success: false, error: `Failed to get MLM settings: ${settingsError.message}` }
    }

    if (!mlmSettings || mlmSettings.length === 0) {
      console.log("No MLM settings found, skipping MLM commission processing")
      return { success: true } // No MLM settings, nothing to do
    }

    // Get parent affiliates
    const { data: relationships, error: relationshipsError } = await supabase
      .from("affiliate_relationships")
      .select("parent_affiliate_id, level")
      .eq("child_affiliate_id", affiliateId)
      .order("level", { ascending: true })

    if (relationshipsError) {
      console.error("Error getting parent affiliates:", relationshipsError)
      return { success: false, error: `Failed to get parent affiliates: ${relationshipsError.message}` }
    }

    if (!relationships || relationships.length === 0) {
      console.log(`No parent affiliates found for affiliate ${affiliateId}, skipping MLM commission processing`)
      return { success: true } // No parent affiliates, nothing to do
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

      // Check if parent affiliate is active
      const { data: parentAffiliate, error: parentError } = await supabase
        .from("affiliates")
        .select("status")
        .eq("id", parentId)
        .single()

      if (parentError) {
        console.error(`Error checking parent affiliate ${parentId}:`, parentError)
        continue // Skip this parent but continue with others
      }

      if (parentAffiliate.status !== "active") {
        console.log(`Parent affiliate ${parentId} is not active, skipping MLM commission`)
        continue // Skip this parent but continue with others
      }

      console.log(`Creating MLM commission for parent affiliate ${parentId}: $${mlmAmount} (${mlmRate}%)`)

      // Check if commission already exists for this parent
      const { data: existingCommission, error: checkError } = await supabase
        .from("affiliate_commissions")
        .select("id")
        .eq("affiliate_id", parentId)
        .eq("application_id", applicationId)
        .maybeSingle()

      if (checkError) {
        console.error(`Error checking existing commission for parent ${parentId}:`, checkError)
        continue // Skip this parent but continue with others
      }

      if (existingCommission) {
        console.log(`Commission already exists for parent affiliate ${parentId}, application ${applicationId}`)
        continue // Skip this parent but continue with others
      }

      // Create commission for the parent affiliate
      const { error: commissionError } = await supabase.from("affiliate_commissions").insert({
        affiliate_id: parentId,
        application_id: applicationId,
        amount: mlmAmount,
        rate: mlmRate,
        status: "pending",
        created_at: new Date().toISOString(),
      })

      if (commissionError) {
        console.error(`Error creating MLM commission for parent ${parentId}:`, commissionError)
        continue // Skip this parent but continue with others
      }

      // Create notification for the parent affiliate
      const { error: notificationError } = await supabase.from("affiliate_notifications").insert({
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

      if (notificationError) {
        console.error(`Error creating MLM notification for parent ${parentId}:`, notificationError)
        // Continue even if notification fails
      }

      console.log(`Successfully created MLM commission and notification for parent affiliate ${parentId}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error processing MLM commissions:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error processing MLM commissions",
    }
  }
}

/**
 * Check if a referral code is valid
 */
export async function isValidReferralCode(referralCode: string): Promise<boolean> {
  try {
    if (!referralCode) return false

    const normalizedCode = referralCode.trim()

    const { data, error } = await supabase
      .from("affiliates")
      .select("id, status")
      .eq("referral_code", normalizedCode)
      .single()

    if (error) {
      console.error("Error checking referral code validity:", error)
      return false
    }

    // Check if affiliate is active
    if (data && data.status !== "active") {
      console.warn(`Referral code ${normalizedCode} belongs to inactive affiliate (status: ${data.status})`)
      return false
    }

    return !!data
  } catch (error) {
    console.error("Error checking referral code validity:", error)
    return false
  }
}

/**
 * Validate and normalize a referral code
 * Returns the normalized code if valid, null if invalid
 */
export async function validateAndNormalizeReferralCode(
  referralCode: string | null | undefined,
): Promise<string | null> {
  try {
    if (!referralCode) return null

    const normalizedCode = referralCode.trim()

    // Check if the code is valid
    const isValid = await isValidReferralCode(normalizedCode)

    return isValid ? normalizedCode : null
  } catch (error) {
    console.error("Error validating referral code:", error)
    return null
  }
}

// Track a referral click
export async function trackReferralClick(referralCode: string) {
  try {
    const supabase = createServerClient()

    // Normalize the code
    const normalizedCode = referralCode.trim()

    // Find the affiliate by referral code
    const { data: affiliate, error: affiliateError } = await supabase
      .from("affiliates")
      .select("id, status")
      .eq("referral_code", normalizedCode)
      .single()

    if (affiliateError || !affiliate) {
      console.error("Affiliate not found:", affiliateError)
      return { success: false, error: "Invalid referral code" }
    }

    // Check if affiliate is active
    if (affiliate.status !== "active") {
      console.warn(`Affiliate with ID ${affiliate.id} is not active (status: ${affiliate.status})`)
      return { success: false, error: "Affiliate is not active" }
    }

    // Insert a click record
    const { error: clickError } = await supabase.from("affiliate_clicks").insert({
      affiliate_id: affiliate.id,
      referral_code: normalizedCode,
      ip_address: "anonymous", // For privacy reasons
      user_agent: "anonymous", // For privacy reasons
      created_at: new Date().toISOString(),
    })

    if (clickError) {
      console.error("Error tracking click:", clickError)
      return { success: false, error: "Failed to track click" }
    }

    // Store the referral code in a cookie
    cookies().set("referral_code", normalizedCode, {
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
      .select("id, tier, status")
      .eq("id", application.affiliate_id)
      .single()

    if (affiliateError || !affiliate) {
      console.error("Affiliate not found:", affiliateError)
      return { success: false, error: "Affiliate not found" }
    }

    // Check if affiliate is active
    if (affiliate.status !== "active") {
      console.warn(`Affiliate with ID ${affiliate.id} is not active (status: ${affiliate.status})`)
      return { success: false, error: "Affiliate is not active" }
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
          updated_at: new Date().toISOString(),
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
        created_at: new Date().toISOString(),
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

// Retry tracking an application with a referral code
export async function retryTrackApplication(applicationId: string, referralCode: string) {
  try {
    // Get the application details
    const { data: application, error: appError } = await supabase
      .from("applications")
      .select("id, reference_id, funding_amount")
      .eq("id", applicationId)
      .single()

    if (appError || !application) {
      console.error("Application not found:", appError)
      return { success: false, error: "Application not found" }
    }

    // Track the application
    const result = await trackApplication(
      applicationId,
      application.reference_id,
      referralCode,
      application.funding_amount,
    )

    return result
  } catch (error) {
    console.error("Error in retryTrackApplication:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error retrying application tracking",
    }
  }
}

// Get all applications for an affiliate
export async function getAffiliateApplications(affiliateId: string) {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select(`
        id,
        reference_id,
        status,
        created_at,
        submitted_at,
        business_details:business_details_id(business_name),
        applicant_details:applicant_details_id(full_name, email),
        funding_requests:funding_requests_id(funding_amount)
      `)
      .eq("affiliate_id", affiliateId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error getting affiliate applications:", error)
      return { success: false, error: "Failed to get applications", data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error in getAffiliateApplications:", error)
    return { success: false, error: "Internal server error", data: [] }
  }
}

// Get all commissions for an affiliate
export async function getAffiliateCommissions(affiliateId: string) {
  try {
    const { data, error } = await supabase
      .from("affiliate_commissions")
      .select(`
        id,
        amount,
        rate,
        status,
        created_at,
        application:application_id(reference_id, status)
      `)
      .eq("affiliate_id", affiliateId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error getting affiliate commissions:", error)
      return { success: false, error: "Failed to get commissions", data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error in getAffiliateCommissions:", error)
    return { success: false, error: "Internal server error", data: [] }
  }
}
