"use client"

import { useState, useEffect } from "react"
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
  RefreshCcw,
} from "lucide-react"
import CalendlyModal from "./CalendlyModal"

const menuItems = [
  {
    title: "Products",
    items: [
      {
        name: "SBA Loans",
        description: "Government-backed loans for business growth",
        href: "/sba-loans",
        icon: Building2,
      },
      {
        name: "0% Credit Lines",
        description: "Interest-free financing for up to 18 months",
        href: "/zero-percent-credit-lines",
        icon: Percent,
      },
      {
        name: "Unsecured Loans",
        description: "Quick funding without collateral requirements",
        href: "/unsecured-loans",
        icon: ShieldCheck,
      },
      {
        name: "Business Credit Cards",
        description: "Strategic credit card stacking solutions",
        href: "/business-credit-cards",
        icon: CreditCard,
      },
      {
        name: "Credit Repair",
        description: "Improve your credit score for better financing options",
        href: "/credit-repair",
        icon: RefreshCcw,
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

export default function Header() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleDropdownEnter = (title: string) => {
    setActiveDropdown(title)
  }

  const handleDropdownLeave = () => {
    setActiveDropdown(null)
  }

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg py-2" : "bg-white/80 backdrop-blur-lg py-4"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cropped-Diamond-Tier-Main-Logo-2400x1800-1-1-OtGxrajBZ6tB8DXOUuNBKwF5Ag3vaG.png"
              alt="Diamond Tier Solutions"
              width={200}
              height={50}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {menuItems.map((section) => (
              <div
                key={section.title}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(section.title)}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors ${
                    activeDropdown === section.title ? "text-blue-600" : ""
                  }`}
                >
                  <span>{section.title}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {activeDropdown === section.title && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 w-80 mt-2 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
                    >
                      <div className="p-2">
                        {section.items.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <item.icon className="h-6 w-6 text-blue-600 mt-1" />
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
              onClick={() => setIsCalendlyOpen(true)}
            >
              Schedule Call
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="pt-2 pb-4 space-y-1">
                {menuItems.map((section) => (
                  <div key={section.title} className="px-2">
                    <div className="text-sm font-semibold text-gray-500 px-3 py-2">{section.title}</div>
                    {section.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="h-5 w-5 mr-3 text-blue-600" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                ))}
                <div className="px-5 pt-4">
                  <Button
                    className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                    onClick={() => {
                      setIsCalendlyOpen(true)
                      setMobileMenuOpen(false)
                    }}
                  >
                    Schedule Call
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </header>
  )
}
