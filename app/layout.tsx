import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { ThemeProvider } from "@/components/ThemeProvider"
import type React from "react"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: {
    default: "Diamond Tier Capital - Premium Business Funding Solutions",
    template: "%s | Diamond Tier Capital",
  },
  description:
    "Expert business funding consultation services: SBA loans, business credit cards, and financing options tailored to your business needs.",
  keywords:
    "business funding, SBA loans, business credit cards, financing options, funding education, business capital",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.diamondtiercapital.com",
    siteName: "Diamond Tier Capital",
    title: "Diamond Tier Capital - Premium Business Funding Solutions",
    description:
      "Expert business funding consultation services: SBA loans, business credit cards, and financing options.",
    images: [
      {
        url: "https://www.diamondtiercapital.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Diamond Tier Capital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diamond Tier Capital - Premium Business Funding Solutions",
    description:
      "Expert business funding consultation services: SBA loans, business credit cards, and financing options.",
    images: ["https://www.diamondtiercapital.com/twitter-image.jpg"],
    creator: "@DiamondTierCap",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Update the body content to handle loading states better */}
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
