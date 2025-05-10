import { type NextRequest, NextResponse } from "next/server"
import { recordAffiliateClick } from "@/lib/supabase/affiliate-actions"

export async function POST(request: NextRequest) {
  try {
    const { referralCode, referrerUrl } = await request.json()

    if (!referralCode) {
      return NextResponse.json({ error: "Referral code is required" }, { status: 400 })
    }

    const ipAddress = request.headers.get("x-forwarded-for") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    const result = await recordAffiliateClick(
      referralCode,
      ipAddress,
      userAgent,
      referrerUrl || request.headers.get("referer") || "direct",
    )

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("Error tracking affiliate click:", error)
    return NextResponse.json({ error: "Failed to track affiliate click" }, { status: 500 })
  }
}
