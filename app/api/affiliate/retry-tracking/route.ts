import { type NextRequest, NextResponse } from "next/server"
import { retryTrackApplication } from "@/lib/services/affiliate-tracking-service"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { applicationId, referralCode } = body

    if (!applicationId || !referralCode) {
      return NextResponse.json(
        { success: false, error: "Application ID and referral code are required" },
        { status: 400 },
      )
    }

    // Retry tracking the application
    const result = await retryTrackApplication(applicationId, referralCode)

    if (result.success) {
      // Update the retry record if it exists
      const supabase = createServerClient()
      await supabase
        .from("affiliate_tracking_retries")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("application_id", applicationId)
        .eq("referral_code", referralCode)
        .catch((err) => {
          console.error("Error updating retry record:", err)
          // Don't throw, just log
        })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in retry tracking API:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
