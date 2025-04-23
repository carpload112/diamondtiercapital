import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Paths that require authentication
const protectedPaths = ["/admin", "/dashboard", "/profile", "/applynow"]

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((prefix) => path.startsWith(prefix))

  if (!isProtectedPath) {
    return NextResponse.next()
  }

  // Get the session cookie
  const sessionCookie = request.cookies.get("session")?.value

  if (!sessionCookie) {
    // Redirect to login page
    const url = new URL("/login", request.url)
    url.searchParams.set("redirect", path)
    return NextResponse.redirect(url)
  }

  // For now, just check if the cookie exists
  // In production, you would verify the token
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/profile/:path*", "/applynow/:path*"],
}
