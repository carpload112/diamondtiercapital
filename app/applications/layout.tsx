import type { Metadata } from "next"
import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import "../globals.css"
import { Inter } from "next/font/google"

// Use the same font as the main site
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Client Application - Diamond Tier Capital",
  description: "Complete your application for business funding consultation services.",
  robots: "noindex, nofollow", // This prevents search engines from indexing this page
}

export default function ApplicationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This is a completely standalone layout that doesn't inherit from RootLayout
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* No Header or Footer components here */}
        {children}
        <Toaster />
      </body>
    </html>
  )
}
