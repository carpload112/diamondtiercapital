"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  Menu,
  X,
  CreditCard,
  Building2,
  Percent,
  ShieldCheck,
  Users,
  Phone,
  GraduationCap,
  Calendar,
} from "lucide-react"
import CalendlyModal from "./CalendlyModal"
import { useScrollTop } from "@/hooks/use-scroll-top"

const menuItems = [
  {
    title: "Services",
    items: [
      {
        name: "SBA Loan Information",
        description: "Learn about government-backed loan programs",
        href: "/sba-loans",
        icon: Building2,
      },
      {
        name: "Introductory Rate Options",
        description: "Information about credit options with introductory rates",
        href: "/zero-percent-credit-lines",
        icon: Percent,
      },
      {
        name: "Unsecured Financing",
        description: "Learn about financing without collateral requirements",
        href: "/unsecured-loans",
        icon: ShieldCheck,
      },
      {
        name: "Business Credit Cards",
        description: "Information about business credit card options",
        href: "/business-credit-cards",
        icon: CreditCard,
      },
      {
        name: "Credit Education",
        description: "Educational resources about credit factors",
        href: "/credit-repair",
        icon: GraduationCap,
      },
    ],
  },
  {
    title: "Company",
    items: [
      {
        name: "About Us",
        description: "Learn about our mission and values",
        href: "/about-us",
        icon: Users,
      },
      {
        name: "Contact",
        description: "Get in touch with our team",
        href: "/contact",
        icon: Phone,
      },
    ],
  },
]

export function Header() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const isScrolled = useScrollTop(10)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const handleDropdownEnter = (title: string) => {
    setActiveDropdown(title)
  }

  const handleDropdownLeave = () => {
    setActiveDropdown(null)
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        mobileMenuOpen &&
        !target.closest('[aria-label="Toggle menu"]') &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target)
      ) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [mobileMenuOpen])

  // Add this useEffect to handle route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false)
    }

    // Add event listener for route changes
    window.addEventListener("popstate", handleRouteChange)

    return () => {
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [])

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-md dark:bg-gray-900/90" : "bg-transparent"
      }`}
    >
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        {!isScrolled && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
        )}
      </div>

      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 relative z-10">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cropped-Diamond-Tier-Main-Logo-2400x1800-1-1-OtGxrajBZ6tB8DXOUuNBKwF5Ag3vaG.png"
              alt="Diamond Tier Solutions"
              width={200}
              height={50}
              className="h-10 w-auto"
              priority
              quality={90}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {menuItems.map((section) => (
              <div
                key={section.title}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(section.title)}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isScrolled
                      ? "text-gray-700 hover:text-primary hover:bg-gray-100/50 dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-800/50"
                      : "text-white hover:text-white/90 hover:bg-white/10"
                  } ${
                    activeDropdown === section.title
                      ? isScrolled
                        ? "bg-gray-100/80 text-primary dark:bg-gray-800/80 dark:text-white"
                        : "bg-white/20 text-white"
                      : ""
                  }`}
                  aria-expanded={activeDropdown === section.title}
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      activeDropdown === section.title ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {activeDropdown === section.title && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute left-0 w-80 mt-1 rounded-xl overflow-hidden z-50"
                      style={{
                        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden backdrop-blur-lg">
                        <div className="p-2">
                          {section.items.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                              <div className="flex-shrink-0 mt-1">
                                <div className="p-1.5 rounded-md bg-primary/10 text-primary dark:bg-primary/20">
                                  <item.icon className="h-5 w-5" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <Button
              variant={isScrolled ? "default" : "outline"}
              size="sm"
              className={`ml-4 ${
                isScrolled
                  ? "bg-primary hover:bg-primary/90 text-white"
                  : "border-white text-white hover:bg-white hover:text-primary"
              }`}
              onClick={() => setIsCalendlyOpen(true)}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Consultation
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden relative z-10">
            <button
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                isScrolled
                  ? "text-gray-700 hover:text-primary hover:bg-gray-100 dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-800"
                  : "text-white hover:text-white hover:bg-white/10"
              } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>

            {/* Mobile Navigation Dropdown */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  ref={mobileMenuRef}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 rounded-lg overflow-hidden z-50"
                  style={{
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg backdrop-blur-lg">
                    <div className="max-h-[80vh] overflow-y-auto py-3">
                      {menuItems.map((section) => (
                        <div key={section.title} className="px-3 py-2">
                          <div className="text-sm font-semibold text-primary dark:text-primary-foreground px-3 py-1.5 mb-1">
                            {section.title}
                          </div>
                          <div className="space-y-1">
                            {section.items.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-800/50 rounded-md transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <item.icon className="h-4 w-4 mr-3 text-primary" />
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                      <div className="px-4 py-3 mt-2 border-t border-gray-100 dark:border-gray-800">
                        <Button
                          className="w-full justify-center bg-primary hover:bg-primary/90 text-white"
                          size="sm"
                          onClick={() => {
                            setIsCalendlyOpen(true)
                            setMobileMenuOpen(false)
                          }}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule Consultation
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </header>
  )
}
