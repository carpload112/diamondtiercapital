import { createClient as supabaseCreateClient } from "@supabase/supabase-js"

// Create a singleton instance for the client
let clientInstance: ReturnType<typeof supabaseCreateClient> | null = null

// Main function to create/get the Supabase client
export function createClientClient() {
  if (clientInstance) return clientInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  clientInstance = supabaseCreateClient(supabaseUrl, supabaseAnonKey)
  return clientInstance
}

// Export an alias to support both naming conventions used in the app
export const createClient = createClientClient
