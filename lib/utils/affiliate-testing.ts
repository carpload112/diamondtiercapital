"use server"

import { createServerClient } from "../supabase/server"
import { affiliateTrackingService } from "../services/affiliate-tracking-service"
import { v4 as uuidv4 } from "uuid"

/**
 * Utility for testing the affiliate tracking system
 */
export async function testAffiliateTracking(referralCode: string): Promise<{
  success: boolean
  results: any
  error?: string
}> {
  try {
    const supabase = createServerClient()
    const results: any = {
      referralCode,
      steps: [],
    }

    // Step 1: Verify referral code exists
    results.steps.push({ name: "Verify referral code", status: "running" })
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("id, name, email, referral_code")
      .eq("referral_code", referralCode)
      .single()

    if (!affiliate) {
      results.steps[0].status = "failed"
      results.steps[0].error = "Referral code not found"
      return { success: false, results, error: "Referral code not found" }
    }

    results.steps[0].status = "success"
    results.steps[0].data = {
      affiliateId: affiliate.id,
      name: affiliate.name,
      email: affiliate.email,
    }

    // Step 2: Record a test click
    results.steps.push({ name: "Record test click", status: "running" })
    const clickResult = await affiliateTrackingService.recordClick(
      referralCode,
      "127.0.0.1",
      "Affiliate Testing Tool",
      "/test",
    )

    if (!clickResult.success) {
      results.steps[1].status = "failed"
      results.steps[1].error = clickResult.error || "Failed to record click"
      return { success: false, results, error: "Failed to record click" }
    }

    results.steps[1].status = "success"

    // Step 3: Create a test application
    results.steps.push({ name: "Create test application", status: "running" })
    const applicationId = uuidv4()
    const referenceId = `TEST${Math.random().toString(36).substring(2, 7).toUpperCase()}`

    const { error: applicationError } = await supabase.from("applications").insert({
      id: applicationId,
      reference_id: referenceId,
      status: "test",
      credit_check_completed: false,
      submitted_at: new Date().toISOString(),
      notes: "Test application for affiliate tracking",
    })

    if (applicationError) {
      results.steps[2].status = "failed"
      results.steps[2].error = applicationError.message
      return { success: false, results, error: "Failed to create test application" }
    }

    results.steps[2].status = "success"
    results.steps[2].data = {
      applicationId,
      referenceId,
    }

    // Step 4: Track the application with the affiliate
    results.steps.push({ name: "Track application with affiliate", status: "running" })
    const trackingResult = await affiliateTrackingService.trackApplication(
      applicationId,
      referenceId,
      referralCode,
      "$100,000",
    )

    if (!trackingResult.success) {
      results.steps[3].status = "failed"
      results.steps[3].error = trackingResult.error || "Failed to track application"
      return { success: false, results, error: "Failed to track application" }
    }

    results.steps[3].status = "success"

    // Step 5: Verify application was associated with affiliate
    results.steps.push({ name: "Verify application association", status: "running" })
    const { data: updatedApplication, error: verifyError } = await supabase
      .from("applications")
      .select("affiliate_id, affiliate_code")
      .eq("id", applicationId)
      .single()

    if (verifyError || !updatedApplication) {
      results.steps[4].status = "failed"
      results.steps[4].error = verifyError?.message || "Failed to verify application"
      return { success: false, results, error: "Failed to verify application" }
    }

    if (updatedApplication.affiliate_id !== affiliate.id) {
      results.steps[4].status = "failed"
      results.steps[4].error = "Application not associated with correct affiliate"
      return { success: false, results, error: "Application not associated with correct affiliate" }
    }

    results.steps[4].status = "success"
    results.steps[4].data = {
      affiliateId: updatedApplication.affiliate_id,
      affiliateCode: updatedApplication.affiliate_code,
    }

    // Step 6: Verify commission was created
    results.steps.push({ name: "Verify commission creation", status: "running" })
    const { data: commissions, error: commissionError } = await supabase
      .from("affiliate_commissions")
      .select("id, amount, rate, status")
      .eq("affiliate_id", affiliate.id)
      .eq("application_id", applicationId)

    if (commissionError) {
      results.steps[5].status = "failed"
      results.steps[5].error = commissionError.message
      return { success: false, results, error: "Failed to verify commission" }
    }

    if (!commissions || commissions.length === 0) {
      results.steps[5].status = "failed"
      results.steps[5].error = "No commission created for the application"
      return { success: false, results, error: "No commission created for the application" }
    }

    results.steps[5].status = "success"
    results.steps[5].data = {
      commissionId: commissions[0].id,
      amount: commissions[0].amount,
      rate: commissions[0].rate,
      status: commissions[0].status,
    }

    // Step 7: Verify notification was created
    results.steps.push({ name: "Verify notification creation", status: "running" })
    const { data: notifications, error: notificationError } = await supabase
      .from("affiliate_notifications")
      .select("id, type, application_id, read")
      .eq("affiliate_id", affiliate.id)
      .eq("application_id", applicationId)

    if (notificationError) {
      results.steps[6].status = "failed"
      results.steps[6].error = notificationError.message
      return { success: false, results, error: "Failed to verify notification" }
    }

    if (!notifications || notifications.length === 0) {
      results.steps[6].status = "failed"
      results.steps[6].error = "No notification created for the application"
      return { success: false, results, error: "No notification created for the application" }
    }

    results.steps[6].status = "success"
    results.steps[6].data = {
      notificationId: notifications[0].id,
      type: notifications[0].type,
      read: notifications[0].read,
    }

    // Step 8: Clean up test data
    results.steps.push({ name: "Clean up test data", status: "running" })
    await supabase.from("applications").delete().eq("id", applicationId)

    results.steps[7].status = "success"

    // All tests passed
    return { success: true, results }
  } catch (error) {
    console.error("Error testing affiliate tracking:", error)
    return {
      success: false,
      results: { error: error instanceof Error ? error.message : "Unknown error" },
      error: "Failed to complete affiliate tracking test",
    }
  }
}
