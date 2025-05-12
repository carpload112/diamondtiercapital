import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import Image from "next/image"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-noise opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[40%] h-[60%] rounded-full bg-primary/5 blur-3xl opacity-20"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[40%] h-[60%] rounded-full bg-accent/5 blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo and company info */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cropped-Diamond-Tier-Main-Logo-2400x1800-1-1-OtGxrajBZ6tB8DXOUuNBKwF5Ag3vaG.png"
                alt="Diamond Tier Capital"
                width={160}
                height={40}
                className="h-10 w-auto"
                loading="lazy"
                quality={90}
              />
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              Business funding consultation services for entrepreneurs and business owners.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="bg-gray-800 hover:bg-gray-700 p-2.5 rounded-full transition-colors"
                  aria-label={`Social media link ${index + 1}`}
                >
                  <Icon className="h-4 w-4 text-gray-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Services</h3>
            <ul className="space-y-3">
              {[
                { name: "SBA Loans", href: "/sba-loans" },
                { name: "Unsecured Loans", href: "/unsecured-loans" },
                { name: "Business Credit Cards", href: "/business-credit-cards" },
                { name: "0% Credit Lines", href: "/zero-percent-credit-lines" },
                { name: "Credit Repair", href: "/credit-repair" },
              ].map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              {[
                { name: "About Us", href: "/about-us" },
                { name: "Contact", href: "/contact" },
                { name: "Apply Now", href: "/applynow" },
                { name: "Admin", href: "/admin" },
              ].map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Legal</h3>
            <ul className="space-y-3">
              {[
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Terms of Service", href: "/terms-of-service" },
                { name: "Disclaimer", href: "/disclaimer" },
              ].map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 mb-8 p-6 glass-dark rounded-xl">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-400">
                Subscribe to our newsletter for the latest funding opportunities and financial tips.
              </p>
            </div>
            <div>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="btn-gradient px-4 py-2 rounded-r-lg text-white font-medium">Subscribe</button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">&copy; {currentYear} Diamond Tier Capital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
