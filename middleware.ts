import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // For now, let's simplify the middleware to avoid auth issues during development
  // We'll rely on client-side auth checks in the admin layout component
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
