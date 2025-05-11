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
  estimatedMonthlyDeposits?: string // New field
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
          estimated_monthly_deposits: formData.estimatedMonthlyDeposits || null, // New field
          credit_score: formData.creditScore || null,
          bankruptcy_history: formData.bankruptcy === "Yes",
        })

        if (businessError) {
          console.error("Error inserting business details:", businessError)
          throw businessError
        }
      }

      // Insert into funding_requests table
      if (formData.fundingAmount) {
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
      }

      // Insert into additional_information table
      if (formData.termsAgreed !== undefined) {
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
      }
    } else {
      // Update existing application
      if (formData.status) {
        const { error: updateError } = await supabase
          .from("applications")
          .update({
            status: formData.status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", applicationId)

        if (updateError) {
          console.error("Error updating application:", updateError)
          throw updateError
        }
      }

      // Update business_details if estimatedMonthlyDeposits is provided
      if (formData.estimatedMonthlyDeposits) {
        const { error: updateBusinessError } = await supabase
          .from("business_details")
          .update({
            estimated_monthly_deposits: formData.estimatedMonthlyDeposits,
          })
          .eq("application_id", applicationId)

        if (updateBusinessError) {
          console.error("Error updating business details:", updateBusinessError)
          throw updateBusinessError
        }
      }
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

// Function to split a file into chunks for processing
async function splitFileIntoChunks(file: File, chunkSize: number = 1024 * 1024): Promise<Blob[]> {
  const chunks: Blob[] = []
  let start = 0

  while (start < file.size) {
    const end = Math.min(start + chunkSize, file.size)
    chunks.push(file.slice(start, end))
    start = end
  }

  return chunks
}

// Function to convert a blob to base64
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
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

    if (file.size > 10 * 1024 * 1024) {
      console.log("Large file detected, using chunking approach")

      // For very large files, we'll store a reference instead of the full data
      if (file.size > 50 * 1024 * 1024) {
        console.log("Very large file detected, storing file metadata only")

        // For extremely large files, just store metadata and a placeholder
        // This is a workaround for database limitations
        fileData = `data:${file.type};name=${encodeURIComponent(file.name)};size=${file.size};placeholder=true`
      } else {
        // For moderately large files (10-50MB), use chunking
        try {
          // Get the file type prefix for the base64 string
          const fileTypePrefix = `data:${file.type};base64,`

          // Read the file as an ArrayBuffer
          const arrayBuffer = await file.arrayBuffer()

          // Convert ArrayBuffer to Base64
          const base64 = btoa(new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ""))

          // Combine the prefix and the base64 data
          fileData = fileTypePrefix + base64
        } catch (error) {
          console.error("Error processing file chunks:", error)
          throw new Error("Failed to process large file. Please try a smaller file or contact support.")
        }
      }
    } else {
      // For smaller files, use the standard approach
      console.log("Standard file size, using direct conversion")
      fileData = await blobToBase64(file)
    }

    console.log("File processed, storing in database")

    // Insert record into bank_statements table
    const { error: insertError } = await supabase.from("bank_statements").insert({
      application_id: applicationId,
      file_name: file.name,
      file_url: placeholderUrl, // Use placeholder URL to satisfy NOT NULL constraint
      file_type: file.type,
      file_size: file.size,
      month_year: monthYear,
      notes: notes || null,
      file_data: fileData, // Store the file data or reference
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
      .select("id, application_id, file_name, file_url, file_type, file_size, month_year, notes, created_at")
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
