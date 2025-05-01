import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Credit Education Services | Diamond Tier Solutions",
  description:
    "Educational resources to help you understand credit factors and make informed financial decisions. Schedule a free consultation today.",
  keywords: "credit education, credit factors, financial education, credit consultation",
}

export default function CreditRepairLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
