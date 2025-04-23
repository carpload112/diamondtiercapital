import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getAdminAuth } from "@/lib/firebase-admin"

// Create a session cookie
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()

    if (!idToken) {
      return NextResponse.json({ error: "ID token is required" }, { status: 400 })
    }

    // Verify the ID token
    const auth = getAdminAuth()
    const decodedToken = await auth.verifyIdToken(idToken)

    // Create a session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn })

    // Set the cookie
    cookies().set({
      name: "session",
      value: sessionCookie,
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error creating session:", error)
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}
