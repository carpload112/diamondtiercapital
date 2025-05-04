"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle, CreditCard, Percent, ShieldCheck } from "lucide-react"
import { useState } from "react"
import CalendlyModal from "../components/CalendlyModal"

export default function ZeroPercentCreditLinesPage() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-blue-600 text-white py-20 md:py-28 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {/* Premium gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700"></div>

          {/* Professional pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%, 
                                transparent 50%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.1) 75%, 
                                transparent 75%, transparent)`,
              backgroundSize: "100px 100px",
            }}
          ></div>

          {/* Elegant light beams */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-[10%] -right-[10%] w-[50%] h-[40%] bg-blue-400/10 blur-[80px] rounded-full"
              animate={{
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[40%] bg-blue-300/10 blur-[80px] rounded-full"
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 2,
              }}
            />
          </div>

          {/* Subtle animated dots */}
          <div className="absolute inset-0" aria-hidden="true">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
                backgroundSize: "30px 30px",
              }}
            ></div>
          </div>
        </motion.div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white drop-shadow-sm">
                Introductory Rate Credit Options
              </h1>
              <p className="text-lg md:text-xl mb-8 text-blue-50">
                Learn about business credit options that may offer introductory rates
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 shadow-lg"
                  onClick={() => setIsCalendlyOpen(true)}
                >
                  Learn More
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 shadow-md"
                  onClick={() => setIsCalendlyOpen(true)}
                >
                  Schedule Consultation
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
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <CreditCard className="w-full h-full text-white/90 drop-shadow-lg" />
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

      {/* Features Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800">
              Benefits of Introductory Rate Credit Options
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Understanding how introductory rate financing may benefit your business
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Percent,
                title: "Introductory Rates",
                description: "Some credit options offer introductory rates for qualified applicants",
              },
              {
                icon: CreditCard,
                title: "Credit Options",
                description: "Various credit limits may be available based on qualification factors",
              },
              {
                icon: ShieldCheck,
                title: "Application Assistance",
                description: "We can help you understand the application process for various credit options",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-slate-100"
              >
                <div className="bg-blue-50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center text-slate-800">Our Consultation Process</h2>
          <div className="grid md:grid-cols-4 gap-6 md:gap-8">
            {[
              { title: "Discuss Needs", description: "We learn about your business financing needs." },
              { title: "Review Options", description: "We explain potential credit options that may be available." },
              { title: "Application Guidance", description: "We provide information about application processes." },
              {
                title: "Ongoing Support",
                description: "We offer continued support for your business credit questions.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center border border-slate-100"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto shadow-md">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold mb-3 text-slate-800">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800">Potential Business Uses</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              How businesses may use credit options with introductory rates
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Inventory purchases",
              "Equipment upgrades",
              "Marketing campaigns",
              "Hiring new employees",
              "Expanding business locations",
              "Managing cash flow",
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-slate-100"
              >
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <p className="text-slate-800 font-medium">{useCase}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-700 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Learn More About Credit Options</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-blue-50">
              Schedule a consultation to discuss business credit options that may be available to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 shadow-lg"
                onClick={() => setIsCalendlyOpen(true)}
              >
                Schedule Consultation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 shadow-md"
                onClick={() => setIsCalendlyOpen(true)}
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Common questions about introductory rate credit options
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: "How long do introductory rates typically last?",
                a: "Introductory rate periods vary by credit card issuer and specific offer. They may range from several months to over a year for qualified applicants.",
              },
              {
                q: "What happens after the introductory period?",
                a: "After the introductory period ends, the standard interest rate will typically apply to any remaining balance. It's important to understand the terms before applying.",
              },
              {
                q: "Is there a credit check required?",
                a: "Yes, credit card issuers typically perform a credit check as part of their application process. Approval and terms are based on various factors including credit history.",
              },
              {
                q: "What can I use these credit options for?",
                a: "Business credit cards can typically be used for various legitimate business expenses, subject to the card issuer's terms and conditions.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-100"
              >
                <h3 className="text-lg font-bold mb-3 text-slate-800">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </div>
  )
}
