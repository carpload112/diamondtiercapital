"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertCircle } from "lucide-react"

interface AffiliateRealTimeUpdaterProps {
  affiliateId: string
}

export function AffiliateRealTimeUpdater({ affiliateId }: AffiliateRealTimeUpdaterProps) {
  const router = useRouter()
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [notificationCount, setNotificationCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const supabase = createClientComponentClient()

  // Get initial notification count
  useEffect(() => {
    async function fetchNotificationCount() {
      if (!affiliateId) return

      try {
        console.log(`Fetching notification count for affiliate ${affiliateId}`)
        const { count, error } = await supabase
          .from("affiliate_notifications")
          .select("id", { count: "exact", head: true })
          .eq("affiliate_id", affiliateId)
          .eq("read", false)

        if (error) {
          console.error("Error fetching notification count:", error)
          return
        }

        console.log(`Found ${count} unread notifications for affiliate ${affiliateId}`)
        setNotificationCount(count || 0)
      } catch (error) {
        console.error("Error in fetchNotificationCount:", error)
      }
    }

    fetchNotificationCount()
  }, [affiliateId, supabase])

  useEffect(() => {
    if (!affiliateId) return

    console.log(`Setting up real-time listener for affiliate ${affiliateId}`)

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
          console.log("New affiliate notification received:", payload)
          setLastUpdate(new Date())
          setNotificationCount((prev) => prev + 1)

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
          console.log("New application for affiliate received:", payload)
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
          table: "affiliate_commissions",
          filter: `affiliate_id=eq.${affiliateId}`,
        },
        (payload) => {
          console.log("New commission for affiliate received:", payload)
          setLastUpdate(new Date())

          // Refresh the page data without a full reload
          router.refresh()
        },
      )
      .subscribe((status) => {
        console.log(`Supabase real-time subscription status: ${status}`)
        setIsConnected(status === "SUBSCRIBED")
      })

    return () => {
      console.log(`Removing real-time listener for affiliate ${affiliateId}`)
      supabase.removeChannel(channel)
    }
  }, [affiliateId, router, supabase])

  return (
    <div className="flex items-center gap-2 mt-1">
      {!isConnected && (
        <div className="flex items-center gap-1 text-amber-500 text-xs">
          <AlertCircle className="h-3 w-3" />
          <span>Connecting...</span>
        </div>
      )}

      {notificationCount > 0 && (
        <Badge variant="destructive" className="h-5 px-1 flex items-center gap-1">
          <Bell className="h-3 w-3" />
          <span>{notificationCount}</span>
        </Badge>
      )}

      {lastUpdate && (
        <div className="text-xs text-gray-500 animate-pulse">Data updated {lastUpdate.toLocaleTimeString()}</div>
      )}
    </div>
  )
}
