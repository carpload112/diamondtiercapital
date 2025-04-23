import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Clear the session cookie
export async function POST() {
  cookies().delete("session")
  return NextResponse.json({ success: true })
}
