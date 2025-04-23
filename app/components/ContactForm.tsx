"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import CalendlyModal from "./CalendlyModal"
import { ArrowRight, Calendar, Mail, Phone } from "lucide-react"

export default function ContactForm() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute top-[60%] -left-[5%] w-[30%] h-[30%] bg-blue-300 opacity-20 rounded-full blur-3xl"></div>
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="white"
            fillOpacity="0.1"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center text-white"
        >
          <div className="inline-block px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full text-blue-100 font-medium text-sm mb-6 border border-white/20">
            Get Started Today
          </div>
          <h2 className="text-4xl font-bold mb-6">Don't Miss Out on Premium Funding</h2>
          <p className="text-xl mb-8 text-blue-100">
            Limited spots available for personalized consultations. Secure your business's future today!
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Calendar className="h-6 w-6 text-blue-200 mx-auto mb-2" />
              <h3 className="text-lg font-semibold mb-1">Schedule Call</h3>
              <p className="text-sm text-blue-200">Book a time that works for you</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Phone className="h-6 w-6 text-blue-200 mx-auto mb-2" />
              <h3 className="text-lg font-semibold mb-1">Free Consultation</h3>
              <p className="text-sm text-blue-200">Discuss your business needs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Mail className="h-6 w-6 text-blue-200 mx-auto mb-2" />
              <h3 className="text-lg font-semibold mb-1">Get Proposal</h3>
              <p className="text-sm text-blue-200">Receive tailored solutions</p>
            </div>
          </div>

          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 text-base sm:text-lg px-8 py-6 rounded-full shadow-lg transform transition duration-300 hover:scale-105 w-full sm:w-auto"
            onClick={() => setIsCalendlyOpen(true)}
          >
            Schedule Your Free Consultation <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
            <a
              href="mailto:info@diamondtier.solutions"
              className="flex items-center hover:text-blue-200 transition-colors"
            >
              <Mail className="h-4 w-4 mr-2" /> info@diamondtier.solutions
            </a>
            <a href="tel:+18001234567" className="flex items-center hover:text-blue-200 transition-colors">
              <Phone className="h-4 w-4 mr-2" /> (800) 123-4567
            </a>
          </div>
        </motion.div>
      </div>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </section>
  )
}
