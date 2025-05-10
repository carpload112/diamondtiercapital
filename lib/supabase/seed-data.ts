import { createServerClient } from "./server"

export async function seedDemoData() {
  try {
    const supabase = createServerClient()

    // Sample applications
    const applications = [
      {
        id: "550e8400-e29b-41d4-a716-446655440000",
        reference_id: "APP-001",
        status: "pending",
        credit_check_completed: false,
        submitted_at: new Date().toISOString(),
        notes: "Initial application",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        reference_id: "APP-002",
        status: "approved",
        credit_check_completed: true,
        submitted_at: new Date().toISOString(),
        notes: "Approved with conditions",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        reference_id: "APP-003",
        status: "rejected",
        credit_check_completed: true,
        submitted_at: new Date().toISOString(),
        notes: "Credit score too low",
      },
    ]

    // Insert applications
    const { error: applicationsError } = await supabase.from("applications").upsert(applications, { onConflict: "id" })

    if (applicationsError) {
      console.error("Error seeding applications:", applicationsError)
      return { success: false, error: applicationsError.message }
    }

    // Sample applicant details
    const applicantDetails = [
      {
        application_id: "550e8400-e29b-41d4-a716-446655440000",
        full_name: "John Doe",
        email: "john.doe@example.com",
        phone: "555-123-4567",
        preferred_contact: "Email",
      },
      {
        application_id: "550e8400-e29b-41d4-a716-446655440001",
        full_name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "555-987-6543",
        preferred_contact: "Phone",
      },
      {
        application_id: "550e8400-e29b-41d4-a716-446655440002",
        full_name: "Bob Johnson",
        email: "bob.johnson@example.com",
        phone: "555-456-7890",
        preferred_contact: "Email",
      },
    ]

    // Insert applicant details
    const { error: applicantDetailsError } = await supabase
      .from("applicant_details")
      .upsert(applicantDetails, { onConflict: "application_id" })

    if (applicantDetailsError) {
      console.error("Error seeding applicant details:", applicantDetailsError)
      return { success: false, error: applicantDetailsError.message }
    }

    // Sample business details
    const businessDetails = [
      {
        application_id: "550e8400-e29b-41d4-a716-446655440000",
        business_name: "Acme Corp",
        business_type: "LLC",
        industry: "Technology",
        years_in_business: "1-3",
        ein: "12-3456789",
        annual_revenue: "$100,000-$500,000",
        monthly_profit: "$10,000-$50,000",
        credit_score: "Good (670-739)",
        bankruptcy_history: false,
      },
      {
        application_id: "550e8400-e29b-41d4-a716-446655440001",
        business_name: "Smith Consulting",
        business_type: "Sole Proprietorship",
        industry: "Consulting",
        years_in_business: "3-5",
        ein: "98-7654321",
        annual_revenue: "$500,000-$1,000,000",
        monthly_profit: "$50,000-$100,000",
        credit_score: "Excellent (740+)",
        bankruptcy_history: false,
      },
      {
        application_id: "550e8400-e29b-41d4-a716-446655440002",
        business_name: "Johnson Retail",
        business_type: "Corporation",
        industry: "Retail",
        years_in_business: "Less than 1",
        ein: "45-6789123",
        annual_revenue: "Less than $100,000",
        monthly_profit: "Less than $10,000",
        credit_score: "Fair (580-669)",
        bankruptcy_history: true,
      },
    ]

    // Insert business details
    const { error: businessDetailsError } = await supabase
      .from("business_details")
      .upsert(businessDetails, { onConflict: "application_id" })

    if (businessDetailsError) {
      console.error("Error seeding business details:", businessDetailsError)
      return { success: false, error: businessDetailsError.message }
    }

    // Sample funding requests
    const fundingRequests = [
      {
        application_id: "550e8400-e29b-41d4-a716-446655440000",
        funding_amount: "$50,000-$100,000",
        funding_purpose: "Equipment Purchase",
        timeframe: "1-3 months",
        collateral: "Equipment",
      },
      {
        application_id: "550e8400-e29b-41d4-a716-446655440001",
        funding_amount: "$100,000-$250,000",
        funding_purpose: "Working Capital",
        timeframe: "Immediately",
        collateral: "None",
      },
      {
        application_id: "550e8400-e29b-41d4-a716-446655440002",
        funding_amount: "Less than $50,000",
        funding_purpose: "Inventory",
        timeframe: "3-6 months",
        collateral: "Inventory",
      },
    ]

    // Insert funding requests
    const { error: fundingRequestsError } = await supabase
      .from("funding_requests")
      .upsert(fundingRequests, { onConflict: "application_id" })

    if (fundingRequestsError) {
      console.error("Error seeding funding requests:", fundingRequestsError)
      return { success: false, error: fundingRequestsError.message }
    }

    // Sample additional information
    const additionalInformation = [
      {
        application_id: "550e8400-e29b-41d4-a716-446655440000",
        hear_about_us: "Google Search",
        additional_info: "Looking for quick funding",
        terms_agreed: true,
        marketing_consent: true,
      },
      {
        application_id: "550e8400-e29b-41d4-a716-446655440001",
        hear_about_us: "Referral",
        additional_info: "Need funding for expansion",
        terms_agreed: true,
        marketing_consent: false,
      },
      {
        application_id: "550e8400-e29b-41d4-a716-446655440002",
        hear_about_us: "Social Media",
        additional_info: "Urgent funding needed",
        terms_agreed: true,
        marketing_consent: true,
      },
    ]

    // Insert additional information
    const { error: additionalInfoError } = await supabase
      .from("additional_information")
      .upsert(additionalInformation, { onConflict: "application_id" })

    if (additionalInfoError) {
      console.error("Error seeding additional information:", additionalInfoError)
      return { success: false, error: additionalInfoError.message }
    }

    // Sample affiliates
    const affiliates = [
      {
        id: "550e8400-e29b-41d4-a716-446655440010",
        name: "John Partner",
        email: "john.partner@example.com",
        referral_code: "JOHN10",
        tier: "standard",
        status: "active",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440011",
        name: "Sarah Partner",
        email: "sarah.partner@example.com",
        referral_code: "SARAH15",
        tier: "premium",
        status: "active",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440012",
        name: "Mike Partner",
        email: "mike.partner@example.com",
        referral_code: "MIKE20",
        tier: "elite",
        status: "inactive",
      },
    ]

    // Insert affiliates
    const { error: affiliatesError } = await supabase.from("affiliates").upsert(affiliates, { onConflict: "id" })

    if (affiliatesError) {
      console.error("Error seeding affiliates:", affiliatesError)
      return { success: false, error: affiliatesError.message }
    }

    return { success: true, message: "Demo data seeded successfully" }
  } catch (error) {
    console.error("Error in seedDemoData:", error)
    return { success: false, error: "Internal server error" }
  }
}
