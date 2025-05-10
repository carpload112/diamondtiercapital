"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { createClientClient } from "@/lib/supabase/client"

export function AffiliateTracker() {
  const searchParams = useSearchParams()
  const referralCode = searchParams?.get("ref")

  useEffect(() => {
    // Only track if there's a referral code
    if (referralCode) {
      trackAffiliateClick(referralCode)
    }
  }, [referralCode])

  const trackAffiliateClick = async (code: string) => {
    try {
      // Store the referral code in localStorage for attribution
      localStorage.setItem("affiliate_referral", code)
      localStorage.setItem("affiliate_referral_timestamp", Date.now().toString())

      // Track the click via API
      await fetch("/api/affiliate/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referralCode: code,
          referrerUrl: document.referrer,
        }),
      })

      // Also track in Supabase for redundancy
      const supabase = createClientClient()
      await supabase.from("affiliate_clicks").insert({
        referral_code: code,
        referrer_url: document.referrer || "direct",
        user_agent: navigator.userAgent,
      })
    } catch (error) {
      console.error("Error tracking affiliate click:", error)
    }
  }

  return null // This component doesn't render anything
}
