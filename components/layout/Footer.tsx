import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import Image from "next/image"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
          {/* Logo and company info */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cropped-Diamond-Tier-Main-Logo-2400x1800-1-1-OtGxrajBZ6tB8DXOUuNBKwF5Ag3vaG.png"
                alt="Diamond Tier Capital"
                width={160}
                height={40}
                className="h-8 w-auto"
                loading="lazy"
                quality={90}
              />
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Business funding consultation services for entrepreneurs and business owners.
            </p>
            <div className="flex space-x-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors"
                  aria-label={`Social media link ${index + 1}`}
                >
                  <Icon className="h-4 w-4 text-gray-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Services</h3>
            <ul className="space-y-2">
              {[
                { name: "SBA Loans", href: "/sba-loans" },
                { name: "Unsecured Loans", href: "/unsecured-loans" },
                { name: "Business Credit Cards", href: "/business-credit-cards" },
                { name: "0% Credit Lines", href: "/zero-percent-credit-lines" },
                { name: "Credit Repair", href: "/credit-repair" },
              ].map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Company</h3>
            <ul className="space-y-2">
              {[
                { name: "About Us", href: "/about-us" },
                { name: "Contact", href: "/contact" },
                { name: "Apply Now", href: "/applynow" },
                { name: "Admin", href: "/admin" },
              ].map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Affiliate Program */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Affiliate Program</h3>
            <ul className="space-y-2">
              {[
                { name: "Become an Affiliate", href: "/affiliate-program" },
                { name: "Affiliate Login", href: "/affiliate/login" },
                { name: "Affiliate Dashboard", href: "/affiliate/dashboard" },
                { name: "Commission Structure", href: "/affiliate-program#commission" },
                { name: "Affiliate Terms", href: "/affiliate-terms" },
              ].map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Legal</h3>
            <ul className="space-y-2">
              {[
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Terms of Service", href: "/terms-of-service" },
                { name: "Disclaimer", href: "/disclaimer" },
              ].map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500">&copy; {currentYear} Diamond Tier Capital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
