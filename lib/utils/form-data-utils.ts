// Utility functions for processing form data

/**
 * Maps form field values to more readable display values
 * @param fieldName The name of the form field
 * @param value The raw value from the database
 * @returns Formatted display value
 */
export function formatFieldValue(fieldName: string, value: any): string {
  if (value === null || value === undefined) return "N/A"

  // Handle boolean values
  if (typeof value === "boolean") {
    return value ? "Yes" : "No"
  }

  // Return the value as a string
  return String(value)
}

/**
 * Get a nested value from an object safely
 * @param obj The object to extract from
 * @param path Dot notation path to the property
 * @param defaultValue Default value if not found
 * @returns The value or default if not found
 */
export function getNestedValue(obj: any, path: string, defaultValue: any = "N/A"): any {
  if (!obj) return defaultValue

  try {
    const keys = path.split(".")
    let result = obj

    for (const key of keys) {
      if (result && typeof result === "object" && key in result) {
        result = result[key]
      } else {
        return defaultValue
      }
    }

    // Special handling for boolean values
    if (typeof result === "boolean") {
      return result ? "Yes" : "No"
    }

    return result || defaultValue
  } catch (error) {
    console.error("Error getting nested value:", error)
    return defaultValue
  }
}

/**
 * Form structure definition for organizing data display
 */
export const formStructure = [
  {
    id: "personal",
    title: "Personal Information",
    icon: "User",
    fields: [
      { name: "fullName", label: "Full Name", path: "applicant_details.full_name" },
      { name: "email", label: "Email Address", path: "applicant_details.email" },
      { name: "phone", label: "Phone Number", path: "applicant_details.phone" },
      { name: "preferredContact", label: "Preferred Contact Method", path: "applicant_details.preferred_contact" },
    ],
  },
  {
    id: "business",
    title: "Business Details",
    icon: "Building2",
    fields: [
      { name: "businessName", label: "Business Name", path: "business_details.business_name" },
      { name: "businessType", label: "Business Structure", path: "business_details.business_type" },
      { name: "ein", label: "EIN", path: "business_details.ein" },
      { name: "yearsInBusiness", label: "Years in Business", path: "business_details.years_in_business" },
      { name: "industry", label: "Industry", path: "business_details.industry" },
    ],
  },
  {
    id: "financial-needs",
    title: "Financial Needs",
    icon: "DollarSign",
    fields: [
      { name: "fundingAmount", label: "Desired Funding Amount", path: "funding_requests.funding_amount" },
      { name: "fundingPurpose", label: "Primary Funding Purpose", path: "funding_requests.funding_purpose" },
      { name: "timeframe", label: "Funding Timeframe", path: "funding_requests.timeframe" },
      { name: "collateral", label: "Collateral Available", path: "funding_requests.collateral" },
    ],
  },
  {
    id: "financial-info",
    title: "Financial Information",
    icon: "LineChart",
    fields: [
      { name: "annualRevenue", label: "Annual Business Revenue", path: "business_details.annual_revenue" },
      {
        name: "estimatedMonthlyDeposits",
        label: "Estimated Monthly Deposits",
        path: "business_details.estimated_monthly_deposits",
      },
      { name: "creditScore", label: "Estimated Personal Credit Score", path: "business_details.credit_score" },
      { name: "bankruptcy", label: "Bankruptcy in Last 7 Years", path: "business_details.bankruptcy_history" },
    ],
  },
  {
    id: "additional",
    title: "Additional Information",
    icon: "FileText",
    fields: [
      { name: "hearAboutUs", label: "How They Heard About Us", path: "additional_information.hear_about_us" },
      { name: "additionalInfo", label: "Additional Comments", path: "additional_information.additional_info" },
      { name: "termsAgreed", label: "Terms & Conditions Agreed", path: "additional_information.terms_agreed" },
      { name: "marketingConsent", label: "Marketing Consent", path: "additional_information.marketing_consent" },
    ],
  },
]

/**
 * Organizes application data according to the form structure
 * @param applicationData Raw application data from database
 * @returns Structured data organized by form sections
 */
export function organizeApplicationData(applicationData: any) {
  const organizedData: Record<string, any> = {}

  formStructure.forEach((section) => {
    organizedData[section.id] = {
      title: section.title,
      icon: section.icon,
      fields: section.fields.map((field) => ({
        name: field.name,
        label: field.label,
        value: getNestedValue(applicationData, field.path),
      })),
    }
  })

  return organizedData
}

/**
 * Creates a debug log of all application data
 * @param applicationData Raw application data
 * @returns Formatted debug string
 */
export function createApplicationDataDebugLog(applicationData: any): string {
  const organizedData = organizeApplicationData(applicationData)
  let debugLog = "APPLICATION DATA DEBUG LOG\n\n"

  Object.keys(organizedData).forEach((sectionKey) => {
    const section = organizedData[sectionKey]
    debugLog += `## ${section.title} ##\n`

    section.fields.forEach((field: any) => {
      debugLog += `${field.label}: ${field.value}\n`
    })

    debugLog += "\n"
  })

  return debugLog
}
