import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import Image from "next/image"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-10 pb-6 relative overflow-hidden">
      {/* Background accent elements - more subtle */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-600"></div>
      <div className="absolute top-0 left-1/4 w-24 h-24 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-400/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4">
        {/* Main footer content - more compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-8">
          {/* Logo and company info */}
          <div className="lg:col-span-3">
            <Link href="/" className="inline-block mb-4 transform hover:scale-105 transition-transform duration-200">
              <Image
                src="/images/diamond-tier-logo.png"
                alt="Diamond Tier Capital"
                width={180}
                height={60}
                className="h-auto"
              />
            </Link>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              Empowering businesses with innovative funding solutions tailored to your unique needs.
            </p>
            <div className="flex space-x-3 mb-4">
              <a href="#" className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-colors duration-200">
                <Facebook size={14} className="text-gray-300 hover:text-white" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-colors duration-200">
                <Twitter size={14} className="text-gray-300 hover:text-white" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-colors duration-200">
                <Instagram size={14} className="text-gray-300 hover:text-white" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-colors duration-200">
                <Linkedin size={14} className="text-gray-300 hover:text-white" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Quick links - more compact */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Services */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-white relative inline-block">
                  <span className="relative z-10">Services</span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full"></span>
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/sba-loans"
                      className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-1.5 transition-all duration-200"></span>
                      <span>SBA Loans</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/unsecured-loans"
                      className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-1.5 transition-all duration-200"></span>
                      <span>Unsecured Loans</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/business-credit-cards"
                      className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-1.5 transition-all duration-200"></span>
                      <span>Business Credit Cards</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/zero-percent-credit-lines"
                      className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-1.5 transition-all duration-200"></span>
                      <span>0% Credit Lines</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/credit-repair"
                      className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-1.5 transition-all duration-200"></span>
                      <span>Credit Repair</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-white relative inline-block">
                  <span className="relative z-10">Company</span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full"></span>
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/about-us"
                      className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-1.5 transition-all duration-200"></span>
                      <span>About Us</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-1.5 transition-all duration-200"></span>
                      <span>Contact</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/applynow"
                      className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-1.5 transition-all duration-200"></span>
                      <span>Apply Now</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin"
                      className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-1.5 transition-all duration-200"></span>
                      <span>Admin</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-white relative inline-block">
                  <span className="relative z-10">Legal</span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full"></span>
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/privacy-policy"
                      className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-1.5 transition-all duration-200"></span>
                      <span>Privacy Policy</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms-of-service"
                      className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-1.5 transition-all duration-200"></span>
                      <span>Terms of Service</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/disclaimer"
                      className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-1.5 transition-all duration-200"></span>
                      <span>Disclaimer</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright - more compact */}
        <div className="mt-8 pt-4 border-t border-gray-800/50 text-center text-gray-400 text-xs">
          <p>&copy; {currentYear} Diamond Tier Capital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
