import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getAffiliateSession } from "@/lib/supabase/affiliate-auth"

// Pages that don't require authentication
const publicRoutes = ["/affiliate/login", "/affiliate/forgot-password", "/affiliate/reset-password"]

export default async function AffiliateLayout({
  children,
}: {
  children: ReactNode
}) {
  // Get the current URL path
  const path = "/affiliate" + (typeof window !== "undefined" ? window.location.pathname.replace("/affiliate", "") : "")

  // Check if this is a public route
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route))

  // If it's not a public route, check for authentication
  if (!isPublicRoute) {
    const session = await getAffiliateSession()

    if (!session) {
      redirect("/affiliate/login")
    }
  }

  return <div>{children}</div>
}
