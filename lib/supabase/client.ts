import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a single supabase client for browser-side usage
let supabaseClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

// This is the function that was missing - export createClient for backward compatibility
export function createClient() {
  return getSupabaseClient()
}

export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  // Create a singleton to avoid multiple instances
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }

  return supabaseClient
}

export function createClientClient() {
  return createClient() // Use the createClient function for consistency
}

// Also export as default for modules that use default import
export default createClient
