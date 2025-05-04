"use client"
import Link from "next/link"
import Image from "next/image"
import { LinkedinIcon, Mail, MapPin, Phone, ArrowRight, Clock } from "lucide-react"
import { useState } from "react"

export default function Footer() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden">
      {/* Diamond pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      {/* Top wave separator */}
      <div
        className="absolute top-0 left-0 right-0 h-8 bg-white"
        style={{
          maskImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 1200 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25'/%3E%3Cpath d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z' opacity='.5'/%3E%3Cpath d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z'/%3E%3C/svg%3E\")",
          maskSize: "100% 100%",
          maskRepeat: "no-repeat",
          maskPosition: "bottom",
        }}
      ></div>

      <div className="container mx-auto px-4 md:px-6 pt-20 pb-12 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Company info - 4 columns on desktop */}
          <div className="md:col-span-4 space-y-8">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-lg opacity-30 rounded-full"></div>
                <div className="relative bg-white p-2 rounded-lg">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cropped-1679411819531-1-e1679413705921-8SSmbzT5LVluSgcI9bL9mGoYXvCRBa.png"
                    alt="Diamond Tier Solutions"
                    width={48}
                    height={48}
                    className="h-12 w-12"
                  />
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                    Diamond Tier
                  </span>
                </h2>
                <p className="text-blue-300 text-sm">Business Funding Consultation</p>
              </div>
            </div>

            <div className="text-slate-300 text-sm leading-relaxed">
              <p className="mb-4">
                Diamond Tier Solutions provides expert business funding consultation services, helping entrepreneurs and
                business owners access the capital they need to grow and succeed.
              </p>
              <div className="flex items-start space-x-3 mt-6">
                <Clock className="text-blue-400 h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-white mb-2">Business Hours</h4>
                  <p className="text-slate-400">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-slate-400">Saturday: By appointment</p>
                  <p className="text-slate-400">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links - 2 columns on desktop */}
          <div className="md:col-span-2 md:ml-auto">
            <h3 className="text-lg font-semibold mb-6 text-white after:content-[''] after:block after:w-12 after:h-0.5 after:bg-blue-500 after:mt-2">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about-us" },
                { name: "Services", href: "#services", isButton: true },
                { name: "Contact", href: "/contact" },
                { name: "Apply Now", href: "/applynow" },
              ].map((link) => (
                <li key={link.name}>
                  {link.isButton ? (
                    <button
                      onClick={() => {
                        const servicesSection = document.getElementById("services")
                        if (servicesSection) {
                          servicesSection.scrollIntoView({ behavior: "smooth" })
                        }
                      }}
                      className="group flex items-center text-slate-300 hover:text-white transition-colors"
                    >
                      <ArrowRight className="h-3 w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 mr-0 group-hover:mr-2 transition-all duration-300 text-blue-400" />
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="group flex items-center text-slate-300 hover:text-white transition-colors"
                    >
                      <ArrowRight className="h-3 w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 mr-0 group-hover:mr-2 transition-all duration-300 text-blue-400" />
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services - 3 columns on desktop */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold mb-6 text-white after:content-[''] after:block after:w-12 after:h-0.5 after:bg-blue-500 after:mt-2">
              Our Services
            </h3>
            <ul className="space-y-3">
              {[
                { name: "SBA Loan Information", href: "/sba-loans" },
                { name: "Introductory Rate Options", href: "/zero-percent-credit-lines" },
                { name: "Unsecured Financing", href: "/unsecured-loans" },
                { name: "Business Credit Cards", href: "/business-credit-cards" },
                { name: "Credit Repair", href: "/credit-repair" },
              ].map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="group flex items-center text-slate-300 hover:text-white transition-colors"
                  >
                    <ArrowRight className="h-3 w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 mr-0 group-hover:mr-2 transition-all duration-300 text-blue-400" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us - 3 columns on desktop */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold mb-6 text-white after:content-[''] after:block after:w-12 after:h-0.5 after:bg-blue-500 after:mt-2">
              Contact Us
            </h3>
            <ul className="space-y-5">
              <li className="flex">
                <div className="bg-slate-800/50 p-2.5 rounded-lg mr-4">
                  <MapPin className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Office Location</h4>
                  <address className="text-slate-300 text-sm not-italic leading-relaxed">
                    1501 Biscayne Blvd
                    <br />
                    Suite 501
                    <br />
                    Miami, FL 33132
                  </address>
                </div>
              </li>
              <li className="flex">
                <div className="bg-slate-800/50 p-2.5 rounded-lg mr-4">
                  <Mail className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Email Us</h4>
                  <a
                    href="mailto:info@diamondtier.solutions"
                    className="text-slate-300 hover:text-white transition-colors text-sm"
                  >
                    info@diamondtier.solutions
                  </a>
                </div>
              </li>
              <li className="flex">
                <div className="bg-slate-800/50 p-2.5 rounded-lg mr-4">
                  <Phone className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Call Us</h4>
                  <a href="tel:+13059223379" className="text-slate-300 hover:text-white transition-colors text-sm">
                    (305) 922-3379
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Social media and copyright */}
        <div className="mt-16 pt-8 border-t border-slate-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-6 md:mb-0">
              <a
                href="https://www.linkedin.com/company/diamond-tier-solutions/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800/50 hover:bg-blue-600 p-3 rounded-full transition-all duration-300 group"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="h-4 w-4 text-slate-300 group-hover:text-white" />
              </a>
              <a
                href="mailto:info@diamondtier.solutions"
                className="bg-slate-800/50 hover:bg-blue-600 p-3 rounded-full transition-all duration-300 group"
                aria-label="Email"
              >
                <Mail className="h-4 w-4 text-slate-300 group-hover:text-white" />
              </a>
              <a
                href="tel:+13059223379"
                className="bg-slate-800/50 hover:bg-blue-600 p-3 rounded-full transition-all duration-300 group"
                aria-label="Phone"
              >
                <Phone className="h-4 w-4 text-slate-300 group-hover:text-white" />
              </a>
            </div>

            <div className="text-center md:text-right">
              <p className="text-slate-400 text-sm">© {currentYear} Diamond Tier Solutions. All rights reserved.</p>
              <div className="mt-2 text-sm space-x-4">
                <Link href="/privacy-policy" className="text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="text-slate-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8">
            <div className="bg-slate-800/30 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-slate-400 text-xs text-center">
                Diamond Tier Solutions provides consultation services only. We do not directly provide loans, credit
                cards, or other financial products. All information is for educational purposes only. Results may vary
                based on individual circumstances and market conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
