import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Privacy Policy | Diamond Tier Capital",
  description: "Learn about how Diamond Tier Capital collects, uses, and protects your personal information.",
  robots: "index, follow",
}

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
