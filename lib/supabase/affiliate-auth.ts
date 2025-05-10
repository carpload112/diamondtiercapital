import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { Session } from "@supabase/supabase-js"

// Get the current affiliate session
export async function getAffiliateSession(): Promise<Session | null> {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

// Get the current affiliate user
export async function getAffiliateUser() {
  const supabase = createServerClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    return null
  }

  // Check if the user is an affiliate
  const { data: affiliate, error: affiliateError } = await supabase
    .from("affiliates")
    .select("*")
    .eq("email", data.user.email)
    .single()

  if (affiliateError || !affiliate) {
    return null
  }

  return {
    user: data.user,
    affiliate,
  }
}

// Check if the user is authenticated as an affiliate
export async function requireAffiliateAuth() {
  const session = await getAffiliateSession()

  if (!session) {
    redirect("/affiliate/login")
  }

  // Check if the user is an affiliate by querying the affiliates table
  const supabase = createServerClient()
  const { data: affiliate, error } = await supabase
    .from("affiliates")
    .select("id")
    .eq("user_id", session.user.id)
    .single()

  if (error || !affiliate) {
    // User is authenticated but not an affiliate
    redirect("/affiliate-program")
  }

  return {
    session,
    userId: session.user.id,
  }
}

// Get the current affiliate data
export async function getCurrentAffiliate() {
  const { userId } = await requireAffiliateAuth()

  const supabase = createServerClient()
  const { data: affiliate, error } = await supabase
    .from("affiliates")
    .select(`
      *,
      tier:affiliate_tiers(*)
    `)
    .eq("user_id", userId)
    .single()

  if (error || !affiliate) {
    redirect("/affiliate/login")
  }

  return affiliate
}

// Sign out the affiliate
export async function signOutAffiliate() {
  const supabase = createServerClient()
  await supabase.auth.signOut()
  cookies().delete("affiliate_session")
}
