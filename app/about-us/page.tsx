"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Users, Briefcase, TrendingUp, Award } from "lucide-react"
import { CheckCircle } from "lucide-react"
import Image from "next/image"
import CalendlyModal from "../components/CalendlyModal"

export default function AboutUsPage() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-blue-600 text-white py-16 md:py-24 overflow-hidden">
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
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-5xl font-bold mb-4 text-white drop-shadow-sm"
            >
              About Diamond Tier Solutions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl mb-6 text-blue-50"
            >
              Providing business funding consultation services since 2018
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 shadow-lg"
                onClick={() => setIsCalendlyOpen(true)}
              >
                Schedule a Consultation
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white p-8 rounded-lg shadow-md border border-slate-100"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800">Our Mission</h2>
              <p className="text-slate-600 mb-4">
                At Diamond Tier Solutions, we're committed to providing businesses with the educational resources and
                consultation services they need to make informed financial decisions. Our mission is to empower
                entrepreneurs and business owners by offering guidance on funding solutions that may help support growth
                and success.
              </p>
              <p className="text-slate-600">
                We believe that understanding funding options should be straightforward and tailored to each business's
                unique needs. options should be straightforward and tailored to each business's unique needs. That's why
                we offer consultation on a diverse range of financial products, from SBA loans to business credit cards,
                designed to help meet the varying demands of modern businesses.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative h-[300px] md:h-[400px] overflow-hidden rounded-lg shadow-md"
            >
              <motion.div
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "linear" }}
                className="absolute inset-0"
              >
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Benefits-of-Taking-Business-Loans.jpg-2cU41oDQic80RmUKRNt7mL560zX9AS.jpeg"
                  alt="Diamond Tier Capital Team"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800">Our Core Values</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              The principles that guide our business and shape our culture
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "Innovation",
                description: "We constantly seek new ways to provide value to our clients.",
              },
              {
                icon: Briefcase,
                title: "Integrity",
                description: "We operate with transparency and honesty in all our dealings.",
              },
              {
                icon: Users,
                title: "Client-Centric",
                description: "Our clients' needs are at the heart of everything we do.",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-50 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-slate-100"
              >
                <div className="bg-blue-50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <value.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-800">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-blue-700 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Achievements</h2>
            <p className="text-lg max-w-3xl mx-auto text-blue-50">
              Milestones that showcase our commitment to excellence and client success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 mb-10">
            {[
              { icon: Award, value: "500+", label: "Clients Consulted" },
              { icon: Briefcase, value: "200+", label: "Businesses Served" },
              { icon: Users, value: "10+", label: "Expert Team Members" },
              { icon: CheckCircle, value: "95%", label: "Client Satisfaction" },
            ].map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center shadow-md"
              >
                <achievement.icon className="h-10 w-10 mx-auto mb-4 text-blue-100" />
                <div className="text-3xl font-bold mb-2">{achievement.value}</div>
                <p className="text-blue-50">{achievement.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 shadow-lg"
              onClick={() => setIsCalendlyOpen(true)}
            >
              Schedule a Consultation
            </Button>
          </motion.div>
        </div>
      </section>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </div>
  )
}
