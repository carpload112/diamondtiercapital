import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { trackApplication } from "@/lib/services/affiliate-tracking-service"

export async function POST(request: NextRequest) {
  try {
    const { applicationId, referralCode } = await request.json()

    if (!applicationId || !referralCode) {
      return NextResponse.json(
        { success: false, error: "Application ID and referral code are required" },
        { status: 400 },
      )
    }

    const supabase = createServerClient()

    // Get application details
    const { data: application, error: appError } = await supabase
      .from("applications")
      .select("reference_id, status, affiliate_id, affiliate_code")
      .eq("id", applicationId)
      .single()

    if (appError) {
      return NextResponse.json({ success: false, error: `Application not found: ${appError.message}` }, { status: 404 })
    }

    // Get affiliate details
    const { data: affiliate, error: affiliateError } = await supabase
      .from("affiliates")
      .select("id, name, status, tier")
      .eq("referral_code", referralCode)
      .single()

    if (affiliateError) {
      return NextResponse.json(
        { success: false, error: `Affiliate not found: ${affiliateError.message}` },
        { status: 404 },
      )
    }

    // Check for existing conversions
    const { data: conversions, error: convError } = await supabase
      .from("affiliate_conversions")
      .select("id, created_at")
      .eq("application_id", applicationId)
      .eq("affiliate_id", affiliate.id)

    // Check for existing commissions
    const { data: commissions, error: commError } = await supabase
      .from("affiliate_commissions")
      .select("id, amount, status, created_at")
      .eq("application_id", applicationId)
      .eq("affiliate_id", affiliate.id)

    // Attempt to track the application
    const trackingResult = await trackApplication(
      applicationId,
      application.reference_id,
      referralCode,
      "100000", // Default amount for testing
    )

    return NextResponse.json({
      success: true,
      diagnostics: {
        application: {
          id: applicationId,
          reference_id: application.reference_id,
          status: application.status,
          affiliate_id: application.affiliate_id,
          affiliate_code: application.affiliate_code,
        },
        affiliate: {
          id: affiliate.id,
          name: affiliate.name,
          status: affiliate.status,
          tier: affiliate.tier,
        },
        conversions: conversions || [],
        commissions: commissions || [],
        trackingResult,
      },
    })
  } catch (error) {
    console.error("Error in debug tracking API:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
