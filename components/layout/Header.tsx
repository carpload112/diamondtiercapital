"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import CalendlyModal from "@/components/CalendlyModal"
import { Menu, X, ChevronDown } from "lucide-react"

// Simplified menu structure
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

export default function Header() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // For mobile menu
      if (mobileMenuOpen && !target.closest('[aria-label="Toggle menu"]') && !target.closest(".mobile-menu")) {
        setMobileMenuOpen(false)
      }

      // For desktop dropdowns
      if (
        activeDropdown &&
        !target.closest(`[data-dropdown="${activeDropdown}"]`) &&
        !target.closest(".dropdown-menu")
      ) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [mobileMenuOpen, activeDropdown])

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  // Toggle dropdown menu
  const toggleDropdown = (title: string) => {
    setActiveDropdown(activeDropdown === title ? null : title)
  }

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
              <div
                key={item.title}
                className="relative"
                data-dropdown={item.title}
                ref={(el) => (dropdownRefs.current[item.title] = el)}
              >
                <button
                  onClick={() => toggleDropdown(item.title)}
                  className={cn(
                    "flex items-center text-sm font-medium px-1 py-1.5 rounded-md transition-colors",
                    activeDropdown === item.title ? "text-primary" : "text-foreground hover:text-primary",
                  )}
                  aria-expanded={activeDropdown === item.title}
                >
                  {item.title}
                  <ChevronDown
                    className={cn(
                      "ml-1 h-3.5 w-3.5 transition-transform duration-200",
                      activeDropdown === item.title ? "rotate-180" : "",
                    )}
                  />
                </button>

                <AnimatePresence>
                  {activeDropdown === item.title && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-1 w-44 bg-white rounded-md shadow-lg py-1.5 dropdown-menu"
                    >
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={cn(
                            "block px-3 py-1.5 text-xs transition-colors hover:bg-secondary",
                            pathname === subItem.href ? "text-primary font-medium bg-secondary/50" : "text-foreground",
                          )}
                          onClick={() => setActiveDropdown(null)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
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

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              className="relative z-20"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Simple Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden mobile-menu bg-white shadow-md rounded-b-lg mt-2 mx-4"
            >
              <div className="py-3 px-4 space-y-3">
                {menuItems.map((section) => (
                  <div key={section.title} className="space-y-1.5">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {section.title}
                    </h3>
                    <div className="space-y-1 pl-2">
                      {section.submenu.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "block py-1.5 px-2.5 rounded-md text-sm transition-colors",
                            pathname === item.href
                              ? "bg-secondary text-primary font-medium"
                              : "text-foreground hover:bg-secondary/50",
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Button
                    size="sm"
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    onClick={() => {
                      setIsCalendlyOpen(true)
                      setMobileMenuOpen(false)
                    }}
                  >
                    Schedule Consultation
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </header>
  )
}
