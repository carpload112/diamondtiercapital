"use server"

import { createServerClient } from "./server"
import { v4 as uuidv4 } from "uuid"

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
      status: "pending",
      reference_id: referenceId,
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

    console.log("Application submitted successfully with ID:", applicationId)
    return { success: true, referenceId }
  } catch (error) {
    console.error("Error submitting application:", error)
    return { success: false, error: "Failed to submit application" }
  }
}
