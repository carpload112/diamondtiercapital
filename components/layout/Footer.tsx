"use client"
import Link from "next/link"
import Image from "next/image"
import { LinkedinIcon, Mail, Phone } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Main footer content - simple 3 column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Company info */}
          <div>
            <div className="flex items-center mb-3">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cropped-1679411819531-1-e1679413705921-8SSmbzT5LVluSgcI9bL9mGoYXvCRBa.png"
                alt="Diamond Tier Capital"
                width={32}
                height={32}
                className="h-8 w-auto mr-2"
              />
              <span className="font-medium">Diamond Tier Capital</span>
            </div>
            <div className="text-sm text-slate-300">
              <p>1501 Biscayne Blvd, Suite 501</p>
              <p>Miami, FL 33132</p>
              <div className="flex mt-3 space-x-3">
                <a
                  href="https://www.linkedin.com/company/diamond-tier-solutions/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="h-4 w-4 text-slate-400 hover:text-white" />
                </a>
                <a href="mailto:info@diamondtier.solutions" aria-label="Email">
                  <Mail className="h-4 w-4 text-slate-400 hover:text-white" />
                </a>
                <a href="tel:+13059223379" aria-label="Phone">
                  <Phone className="h-4 w-4 text-slate-400 hover:text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-medium mb-3">Quick Links</h3>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/applynow" className="hover:text-white">
                  Apply Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-medium mb-3">Services</h3>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>
                <Link href="/sba-loans" className="hover:text-white">
                  SBA Loans
                </Link>
              </li>
              <li>
                <Link href="/zero-percent-credit-lines" className="hover:text-white">
                  0% Credit Lines
                </Link>
              </li>
              <li>
                <Link href="/unsecured-loans" className="hover:text-white">
                  Unsecured Loans
                </Link>
              </li>
              <li>
                <Link href="/business-credit-cards" className="hover:text-white">
                  Business Credit Cards
                </Link>
              </li>
              <li>
                <Link href="/credit-repair" className="hover:text-white">
                  Credit Repair
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-slate-800 pt-4 mb-4">
          <p className="text-xs text-slate-400">
            Diamond Tier Capital provides consultation services only. We do not directly provide loans, credit cards, or
            other financial products. All information is for educational purposes only.
          </p>
        </div>

        {/* Simple copyright and links */}
        <div className="border-t border-slate-800 pt-4">
          <div className="text-xs text-slate-400 flex flex-col md:flex-row justify-between">
            <p>© {currentYear} Diamond Tier Capital. All rights reserved.</p>
            <div className="mt-2 md:mt-0 space-x-4">
              <Link href="/privacy-policy" className="hover:text-white">
                Privacy
              </Link>
              <Link href="/terms-of-service" className="hover:text-white">
                Terms
              </Link>
              <Link href="/disclaimer" className="hover:text-white">
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
