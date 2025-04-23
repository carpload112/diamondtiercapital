"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { CheckCircle } from "lucide-react"

const steps = [
  {
    title: "Free Consultation",
    description:
      "Tell us about your business needs and goals. Our experts will analyze your situation and recommend the best funding options.",
    emoji: "🤝",
  },
  {
    title: "Get Approved",
    description:
      "Quick approval process with competitive rates. We handle the paperwork and guide you through every step.",
    emoji: "✅",
  },
  {
    title: "Access Funds",
    description:
      "Immediate access to your financing. Use the funds to grow your business, manage cash flow, or invest in new opportunities.",
    emoji: "💸",
  },
]

export default function HowItWorks() {
  return (
    <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block px-4 py-1 bg-blue-100 rounded-full text-blue-600 font-medium text-sm mb-4">
            Simple Process
          </div>
          <h2 className="mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">
            Our streamlined process makes accessing business funding quick and easy
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-12">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-6 items-start relative"
                >
                  {/* Step number with connecting line */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-14 h-14 flex items-center justify-center bg-blue-100 rounded-full text-blue-600 text-2xl z-10 relative">
                      {step.emoji}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="absolute top-14 left-1/2 w-0.5 h-[calc(100%+1rem)] bg-blue-100 -translate-x-1/2"></div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/benefits_of_business_loans-CALUvAhKQ2axz3O42wERaRACy8Wdlc.webp"
                alt="Business Loan Process"
                width={600}
                height={400}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl">
                  <h4 className="text-lg font-semibold mb-2 text-blue-600">Why Our Clients Love Us</h4>
                  <div className="space-y-2">
                    {["Fast approval process", "Expert guidance", "Competitive rates", "Ongoing support"].map(
                      (benefit, i) => (
                        <div key={i} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-100 rounded-full opacity-50"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-200 rounded-full opacity-50"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
