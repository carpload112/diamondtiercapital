import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { Toaster } from "@/components/ui/toaster"
import type React from "react"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Diamond Tier Capital - Premium Business Funding Solutions",
  description:
    "Expert financial solutions for business growth: SBA loans, 0% credit lines, unsecured loans, and credit card stacking. Get funded fast with Diamond Tier Capital.",
  keywords: "business funding, SBA loans, 0% credit lines, unsecured loans, credit card stacking, business finance",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.diamondtiercapital.com",
    siteName: "Diamond Tier Capital",
    title: "Diamond Tier Capital - Premium Business Funding Solutions",
    description:
      "Expert financial solutions for business growth: SBA loans, 0% credit lines, unsecured loans, and credit card stacking.",
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
      "Expert financial solutions for business growth: SBA loans, 0% credit lines, unsecured loans, and credit card stacking.",
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
    <html lang="en">
      <head>
        <link rel="canonical" href="https://www.diamondtiercapital.com" />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <Header />
        {children}
        <Footer />
        <Toaster />
      </body>
      <Script id="structured-data" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "FinancialService",
            "name": "Diamond Tier Capital",
            "description": "Expert financial solutions for business growth: SBA loans, 0% credit lines, unsecured loans, and credit card stacking.",
            "url": "https://www.diamondtiercapital.com",
            "logo": "https://www.diamondtiercapital.com/logo.png",
            "sameAs": [
              "https://www.linkedin.com/company/diamond-tier-solutions/",
              "https://www.facebook.com/DiamondTierCapital",
              "https://twitter.com/DiamondTierCap"
            ],
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "1501 Biscayne Blvd Suite 501",
              "addressLocality": "Miami",
              "addressRegion": "FL",
              "postalCode": "33132",
              "addressCountry": "US"
            },
            "telephone": "+1-800-123-4567",
            "openingHours": "Mo-Fr 09:00-17:00",
            "areaServed": "United States"
          }
        `}
      </Script>
    </html>
  )
}
