"use server"

import { createServerClient } from "./server"
import { v4 as uuidv4 } from "uuid"
import { getAffiliateByReferralCode, createCommission } from "./affiliate-actions"
import { calculateCommission } from "../utils/affiliate-utils"

export interface ApplicationFormData {
  // Personal Information
  fullName: string
  email: string
  phone: string
  preferredContact?: string

  // Business Details
  businessName: string
  businessType: string
  ein?: string
  yearsInBusiness: string
  industry: string

  // Financial Information
  annualRevenue?: string
  creditScore?: string
  monthlyProfit?: string
  bankruptcy?: string

  // Financial Needs
  fundingAmount: string
  fundingPurpose: string
  timeframe: string
  collateral?: string

  // Additional Information
  hearAboutUs?: string
  additionalInfo?: string
  termsAgreed: boolean
  marketingConsent?: boolean
  referralCode?: string
}

export async function submitApplication(formData: ApplicationFormData) {
  const supabase = createServerClient()

  try {
    // Generate a unique application ID
    const applicationId = uuidv4()
    const referenceId = `APP${Math.random().toString(36).substring(2, 7).toUpperCase()}`

    // Insert into applications table
    const { error: applicationError } = await supabase.from("applications").insert({
      id: applicationId,
      reference_id: referenceId,
      status: "pending",
      credit_check_completed: false,
      submitted_at: new Date().toISOString(),
      notes: formData.additionalInfo || "",
    })

    if (applicationError) {
      console.error("Error inserting application:", applicationError)
      throw applicationError
    }

    // Insert into applicant_details table
    const { error: applicantError } = await supabase.from("applicant_details").insert({
      application_id: applicationId,
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      preferred_contact: formData.preferredContact || "Email",
    })

    if (applicantError) {
      console.error("Error inserting applicant details:", applicantError)
      throw applicantError
    }

    // Insert into business_details table
    const { error: businessError } = await supabase.from("business_details").insert({
      application_id: applicationId,
      business_name: formData.businessName,
      business_type: formData.businessType,
      industry: formData.industry,
      years_in_business: formData.yearsInBusiness,
      ein: formData.ein || null,
      annual_revenue: formData.annualRevenue || null,
      monthly_profit: formData.monthlyProfit || null,
      credit_score: formData.creditScore || null,
      bankruptcy_history: formData.bankruptcy === "Yes",
    })

    if (businessError) {
      console.error("Error inserting business details:", businessError)
      throw businessError
    }

    // Insert into funding_requests table
    const { error: fundingError } = await supabase.from("funding_requests").insert({
      application_id: applicationId,
      funding_amount: formData.fundingAmount,
      funding_purpose: formData.fundingPurpose,
      timeframe: formData.timeframe,
      collateral: formData.collateral || null,
    })

    if (fundingError) {
      console.error("Error inserting funding request:", fundingError)
      throw fundingError
    }

    // Insert into additional_information table
    const { error: additionalError } = await supabase.from("additional_information").insert({
      application_id: applicationId,
      hear_about_us: formData.hearAboutUs || null,
      additional_info: formData.additionalInfo || null,
      terms_agreed: formData.termsAgreed,
      marketing_consent: formData.marketingConsent || false,
    })

    if (additionalError) {
      console.error("Error inserting additional information:", additionalError)
      throw additionalError
    }

    // Add affiliate tracking if referral code is provided
    if (formData.referralCode) {
      try {
        // Get the affiliate from the referral code
        const { data: affiliate } = await getAffiliateByReferralCode(formData.referralCode)

        if (affiliate) {
          // Update the application with the affiliate ID
          await supabase
            .from("applications")
            .update({
              affiliate_id: affiliate.id,
              affiliate_code: formData.referralCode,
            })
            .eq("id", applicationId)

          // For now, we'll create a pending commission based on a default amount
          // In a real system, this would be calculated based on the actual funding amount
          const defaultCommissionAmount = 1000 // $1000 placeholder
          const { data: tierData } = await supabase
            .from("affiliate_tiers")
            .select("commission_rate")
            .eq("name", affiliate.tier)
            .single()

          const commissionRate = tierData?.commission_rate || 10 // Default 10% if tier not found
          const commissionAmount = calculateCommission(defaultCommissionAmount, commissionRate)

          // Create the commission record
          await createCommission({
            affiliateId: affiliate.id,
            applicationId: applicationId,
            amount: commissionAmount,
            rate: commissionRate,
          })

          // Process MLM commissions if applicable
          const { data: mlmSettings } = await supabase
            .from("affiliate_mlm_settings")
            .select("*")
            .order("level", { ascending: true })

          if (mlmSettings && mlmSettings.length > 0) {
            // Get parent affiliates up to the maximum level in the MLM structure
            const { data: relationships } = await supabase
              .from("affiliate_relationships")
              .select("parent_affiliate_id")
              .eq("child_affiliate_id", affiliate.id)

            if (relationships && relationships.length > 0) {
              for (let i = 0; i < Math.min(relationships.length, mlmSettings.length); i++) {
                const parentId = relationships[i].parent_affiliate_id
                const mlmRate = mlmSettings[i].commission_percentage
                const mlmAmount = calculateCommission(defaultCommissionAmount, mlmRate)

                // Create commission for the parent affiliate
                await createCommission({
                  affiliateId: parentId,
                  applicationId: applicationId,
                  amount: mlmAmount,
                  rate: mlmRate,
                  status: "pending",
                })
              }
            }
          }
        }
      } catch (affiliateError) {
        // Log the error but don't fail the application submission
        console.error("Error processing affiliate:", affiliateError)
      }
    }

    console.log("Application submitted successfully with ID:", applicationId)
    return { success: true, referenceId }
  } catch (error) {
    console.error("Error submitting application:", error)
    return { success: false, error: "Failed to submit application" }
  }
}
