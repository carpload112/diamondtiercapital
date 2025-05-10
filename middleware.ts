import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const ref = searchParams.get("ref")

  // If there's a referral code, store it in a cookie
  if (ref) {
    const response = NextResponse.next()

    // Set a cookie with the referral code that expires in 30 days
    response.cookies.set({
      name: "affiliate_ref",
      value: ref,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      sameSite: "lax",
    })

    // Also track the original landing page
    response.cookies.set({
      name: "affiliate_landing",
      value: pathname,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      sameSite: "lax",
    })

    return response
  }

  return NextResponse.next()
}

// Only run the middleware on specific routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/* (image files)
     * - api/* (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|api).*)",
  ],
}
