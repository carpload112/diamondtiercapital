import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Create a simple client function
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    // Return a dummy client that won't crash the app
    return createSupabaseClient("https://placeholder-url.supabase.co", "placeholder-key")
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Export for backward compatibility
export default createClient

// Export for server components
export function createClientClient() {
  return createClient()
}
