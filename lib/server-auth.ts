import { cookies } from "next/headers"

/**
 * Server-side function to check admin authentication
 * Uses cookies to verify authentication status
 */
export async function checkAdminAuth() {
  const cookieStore = cookies()
  const authCookie = cookieStore.get("admin-auth")

  if (!authCookie || !authCookie.value) {
    throw new Error("Unauthorized: Admin authentication required")
  }

  try {
    const authData = JSON.parse(decodeURIComponent(authCookie.value))
    const isAuthenticated = authData?.state?.isAuthenticated

    if (!isAuthenticated) {
      throw new Error("Unauthorized: Admin authentication required")
    }

    return true
  } catch (error) {
    throw new Error("Unauthorized: Admin authentication required")
  }
}
