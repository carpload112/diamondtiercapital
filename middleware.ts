import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const pathname = req.nextUrl.pathname

  // Only run this middleware for admin routes
  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    // For now, just pass through all requests
    // We'll implement proper auth checks once the basic build works
    return res
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*"],
}
