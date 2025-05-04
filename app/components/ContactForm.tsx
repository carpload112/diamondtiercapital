"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import CalendlyModal from "@/components/layout/CalendlyModal"
import { ArrowRight, Calendar, Mail, Phone } from "lucide-react"

export default function ContactForm() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent"></div>

      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fillOpacity='1' fillRule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="bg-gradient-to-br from-primary to-accent p-8 text-white">
              <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
              <p className="mb-8">
                Schedule a consultation to discuss business funding options that may be available to you.
              </p>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Schedule a Consultation</h3>
                    <p className="text-sm text-white/80">Choose a time that works for you</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email Us</h3>
                    <a href="mailto:info@diamondtier.solutions" className="text-sm text-white/80 hover:text-white">
                      info@diamondtier.solutions
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Call Us</h3>
                    <a href="tel:+13059223379" className="text-sm text-white/80 hover:text-white">
                      (305) 922-3379
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold mb-2">Schedule a Consultation</h2>
                <p className="text-gray-600 mb-6">
                  Speak with our team to learn more about business funding options that may be available to you.
                </p>

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-md hover:shadow-lg transition-all duration-300 group"
                  onClick={() => setIsCalendlyOpen(true)}
                >
                  Schedule Your Free Consultation{" "}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                <p className="mt-6 text-sm text-gray-500 text-center">
                  Diamond Tier Solutions provides consultation services only. We do not directly provide loans, credit
                  cards, or other financial products. All information is for educational purposes only.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </section>
  )
}
