"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"

interface AffiliateRealTimeUpdaterProps {
  affiliateId: string
}

export function AffiliateRealTimeUpdater({ affiliateId }: AffiliateRealTimeUpdaterProps) {
  const [lastActivity, setLastActivity] = useState<string | null>(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Subscribe to affiliate clicks
    const clicksSubscription = supabase
      .channel(`affiliate-clicks-${affiliateId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "affiliate_clicks",
          filter: `affiliate_id=eq.${affiliateId}`,
        },
        (payload) => {
          setLastActivity("New click recorded")
          setIsActive(true)

          // Reset active state after 5 seconds
          setTimeout(() => {
            setIsActive(false)
          }, 5000)
        },
      )
      .subscribe()

    // Subscribe to affiliate applications
    const applicationsSubscription = supabase
      .channel(`affiliate-applications-${affiliateId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "applications",
          filter: `affiliate_id=eq.${affiliateId}`,
        },
        (payload) => {
          setLastActivity("New application submitted")
          setIsActive(true)

          // Reset active state after 5 seconds
          setTimeout(() => {
            setIsActive(false)
          }, 5000)
        },
      )
      .subscribe()

    // Subscribe to affiliate commissions
    const commissionsSubscription = supabase
      .channel(`affiliate-commissions-${affiliateId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "affiliate_commissions",
          filter: `affiliate_id=eq.${affiliateId}`,
        },
        (payload) => {
          setLastActivity("New commission earned")
          setIsActive(true)

          // Reset active state after 5 seconds
          setTimeout(() => {
            setIsActive(false)
          }, 5000)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(clicksSubscription)
      supabase.removeChannel(applicationsSubscription)
      supabase.removeChannel(commissionsSubscription)
    }
  }, [affiliateId])

  if (!lastActivity) return null

  return (
    <div className="mt-2">
      {isActive && <Badge className="bg-green-100 text-green-800 animate-pulse">{lastActivity}</Badge>}
    </div>
  )
}
