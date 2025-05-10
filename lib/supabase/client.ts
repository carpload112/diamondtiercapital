import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Create a simple client function that doesn't rely on complex patterns
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Export additional functions that use the base function
export function createClientClient() {
  return createClient()
}

// Default export for modules that use default import
export default createClient
