"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface AffiliateRealTimeUpdaterProps {
  affiliateId: string
}

export function AffiliateRealTimeUpdater({ affiliateId }: AffiliateRealTimeUpdaterProps) {
  const [hasNewActivity, setHasNewActivity] = useState(false)
  const [lastActivity, setLastActivity] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClientComponentClient()

    // Subscribe to real-time changes for this affiliate
    const channel = supabase
      .channel(`affiliate-${affiliateId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "affiliate_clicks",
          filter: `affiliate_id=eq.${affiliateId}`,
        },
        (payload) => {
          setHasNewActivity(true)
          setLastActivity("New click recorded")
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "applications",
          filter: `affiliate_id=eq.${affiliateId}`,
        },
        (payload) => {
          setHasNewActivity(true)
          setLastActivity("New application submitted")
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "affiliate_commissions",
          filter: `affiliate_id=eq.${affiliateId}`,
        },
        (payload) => {
          setHasNewActivity(true)
          setLastActivity("New commission earned")
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [affiliateId])

  if (!hasNewActivity) return null

  return (
    <div className="mt-2 text-xs text-green-600 animate-pulse">
      <span className="font-medium">New activity:</span> {lastActivity}
    </div>
  )
}
