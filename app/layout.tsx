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
  title: "Diamond Tier Capital - Business Funding Consultation",
  description:
    "Business funding consultation services: Information about SBA loans, business credit cards, and financing options. Schedule a consultation with Diamond Tier Capital.",
  keywords: "business funding consultation, SBA loans, business credit cards, financing options, funding education",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.diamondtiercapital.com",
    siteName: "Diamond Tier Capital",
    title: "Diamond Tier Capital - Business Funding Consultation",
    description:
      "Business funding consultation services: Information about SBA loans, business credit cards, and financing options.",
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
    title: "Diamond Tier Capital - Business Funding Consultation",
    description:
      "Business funding consultation services: Information about SBA loans, business credit cards, and financing options.",
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
            "description": "Business funding consultation services: Information about SBA loans, business credit cards  "Business funding consultation services: Information about SBA loans, business credit cards, and financing options.",
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
            "areaServed": "United States",
            "disclaimer": "Diamond Tier Capital provides consultation services only. We do not directly provide loans, credit cards, or other financial products."
          }
        `}
      </Script>
    </html>
  )
}
