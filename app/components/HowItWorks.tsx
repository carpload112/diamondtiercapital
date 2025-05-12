"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRef } from "react"

const steps = [
  {
    title: "Free Consultation",
    description: "Discuss your business needs and goals with our expert team",
    emoji: "🤝",
  },
  {
    title: "Review Options",
    description: "Explore potential funding solutions tailored to your business",
    emoji: "✅",
  },
  {
    title: "Application Guidance",
    description: "Receive support throughout the application process",
    emoji: "📝",
  },
]

export default function HowItWorks() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95])

  return (
    <section ref={containerRef} className="py-24 bg-gradient-to-b from-white to-secondary/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[40%] h-[60%] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[40%] h-[60%] rounded-full bg-accent/5 blur-3xl"></div>
        <div className="absolute inset-0 bg-noise"></div>
      </div>

      <motion.div style={{ opacity, scale }} className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Simple Process
            </div>
            <h2 className="text-3xl font-bold mb-8 text-gradient">How It Works</h2>
            <div className="space-y-10">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-6 items-start"
                >
                  <div className="relative">
                    <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center glass-card rounded-2xl shadow-lg border border-gray-100">
                      <span className="text-2xl">{step.emoji}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-primary/20 to-transparent"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button className="mt-10 btn-gradient shadow-md hover:shadow-lg transition-all duration-300 group" asChild>
              <Link href="/contact">
                Get Started <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl transform rotate-3 scale-105"></div>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/benefits_of_business_loans-CALUvAhKQ2axz3O42wERaRACy8Wdlc.webp"
              alt="Business Consultation Process"
              width={600}
              height={400}
              className="rounded-2xl shadow-xl relative z-10"
            />

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 glass-card rounded-xl shadow-lg p-4 z-20 floating">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full">
                  <span className="text-primary font-bold">98%</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Client Satisfaction</p>
                  <p className="text-xs text-gray-500">Based on 500+ reviews</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
