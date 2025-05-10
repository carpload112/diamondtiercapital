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

// New function to upload bank statements
export async function uploadBankStatement({
  applicationId,
  file,
  monthYear,
  notes,
}: {
  applicationId: string
  file: File
  monthYear: string
  notes?: string
}) {
  const supabase = createServerClient()

  try {
    // Generate a unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `${applicationId}_${monthYear.replace("/", "-")}_${Date.now()}.${fileExt}`
    const filePath = `bank-statements/${fileName}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("application-documents")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) throw uploadError

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage.from("application-documents").getPublicUrl(filePath)

    if (!urlData || !urlData.publicUrl) {
      throw new Error("Failed to get public URL for uploaded file")
    }

    // Insert record into bank_statements table
    const { error: insertError } = await supabase.from("bank_statements").insert({
      application_id: applicationId,
      file_name: file.name,
      file_url: urlData.publicUrl,
      file_type: file.type,
      file_size: file.size,
      month_year: monthYear,
      notes: notes || null,
    })

    if (insertError) throw insertError

    return { success: true, filePath }
  } catch (error) {
    console.error("Error uploading bank statement:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload bank statement",
    }
  }
}

// Function to get bank statements for an application
export async function getBankStatements(applicationId: string) {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase
      .from("bank_statements")
      .select("*")
      .eq("application_id", applicationId)
      .order("month_year", { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching bank statements:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch bank statements",
      data: [],
    }
  }
}

// Function to delete a bank statement
export async function deleteBankStatement(statementId: string) {
  const supabase = createServerClient()

  try {
    // Get the statement to find the file path
    const { data: statement, error: fetchError } = await supabase
      .from("bank_statements")
      .select("file_url")
      .eq("id", statementId)
      .single()

    if (fetchError) throw fetchError

    // Delete from database
    const { error: deleteError } = await supabase.from("bank_statements").delete().eq("id", statementId)

    if (deleteError) throw deleteError

    // Extract file path from URL to delete from storage
    // This is a simplified approach - you might need to adjust based on your URL structure
    if (statement && statement.file_url) {
      const filePath = statement.file_url.split("/").pop()
      if (filePath) {
        await supabase.storage.from("application-documents").remove([`bank-statements/${filePath}`])
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting bank statement:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete bank statement",
    }
  }
}
