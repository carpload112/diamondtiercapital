import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Simple server client function
export function createServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables")
    // Return a dummy client that won't crash the app
    return createSupabaseClient("https://placeholder-url.supabase.co", "placeholder-key")
  }

  return createSupabaseClient(supabaseUrl, supabaseKey)
}

// Export with a different name to avoid conflicts
export const serverSupabase = createServerClient
