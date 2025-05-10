import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const pathname = req.nextUrl.pathname

  // Only run this middleware for admin routes
  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    const supabase = createMiddlewareClient({ req, res })

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      // Redirect to admin login page
      const url = new URL("/admin", req.url)
      return NextResponse.redirect(url)
    }

    // Check if user is an admin
    const { data: adminData } = await supabase.from("admin_users").select("id").eq("id", session.user.id).single()

    if (!adminData) {
      // Redirect to admin login page
      const url = new URL("/admin", req.url)
      return NextResponse.redirect(url)
    }
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*"],
}
