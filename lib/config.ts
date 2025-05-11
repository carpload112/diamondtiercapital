/**
 * Application configuration derived from environment variables
 * This centralizes all environment variable access
 */

// Site URLs
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.diamondtiercapital.com"

// Supabase configuration
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// Feature flags
export const ENABLE_AFFILIATE_PROGRAM = process.env.NEXT_PUBLIC_ENABLE_AFFILIATE_PROGRAM === "true"
export const ENABLE_CREDIT_REPAIR = process.env.NEXT_PUBLIC_ENABLE_CREDIT_REPAIR === "true"

// Analytics
export const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
