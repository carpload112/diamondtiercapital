"use server"

import { createServerClient } from "./server"
import { organizeApplicationData, createApplicationDataDebugLog } from "../utils/form-data-utils"

/**
 * Validates if a string is a valid UUID
 * @param id The string to validate
 * @returns Boolean indicating if the string is a valid UUID
 */
function isValidUUID(id: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

/**
 * Fetches complete application details including all related data
 * @param applicationId The ID of the application to fetch
 * @returns Complete application data with all related tables
 */
export async function getApplicationDetails(applicationId: string) {
  // Validate that the ID is a valid UUID
  if (!isValidUUID(applicationId)) {
    console.error(`Invalid UUID format: ${applicationId}`)
    return {
      success: false,
      error: "Invalid application ID format",
    }
  }

  const supabase = createServerClient()

  try {
    console.log(`Fetching application details for ID: ${applicationId}`)

    // Get the application data
    const { data: appData, error: appError } = await supabase
      .from("applications")
      .select("*")
      .eq("id", applicationId)
      .single()

    if (appError) {
      console.error("Error fetching application:", appError)
      throw appError
    }

    // Get applicant details
    const { data: applicantData, error: applicantError } = await supabase
      .from("applicant_details")
      .select("*")
      .eq("application_id", applicationId)
      .single()

    if (applicantError && applicantError.code !== "PGRST116") {
      console.error("Error fetching applicant details:", applicantError)
    }

    // Get business details
    const { data: businessData, error: businessError } = await supabase
      .from("business_details")
      .select("*")
      .eq("application_id", applicationId)
      .single()

    if (businessError && businessError.code !== "PGRST116") {
      console.error("Error fetching business details:", businessError)
    }

    // Get funding requests
    const { data: fundingData, error: fundingError } = await supabase
      .from("funding_requests")
      .select("*")
      .eq("application_id", applicationId)
      .single()

    if (fundingError && fundingError.code !== "PGRST116") {
      console.error("Error fetching funding requests:", fundingError)
    }

    // Get additional information
    const { data: additionalData, error: additionalError } = await supabase
      .from("additional_information")
      .select("*")
      .eq("application_id", applicationId)
      .single()

    if (additionalError && additionalError.code !== "PGRST116") {
      console.error("Error fetching additional information:", additionalError)
    }

    // Get bank statements (metadata only)
    const { data: bankStatements, error: bankStatementsError } = await supabase
      .from("bank_statements")
      .select("id, file_name, file_type, file_size, month_year, notes, uploaded_at")
      .eq("application_id", applicationId)
      .order("month_year", { ascending: false })

    if (bankStatementsError) {
      console.error("Error fetching bank statements:", bankStatementsError)
    }

    // Combine all data
    const combinedData = {
      ...appData,
      applicant_details: applicantData || {},
      business_details: businessData || {},
      funding_requests: fundingData || {},
      additional_information: additionalData || {},
      bank_statements: bankStatements || [],
    }

    // Create debug log
    const debugLog = createApplicationDataDebugLog(combinedData)
    console.log(debugLog)

    // Organize data according to form structure
    const organizedData = organizeApplicationData(combinedData)

    return {
      success: true,
      rawData: combinedData,
      organizedData,
      debugLog,
    }
  } catch (error) {
    console.error("Error in getApplicationDetails:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch application details",
    }
  }
}
