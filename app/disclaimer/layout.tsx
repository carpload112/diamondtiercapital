import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Disclaimer | Diamond Tier Capital",
  description:
    "Important disclaimers regarding our business funding consultation services and the information provided on our website.",
}

export default function DisclaimerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
