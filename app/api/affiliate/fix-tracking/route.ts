import { NextResponse } from "next/server"
import { fixApplicationsWithReferralCode } from "@/lib/services/affiliate-tracking-service"

export async function POST() {
  try {
    const result = await fixApplicationsWithReferralCode()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in fix-tracking API:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
