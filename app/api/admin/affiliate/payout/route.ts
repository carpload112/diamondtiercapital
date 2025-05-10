import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { commissionIds } = await request.json()

    if (!commissionIds || !Array.isArray(commissionIds) || commissionIds.length === 0) {
      return NextResponse.json({ error: "Commission IDs are required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Update the commissions to paid status
    const { error } = await supabase
      .from("affiliate_commissions")
      .update({
        status: "paid",
        payout_date: new Date().toISOString(),
      })
      .in("id", commissionIds)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing affiliate payout:", error)
    return NextResponse.json({ error: "Failed to process affiliate payout" }, { status: 500 })
  }
}
