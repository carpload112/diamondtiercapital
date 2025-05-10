import { createServerClient } from "../supabase/server"

export async function generateReferralCode(name: string): Promise<string> {
  // Create a base code from the name (first 3 letters + random numbers)
  const baseName = name
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 3)
    .toUpperCase()
  const randomNum = Math.floor(10000 + Math.random() * 90000)
  const baseCode = `${baseName}${randomNum}`

  // Check if this code already exists
  const supabase = createServerClient()
  const { data } = await supabase.from("affiliates").select("referral_code").eq("referral_code", baseCode).single()

  // If it exists, generate a new one recursively
  if (data) {
    return generateReferralCode(name)
  }

  return baseCode
}

export function calculateCommission(amount: number, rate: number): number {
  return Number.parseFloat((amount * (rate / 100)).toFixed(2))
}

export function getAffiliateLink(baseUrl: string, referralCode: string): string {
  const url = new URL(baseUrl)
  url.searchParams.append("ref", referralCode)
  return url.toString()
}

export function extractReferralCode(url: string): string | null {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.searchParams.get("ref")
  } catch (error) {
    return null
  }
}
