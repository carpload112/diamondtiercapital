"use server"

import { createServerClient } from "./server"
import { v4 as uuidv4 } from "uuid"

export async function seedDemoData() {
  const supabase = createServerClient()

  try {
    // Check if we already have data
    const { count } = await supabase.from("applications").select("*", { count: "exact", head: true })

    // If we already have applications, don't seed
    if (count && count > 0) {
      return { success: true, message: "Data already exists" }
    }

    // Create demo affiliates
    const affiliates = [
      {
        id: uuidv4(),
        name: "John Smith",
        email: "john@example.com",
        referral_code: "JOSM1234",
        tier: "standard",
        status: "active",
      },
      {
        id: uuidv4(),
        name: "Sarah Johnson",
        email: "sarah@example.com",
        referral_code: "SAJO5678",
        tier: "premium",
        status: "active",
      },
    ]

    // Insert affiliates
    const { error: affiliateError } = await supabase.from("affiliates").insert(affiliates)

    if (affiliateError) throw affiliateError

    // Create demo applications
    const applications = [
      {
        id: uuidv4(),
        reference_id: "APP12345",
        status: "pending",
        credit_check_completed: false,
        submitted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Looking for working capital",
        affiliate_id: affiliates[0].id,
        affiliate_code: affiliates[0].referral_code,
      },
      {
        id: uuidv4(),
        reference_id: "APP67890",
        status: "approved",
        credit_check_completed: true,
        submitted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Approved for $100,000 SBA loan",
        affiliate_id: affiliates[1].id,
        affiliate_code: affiliates[1].referral_code,
      },
      {
        id: uuidv4(),
        reference_id: "APP24680",
        status: "in_review",
        credit_check_completed: true,
        submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Waiting for additional documentation",
      },
    ]

    // Insert applications
    const { error: appError } = await supabase.from("applications").insert(applications)

    if (appError) throw appError

    // Add applicant details for each application
    const applicantDetails = [
      {
        application_id: applications[0].id,
        full_name: "Michael Brown",
        email: "michael@example.com",
        phone: "(555) 123-4567",
        preferred_contact: "Email",
      },
      {
        application_id: applications[1].id,
        full_name: "Jessica Williams",
        email: "jessica@example.com",
        phone: "(555) 987-6543",
        preferred_contact: "Phone",
      },
      {
        application_id: applications[2].id,
        full_name: "David Miller",
        email: "david@example.com",
        phone: "(555) 456-7890",
        preferred_contact: "Email",
      },
    ]

    const { error: applicantError } = await supabase.from("applicant_details").insert(applicantDetails)

    if (applicantError) throw applicantError

    // Add business details for each application
    const businessDetails = [
      {
        application_id: applications[0].id,
        business_name: "Brown's Consulting",
        business_type: "LLC",
        industry: "Professional Services",
        years_in_business: "1-2 years",
        ein: "12-3456789",
        annual_revenue: "$100,000 - $250,000",
        credit_score: "Good (700-749)",
        bankruptcy_history: false,
      },
      {
        application_id: applications[1].id,
        business_name: "Jessica's Bakery",
        business_type: "Sole Proprietorship",
        industry: "Food & Beverage",
        years_in_business: "3-5 years",
        annual_revenue: "$250,000 - $500,000",
        credit_score: "Excellent (750+)",
        bankruptcy_history: false,
      },
      {
        application_id: applications[2].id,
        business_name: "Miller Tech Solutions",
        business_type: "Corporation",
        industry: "Technology",
        years_in_business: "Less than 1 year",
        annual_revenue: "Under $100,000",
        credit_score: "Fair (650-699)",
        bankruptcy_history: false,
      },
    ]

    const { error: businessError } = await supabase.from("business_details").insert(businessDetails)

    if (businessError) throw businessError

    // Add funding requests for each application
    const fundingRequests = [
      {
        application_id: applications[0].id,
        funding_amount: "$50,000 - $100,000",
        funding_purpose: "Working Capital",
        timeframe: "Immediate (0-30 days)",
        collateral: "No",
      },
      {
        application_id: applications[1].id,
        funding_amount: "$100,000 - $250,000",
        funding_purpose: "Business Expansion",
        timeframe: "Medium-term (3-6 months)",
        collateral: "Yes",
      },
      {
        application_id: applications[2].id,
        funding_amount: "Under $50,000",
        funding_purpose: "Equipment Purchase",
        timeframe: "Short-term (1-3 months)",
        collateral: "Not Sure",
      },
    ]

    const { error: fundingError } = await supabase.from("funding_requests").insert(fundingRequests)

    if (fundingError) throw fundingError

    // Add additional information for each application
    const additionalInfo = [
      {
        application_id: applications[0].id,
        hear_about_us: "Search Engine",
        additional_info: "Looking to expand operations to a new location",
        terms_agreed: true,
        marketing_consent: true,
      },
      {
        application_id: applications[1].id,
        hear_about_us: "Referral",
        additional_info: "Need funding to purchase new equipment and hire staff",
        terms_agreed: true,
        marketing_consent: false,
      },
      {
        application_id: applications[2].id,
        hear_about_us: "Social Media",
        additional_info: "Startup looking for initial funding",
        terms_agreed: true,
        marketing_consent: true,
      },
    ]

    const { error: infoError } = await supabase.from("additional_information").insert(additionalInfo)

    if (infoError) throw infoError

    // Create commissions for the affiliate applications
    const commissions = [
      {
        affiliate_id: affiliates[0].id,
        application_id: applications[0].id,
        amount: 500,
        rate: 10,
        status: "pending",
      },
      {
        affiliate_id: affiliates[1].id,
        application_id: applications[1].id,
        amount: 1500,
        rate: 15,
        status: "paid",
        payout_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    const { error: commissionError } = await supabase.from("affiliate_commissions").insert(commissions)

    if (commissionError) throw commissionError

    return { success: true, message: "Demo data seeded successfully" }
  } catch (error) {
    console.error("Error seeding demo data:", error)
    return { success: false, error: "Failed to seed demo data" }
  }
}
