"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

interface AffiliateRealTimeUpdaterProps {
  affiliateId: string
}

export function AffiliateRealTimeUpdater({ affiliateId }: AffiliateRealTimeUpdaterProps) {
  const router = useRouter()
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (!affiliateId) return

    // Set up real-time listener for affiliate notifications
    const channel = supabase
      .channel(`affiliate-updates-${affiliateId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "affiliate_notifications",
          filter: `affiliate_id=eq.${affiliateId}`,
        },
        (payload) => {
          console.log("New affiliate notification:", payload)
          setLastUpdate(new Date())

          // Refresh the page data without a full reload
          router.refresh()
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
          console.log("New application for affiliate:", payload)
          setLastUpdate(new Date())

          // Refresh the page data without a full reload
          router.refresh()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [affiliateId, router, supabase])

  if (lastUpdate) {
    return <div className="text-xs text-gray-500 animate-pulse">Data updated {lastUpdate.toLocaleTimeString()}</div>
  }

  return null
}
