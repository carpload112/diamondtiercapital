import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Diamond Tier Capital",
  description: "Terms and conditions for using Diamond Tier Capital's business funding consultation services.",
}

export default function TermsOfServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
