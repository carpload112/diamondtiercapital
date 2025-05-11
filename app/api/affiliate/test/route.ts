import { type NextRequest, NextResponse } from "next/server"
import { testAffiliateTracking } from "@/lib/utils/affiliate-testing"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { referralCode } = body

    if (!referralCode) {
      return NextResponse.json({ error: "Referral code is required" }, { status: 400 })
    }

    const result = await testAffiliateTracking(referralCode)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in affiliate test API:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
