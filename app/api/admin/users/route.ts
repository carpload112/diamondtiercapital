import { type NextRequest, NextResponse } from "next/server"
import { getAdminAuth } from "@/lib/firebase-admin"

export async function GET(request: NextRequest) {
  try {
    // Get the auth token from the request headers
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split("Bearer ")[1]
    const auth = getAdminAuth()

    // Verify the token
    const decodedToken = await auth.verifyIdToken(token)

    // Check if the user is an admin
    if (!decodedToken.email?.includes("admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // List users (limited to 100)
    const listUsersResult = await auth.listUsers(100)

    // Return the users
    return NextResponse.json({
      users: listUsersResult.users.map((user) => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        disabled: user.disabled,
      })),
    })
  } catch (error: any) {
    console.error("Error in users API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
