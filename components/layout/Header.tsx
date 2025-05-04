"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

const menuItems = [
  {
    title: "Services",
    submenu: [
      { name: "SBA Loans", href: "/sba-loans" },
      { name: "0% Credit Lines", href: "/zero-percent-credit-lines" },
      { name: "Unsecured Loans", href: "/unsecured-loans" },
      { name: "Business Credit Cards", href: "/business-credit-cards" },
      { name: "Credit Repair", href: "/credit-repair" },
    ],
  },
  {
    title: "About",
    submenu: [
      { name: "About Us", href: "/about-us" },
      { name: "Contact", href: "/contact" },
    ],
  },
]

export function Header() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-sm py-3">
      <div className="w-full px-0">
        <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 xl:px-10 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 relative z-10">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cropped-Diamond-Tier-Main-Logo-2400x1800-1-1-OtGxrajBZ6tB8DXOUuNBKwF5Ag3vaG.png"
              alt="Diamond Tier Capital"
              width={160}
              height={44}
              className="h-8 sm:h-9 md:h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {menuItems.map((item) => (
              <div key={item.title} className="relative">
                <button className="flex items-center text-sm font-medium px-1 py-1.5 rounded-md transition-colors text-foreground hover:text-primary">
                  {item.title}
                </button>
              </div>
            ))}

            <Button
              variant="default"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => setIsCalendlyOpen(true)}
            >
              Schedule Consultation
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
