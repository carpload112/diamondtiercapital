"use server"

import { createServerClient } from "./server"
import { v4 as uuidv4 } from "uuid"
import { affiliateTrackingService } from "../services/affiliate-tracking-service"

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
  estimatedMonthlyDeposits?: string
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
  ref?: string // Support both referralCode and ref parameters

  // For updates
  applicationId?: string
  status?: string
}

export async function submitApplication(formData: ApplicationFormData) {
  const supabase = createServerClient()

  try {
    // Check if this is an update to an existing application
    const isUpdate = !!formData.applicationId

    // Generate a unique application ID if not updating
    const applicationId = formData.applicationId || uuidv4()
    const referenceId = `APP${Math.random().toString(36).substring(2, 7).toUpperCase()}`

    // Log the form data for debugging
    console.log("Submit application form data:", formData)

    if (!isUpdate) {
      // Insert into applications table
      const { error: applicationError } = await supabase.from("applications").insert({
        id: applicationId,
        reference_id: referenceId,
        status: formData.status || "draft", // Default to draft instead of pending
        credit_check_completed: false,
        submitted_at: new Date().toISOString(),
        notes: formData.additionalInfo || "",
      })

      if (applicationError) {
        console.error("Error inserting application:", applicationError)
        throw applicationError
      }

      // Insert into applicant_details table
      if (formData.fullName && formData.email) {
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
      }

      // Insert into business_details table
      if (formData.businessName) {
        const { error: businessError } = await supabase.from("business_details").insert({
          application_id: applicationId,
          business_name: formData.businessName,
          business_type: formData.businessType,
          industry: formData.industry,
          years_in_business: formData.yearsInBusiness,
          ein: formData.ein || null,
          annual_revenue: formData.annualRevenue || null,
          estimated_monthly_deposits: formData.estimatedMonthlyDeposits || null,
          credit_score: formData.creditScore || null,
          bankruptcy_history: formData.bankruptcy === "Yes",
        })

        if (businessError) {
          console.error("Error inserting business details:", businessError)
          throw businessError
        }
      }

      // Insert into funding_requests table - ALWAYS insert if we have any funding data
      if (formData.fundingAmount || formData.fundingPurpose || formData.timeframe || formData.collateral) {
        console.log("Inserting funding request with data:", {
          fundingAmount: formData.fundingAmount,
          fundingPurpose: formData.fundingPurpose,
          timeframe: formData.timeframe,
          collateral: formData.collateral,
        })

        const { data: fundingData, error: fundingError } = await supabase
          .from("funding_requests")
          .insert({
            application_id: applicationId,
            funding_amount: formData.fundingAmount || null,
            funding_purpose: formData.fundingPurpose || null,
            timeframe: formData.timeframe || null,
            collateral: formData.collateral || null,
          })
          .select()

        if (fundingError) {
          console.error("Error inserting funding request:", fundingError)
          throw fundingError
        }

        console.log("Funding request inserted successfully:", fundingData)
      } else {
        console.log("No funding request data to insert")
      }

      // Insert into additional_information table
      const { error: additionalError } = await supabase.from("additional_information").insert({
        application_id: applicationId,
        hear_about_us: formData.hearAboutUs || null,
        additional_info: formData.additionalInfo || null,
        terms_agreed: formData.termsAgreed || false,
        marketing_consent: formData.marketingConsent || false,
      })

      if (additionalError) {
        console.error("Error inserting additional information:", additionalError)
        throw additionalError
      }
    } else {
      // Update existing application
      const { error: updateError } = await supabase
        .from("applications")
        .update({
          status: formData.status,
          updated_at: new Date().toISOString(),
          notes: formData.additionalInfo || null,
        })
        .eq("id", applicationId)

      if (updateError) {
        console.error("Error updating application:", updateError)
        throw updateError
      }

      // Update funding_requests if any funding data is provided
      if (formData.fundingAmount || formData.fundingPurpose || formData.timeframe || formData.collateral) {
        console.log("Updating funding request with data:", {
          fundingAmount: formData.fundingAmount,
          fundingPurpose: formData.fundingPurpose,
          timeframe: formData.timeframe,
          collateral: formData.collateral,
        })

        // Check if funding request exists
        const { data: existingFunding, error: checkError } = await supabase
          .from("funding_requests")
          .select("id")
          .eq("application_id", applicationId)
          .maybeSingle()

        if (checkError) {
          console.error("Error checking existing funding request:", checkError)
          throw checkError
        }

        if (existingFunding) {
          // Update existing funding request
          const { data: updatedFunding, error: updateFundingError } = await supabase
            .from("funding_requests")
            .update({
              funding_amount: formData.fundingAmount || null,
              funding_purpose: formData.fundingPurpose || null,
              timeframe: formData.timeframe || null,
              collateral: formData.collateral || null,
            })
            .eq("application_id", applicationId)
            .select()

          if (updateFundingError) {
            console.error("Error updating funding request:", updateFundingError)
            throw updateFundingError
          }

          console.log("Funding request updated successfully:", updatedFunding)
        } else {
          // Insert new funding request
          const { data: newFunding, error: insertFundingError } = await supabase
            .from("funding_requests")
            .insert({
              application_id: applicationId,
              funding_amount: formData.fundingAmount || null,
              funding_purpose: formData.fundingPurpose || null,
              timeframe: formData.timeframe || null,
              collateral: formData.collateral || null,
            })
            .select()

          if (insertFundingError) {
            console.error("Error inserting funding request during update:", insertFundingError)
            throw insertFundingError
          }

          console.log("New funding request inserted during update:", newFunding)
        }
      }

      // Update business_details
      if (formData.annualRevenue || formData.estimatedMonthlyDeposits || formData.creditScore) {
        const updateData: any = {}

        if (formData.annualRevenue) updateData.annual_revenue = formData.annualRevenue
        if (formData.estimatedMonthlyDeposits) updateData.estimated_monthly_deposits = formData.estimatedMonthlyDeposits
        if (formData.creditScore) updateData.credit_score = formData.creditScore
        if (formData.bankruptcy) updateData.bankruptcy_history = formData.bankruptcy === "Yes"

        const { error: updateBusinessError } = await supabase
          .from("business_details")
          .update(updateData)
          .eq("application_id", applicationId)

        if (updateBusinessError) {
          console.error("Error updating business details:", updateBusinessError)
          throw updateBusinessError
        }
      }

      // Update additional_information
      if (
        formData.hearAboutUs ||
        formData.additionalInfo !== undefined ||
        formData.termsAgreed !== undefined ||
        formData.marketingConsent !== undefined
      ) {
        const updateData: any = {}

        if (formData.hearAboutUs) updateData.hear_about_us = formData.hearAboutUs
        if (formData.additionalInfo !== undefined) updateData.additional_info = formData.additionalInfo
        if (formData.termsAgreed !== undefined) updateData.terms_agreed = formData.termsAgreed
        if (formData.marketingConsent !== undefined) updateData.marketing_consent = formData.marketingConsent

        const { error: updateAdditionalError } = await supabase
          .from("additional_information")
          .update(updateData)
          .eq("application_id", applicationId)

        if (updateAdditionalError) {
          console.error("Error updating additional information:", updateAdditionalError)
          throw updateAdditionalError
        }
      }
    }

    // Process affiliate tracking if referral code is provided
    // Support both referralCode and ref parameters
    const referralCode = formData.referralCode || formData.ref
    if (referralCode) {
      try {
        // Use the new affiliate tracking service
        const trackingResult = await affiliateTrackingService.trackApplication(
          applicationId,
          referenceId,
          referralCode,
          formData.fundingAmount,
        )

        if (!trackingResult.success) {
          console.warn("Affiliate tracking warning:", trackingResult.error)
          // Continue with application submission even if affiliate tracking fails
        }
      } catch (affiliateError) {
        // Log the error but don't fail the application submission
        console.error("Error processing affiliate:", affiliateError)
      }
    }

    console.log("Application submitted successfully with ID:", applicationId)
    return {
      success: true,
      referenceId,
      applicationId,
    }
  } catch (error) {
    console.error("Error submitting application:", error)
    return { success: false, error: "Failed to submit application" }
  }
}

// Bank statement upload function with chunking for large files
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
    console.log(
      `Starting bank statement upload for application: ${applicationId}, file size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
    )

    // Validate inputs
    if (!applicationId) {
      throw new Error("Application ID is required")
    }

    if (!file) {
      throw new Error("File is required")
    }

    if (!monthYear) {
      throw new Error("Month/Year is required")
    }

    // Check if the application exists
    const { data: applicationExists, error: applicationCheckError } = await supabase
      .from("applications")
      .select("id")
      .eq("id", applicationId)
      .single()

    if (applicationCheckError || !applicationExists) {
      console.error("Application not found:", applicationCheckError)
      throw new Error("Invalid application ID. Please try again.")
    }

    // Generate a unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `${applicationId}_${monthYear.replace("/", "-")}_${Date.now()}.${fileExt}`

    // Create a placeholder URL since file_url cannot be null
    const placeholderUrl = `placeholder://${fileName}`

    // For files larger than 10MB, use a chunking approach
    let fileData: string

    // Read the file as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // Convert ArrayBuffer to Base64
    const base64 = btoa(new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ""))

    // Combine the prefix and the base64 data
    fileData = `data:${file.type};base64,${base64}`

    console.log("File processed, storing in database")

    // Insert record into bank_statements table with timestamp
    const now = new Date().toISOString()
    const { error: insertError } = await supabase.from("bank_statements").insert({
      application_id: applicationId,
      file_name: file.name,
      file_url: placeholderUrl, // Use placeholder URL to satisfy NOT NULL constraint
      file_type: file.type,
      file_size: file.size,
      month_year: monthYear,
      notes: notes || null,
      file_data: fileData, // Store the file data or reference
      uploaded_at: now, // Add a timestamp since created_at doesn't exist
    })

    if (insertError) {
      console.error("Database insert error:", insertError)

      // Check for specific error types
      if (insertError.message?.includes("too large") || insertError.message?.includes("exceeds")) {
        throw new Error("File is too large for the database. Please try a smaller file or contact support.")
      }

      throw insertError
    }

    console.log("Bank statement record created successfully")
    return { success: true, filePath: placeholderUrl }
  } catch (error) {
    console.error("Error uploading bank statement:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to upload bank statement. The file may be too large for our system.",
    }
  }
}

// Function to get bank statements for an application
export async function getBankStatements(applicationId: string) {
  const supabase = createServerClient()

  try {
    // Don't select file_data to avoid large data transfer
    const { data, error } = await supabase
      .from("bank_statements")
      .select("id, application_id, file_name, file_url, file_type, file_size, month_year, notes, uploaded_at")
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

// Function to get a specific bank statement with file data
export async function getBankStatementWithData(statementId: string) {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.from("bank_statements").select("*").eq("id", statementId).single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching bank statement:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch bank statement",
      data: null,
    }
  }
}

// Function to delete a bank statement
export async function deleteBankStatement(statementId: string) {
  const supabase = createServerClient()

  try {
    // Delete from database
    const { error: deleteError } = await supabase.from("bank_statements").delete().eq("id", statementId)

    if (deleteError) throw deleteError

    return { success: true }
  } catch (error) {
    console.error("Error deleting bank statement:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete bank statement",
    }
  }
}
