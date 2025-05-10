import { createServerClient } from "./server"

// Use this in server actions that don't need cookies
export function getSupabaseForServerAction() {
  return createServerClient()
}
