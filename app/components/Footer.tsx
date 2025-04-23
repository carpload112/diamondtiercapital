"use client"
import Link from "next/link"
import type React from "react"

import Image from "next/image"
import { LinkedinIcon as LinkedIn, Mail, MapPin, Phone, ArrowRight, Facebook, Twitter, Instagram } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CalendlyModal from "./CalendlyModal"

export default function Footer() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Subscribe email:", email)
    setEmail("")
    // Show success message
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* Top section with CTA */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Ready to grow your business?</h3>
              <p className="text-gray-400">Get the funding you need to take your business to the next level.</p>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6"
              onClick={() => setIsCalendlyOpen(true)}
            >
              Schedule Consultation <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cropped-1679411819531-1-e1679413705921-8SSmbzT5LVluSgcI9bL9mGoYXvCRBa.png"
                alt="Diamond Tier Capital"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="text-2xl font-bold">Diamond Tier</span>
            </Link>
            <p className="text-gray-400">Empowering businesses with innovative financial solutions since 2018.</p>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/diamond-tier-solutions/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedIn size={20} />
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" /> Home
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    const servicesSection = document.getElementById("services")
                    if (servicesSection) {
                      servicesSection.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ArrowRight className="h-3 w-3 mr-2" /> Services
                </button>
              </li>
              <li>
                <Link href="/about-us" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" /> About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" /> Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/credit-repair"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ArrowRight className="h-3 w-3 mr-2" /> Credit Repair
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sba-loans" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" /> SBA Loans
                </Link>
              </li>
              <li>
                <Link
                  href="/zero-percent-credit-lines"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ArrowRight className="h-3 w-3 mr-2" /> 0% Credit Lines
                </Link>
              </li>
              <li>
                <Link
                  href="/unsecured-loans"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ArrowRight className="h-3 w-3 mr-2" /> Unsecured Loans
                </Link>
              </li>
              <li>
                <Link
                  href="/business-credit-cards"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ArrowRight className="h-3 w-3 mr-2" /> Business Credit Cards
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 text-blue-400 flex-shrink-0 mt-1" />
                <span className="text-gray-400">1501 Biscayne Blvd Suite 501, Miami, FL 33132</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 text-blue-400" />
                <a
                  href="mailto:info@diamondtier.solutions"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  info@diamondtier.solutions
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 text-blue-400" />
                <a href="tel:+18001234567" className="text-gray-400 hover:text-white transition-colors">
                  (800) 123-4567
                </a>
              </li>
            </ul>

            {/* Newsletter signup */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Subscribe to our newsletter</h4>
              <form onSubmit={handleSubscribe} className="flex">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white rounded-l-md"
                  required
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-l-none">
                  <ArrowRight size={16} />
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Diamond Tier Capital. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </footer>
  )
}
