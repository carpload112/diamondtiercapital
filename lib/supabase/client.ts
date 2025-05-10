import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Create a simple, reliable client function
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Export for backward compatibility
export const getSupabaseClient = createClient

// Default export
export default createClient

// Named export for server components
export const createClientClient = createClient
