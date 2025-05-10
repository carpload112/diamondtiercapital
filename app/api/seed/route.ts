import { NextResponse } from "next/server"
import { seedDemoData } from "@/lib/supabase/seed-data"

export async function GET() {
  try {
    const result = await seedDemoData()

    if (result.success) {
      return NextResponse.json({ message: result.message || "Data seeded successfully" })
    } else {
      return NextResponse.json({ error: result.error || "Failed to seed data" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in seed route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
