"use client"
import Link from "next/link"
import Image from "next/image"
import { LinkedinIcon as LinkedIn, Mail, MapPin } from "lucide-react"
import { useState } from "react"

export default function Footer() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
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
            <p className="text-gray-400">Empowering businesses with innovative financial solutions</p>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/diamond-tier-solutions/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <LinkedIn size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
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
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <Link href="/about-us" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sba-loans" className="text-gray-400 hover:text-white transition-colors">
                  SBA Loans
                </Link>
              </li>
              <li>
                <Link href="/zero-percent-credit-lines" className="text-gray-400 hover:text-white transition-colors">
                  0% Credit Lines
                </Link>
              </li>
              <li>
                <Link href="/unsecured-loans" className="text-gray-400 hover:text-white transition-colors">
                  Unsecured Loans
                </Link>
              </li>
              <li>
                <Link href="/business-credit-cards" className="text-gray-400 hover:text-white transition-colors">
                  Business Credit Cards
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin size={20} className="mr-2 text-blue-400" />
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
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Diamond Tier Capital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

