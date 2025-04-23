import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Credit Repair Services | Diamond Tier Capital",
  description:
    "Expert credit repair services to improve your credit score and achieve financial freedom. Get a free consultation today.",
  keywords: "credit repair, improve credit score, financial freedom, credit consultation",
}

export default function CreditRepairLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
