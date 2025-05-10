import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Simple server client without cookies
export function createServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createSupabaseClient(supabaseUrl, supabaseKey)
}

// Separate function for cookie-based client
export function createServerSupabaseClient() {
  // For now, just use the regular server client
  // We'll implement cookie handling later when the basic version works
  return createServerClient()
}
