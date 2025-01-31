"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import CalendlyModal from "./CalendlyModal"

export default function ContactForm() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)

  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-900 opacity-50"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-6">Don't Miss Out on Premium Funding 🚀</h2>
          <p className="text-xl mb-8">
            Limited spots available for personalized consultations. Secure your business's future today!
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-100 text-base sm:text-lg px-6 sm:px-12 py-4 sm:py-6 rounded-full shadow-lg transform transition duration-300 hover:scale-105 w-full sm:w-auto"
            onClick={() => setIsCalendlyOpen(true)}
          >
            Schedule Your Free Consultation Now
          </Button>
          <p className="mt-6 text-sm opacity-75">
            Or reach out directly:{" "}
            <a href="mailto:info@diamondtier.solutions" className="underline hover:text-blue-200">
              info@diamondtier.solutions
            </a>
          </p>
        </motion.div>
      </div>
      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </section>
  )
}

