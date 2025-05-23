import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Toaster } from "@/components/ui/toaster"
import { ScrollToTop } from "@/components/ui/scroll-to-top"
import { PageWrapper } from "@/components/layout/PageWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Diamond Tier Capital - Business Funding Solutions",
  description:
    "Diamond Tier Capital provides innovative funding solutions for businesses of all sizes. Apply now for SBA loans, unsecured loans, business credit cards, and more.",
    generator: 'v0.dev'
}

// Image optimization configuration
export const images = {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      port: "",
      pathname: "/**",
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Header />
          <main className="min-h-screen">
            <PageWrapper>{children}</PageWrapper>
          </main>
          <Footer />
          <Toaster />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
