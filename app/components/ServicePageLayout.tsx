"use client"

import { useState, type ReactNode } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import CalendlyModal from "./CalendlyModal"
import { ArrowRight } from "lucide-react"

interface ServicePageLayoutProps {
  title: string
  subtitle: string
  icon: ReactNode
  children: ReactNode
  primaryCTA?: string
  secondaryCTA?: string
}

export default function ServicePageLayout({
  title,
  subtitle,
  icon,
  children,
  primaryCTA = "Get Started",
  secondaryCTA = "Learn More",
}: ServicePageLayoutProps) {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white py-20 md:py-32 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">{title}</h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">{subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-blue-600 hover:text-blue-700 text-lg px-8 py-6"
                  onClick={() => setIsCalendlyOpen(true)}
                >
                  {primaryCTA}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                  onClick={() => setIsCalendlyOpen(true)}
                >
                  {secondaryCTA}
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative h-[300px] md:h-[400px] flex items-center justify-center"
            >
              <motion.div
                className="relative w-48 h-48"
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                {icon}
              </motion.div>
              <motion.div
                className="absolute inset-0 bg-blue-400/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.3, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {children}

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Grow Your Business?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Let's discuss how our financial solutions can help fuel your business growth
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-blue-600 hover:text-blue-700 text-lg px-8 py-6"
                onClick={() => setIsCalendlyOpen(true)}
              >
                Apply Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                onClick={() => setIsCalendlyOpen(true)}
              >
                Schedule Consultation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </div>
  )
}
