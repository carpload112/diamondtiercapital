"use server"

import { createServerClient } from "../supabase/server"

/**
 * Debug utility to check if a referral code is valid
 */
export async function checkAffiliateReferral(referralCode: string) {
  if (!referralCode) {
    return { valid: false, message: "No referral code provided" }
  }

  const supabase = createServerClient()

  try {
    // Get the affiliate from the referral code
    const { data: affiliate, error } = await supabase
      .from("affiliates")
      .select("id, name, email, referral_code, status")
      .eq("referral_code", referralCode)
      .single()

    if (error) {
      console.error("Error finding affiliate with referral code:", referralCode, error)
      return { valid: false, message: "Invalid referral code", error: error.message }
    }

    if (!affiliate) {
      return { valid: false, message: "Affiliate not found" }
    }

    if (affiliate.status !== "active") {
      return { valid: false, message: "Affiliate is not active", affiliate }
    }

    return { valid: true, message: "Valid referral code", affiliate }
  } catch (error) {
    console.error("Error in checkAffiliateReferral:", error)
    return { valid: false, message: "Error checking referral code", error }
  }
}

/**
 * Debug utility to check if an application has an affiliate
 */
export async function checkApplicationAffiliate(applicationId: string) {
  if (!applicationId) {
    return { hasAffiliate: false, message: "No application ID provided" }
  }

  const supabase = createServerClient()

  try {
    // Get the application
    const { data: application, error } = await supabase
      .from("applications")
      .select("id, reference_id, affiliate_id, affiliate_code, status")
      .eq("id", applicationId)
      .single()

    if (error) {
      console.error("Error finding application:", applicationId, error)
      return { hasAffiliate: false, message: "Invalid application ID", error: error.message }
    }

    if (!application) {
      return { hasAffiliate: false, message: "Application not found" }
    }

    if (!application.affiliate_id) {
      return { hasAffiliate: false, message: "Application has no affiliate", application }
    }

    // Get the affiliate
    const { data: affiliate, error: affiliateError } = await supabase
      .from("affiliates")
      .select("id, name, email, referral_code, status")
      .eq("id", application.affiliate_id)
      .single()

    if (affiliateError) {
      console.error("Error finding affiliate:", application.affiliate_id, affiliateError)
      return {
        hasAffiliate: true,
        message: "Application has affiliate ID but affiliate not found",
        application,
        error: affiliateError.message,
      }
    }

    return {
      hasAffiliate: true,
      message: "Application has affiliate",
      application,
      affiliate,
    }
  } catch (error) {
    console.error("Error in checkApplicationAffiliate:", error)
    return { hasAffiliate: false, message: "Error checking application affiliate", error }
  }
}
