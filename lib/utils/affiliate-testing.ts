// Remove "use server" if it exists at the top of this file
import { createServerClient } from "../supabase/server"
import { v4 as uuidv4 } from "uuid"

/**
 * Test function for affiliate tracking
 * Creates a test application and tracks it with the given referral code
 */
export async function testAffiliateTracking(referralCode: string) {
  try {
    const supabase = createServerClient()

    // Check if the referral code exists
    const { data: affiliate, error: affiliateError } = await supabase
      .from("affiliates")
      .select("id, name, email, referral_code")
      .eq("referral_code", referralCode)
      .single()

    if (affiliateError || !affiliate) {
      return {
        success: false,
        error: "Invalid referral code",
        details: affiliateError?.message || "Affiliate not found",
      }
    }

    // Create a test application
    const applicationId = uuidv4()
    const referenceId = `TEST-${Date.now().toString().slice(-6)}`

    const { error: insertError } = await supabase.from("applications").insert({
      id: applicationId,
      reference_id: referenceId,
      business_name: `Test Business ${referenceId}`,
      status: "test",
      affiliate_id: affiliate.id,
      affiliate_code: referralCode,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      funding_amount: "$10,000-$25,000",
      application_data: {
        test: true,
        generated: "automated test",
      },
    })

    if (insertError) {
      return {
        success: false,
        error: "Failed to create test application",
        details: insertError.message,
      }
    }

    // Create a test conversion
    const { error: conversionError } = await supabase.from("affiliate_conversions").insert({
      affiliate_id: affiliate.id,
      application_id: applicationId,
      reference_id: referenceId,
      conversion_type: "test",
      created_at: new Date().toISOString(),
    })

    // Create a test notification
    const { error: notificationError } = await supabase.from("affiliate_notifications").insert({
      id: uuidv4(),
      affiliate_id: affiliate.id,
      type: "test_application",
      application_id: applicationId,
      read: false,
      data: {
        application_reference: referenceId,
        timestamp: new Date().toISOString(),
        test: true,
      },
      created_at: new Date().toISOString(),
    })

    return {
      success: true,
      message: "Test affiliate tracking completed successfully",
      details: {
        affiliate: {
          id: affiliate.id,
          name: affiliate.name,
          email: affiliate.email,
          referral_code: affiliate.referral_code,
        },
        application: {
          id: applicationId,
          reference_id: referenceId,
        },
        conversionError: conversionError?.message,
        notificationError: notificationError?.message,
      },
    }
  } catch (error) {
    console.error("Error in testAffiliateTracking:", error)
    return {
      success: false,
      error: "Failed to test affiliate tracking",
      details: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
