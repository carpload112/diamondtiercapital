"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import CalendlyModal from "@/components/layout/CalendlyModal"
import { Calendar, Users, Briefcase, TrendingUp, Award, CheckCircle, ArrowRight, ChevronDown } from "lucide-react"

export default function AboutUsPage() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const heroRef = useRef(null)
  const missionRef = useRef(null)
  const valuesRef = useRef(null)
  const achievementsRef = useRef(null)

  // Parallax effect for hero section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])

  // Scroll to section function
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="bg-white">
      {/* Hero Section - Immersive Parallax */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ opacity: heroOpacity, y: heroY, scale: heroScale }} className="absolute inset-0 z-0">
          <Image
            src="/abstract-financial-grid.png"
            alt="Abstract financial grid"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-800/80 to-blue-700/80" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-block mb-6 bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full">
              <span className="text-sm font-medium">Providing business funding consultation services since 2018</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              About <span className="text-gradient bg-gradient-to-r from-blue-200 to-purple-200">Diamond Tier</span>{" "}
              Solutions
            </h1>

            <p className="text-xl md:text-2xl mb-10 text-blue-50 max-w-3xl mx-auto leading-relaxed">
              We're committed to providing businesses with the educational resources and consultation services they need
              to make informed financial decisions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 shadow-lg group"
                onClick={() => setIsCalendlyOpen(true)}
              >
                Schedule a Consultation
                <Calendar className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white/10"
                onClick={() => scrollToSection(missionRef)}
              >
                Learn More
                <ChevronDown className="ml-2 h-4 w-4 animate-bounce" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-white/70 text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4 overflow-x-auto hide-scrollbar">
            <div className="flex space-x-6">
              <button
                onClick={() => scrollToSection(missionRef)}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                Our Mission
              </button>
              <button
                onClick={() => scrollToSection(valuesRef)}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                Our Values
              </button>
              <button
                onClick={() => scrollToSection(achievementsRef)}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                Our Achievements
              </button>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50 whitespace-nowrap"
              onClick={() => setIsCalendlyOpen(true)}
            >
              Schedule Consultation
            </Button>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section ref={missionRef} className="py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
                Our Purpose
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Our Mission</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Empowering businesses with the knowledge and resources they need to succeed
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Our Mission</h3>
                  <p className="text-gray-600 mb-6">
                    At Diamond Tier Solutions, we're committed to providing businesses with the educational resources
                    and consultation services they need to make informed financial decisions. Our mission is to empower
                    entrepreneurs and business owners by offering guidance on funding solutions that may help support
                    growth and success.
                  </p>
                  <p className="text-gray-600">
                    We believe that understanding funding options should be straightforward and tailored to each
                    business's unique needs. That's why we offer consultation on a diverse range of financial products,
                    from SBA loans to business credit cards, designed to help meet the varying demands of modern
                    businesses.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-slate-700 font-medium">Personalized Approach</span>
                    </div>

                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-slate-700 font-medium">Educational Focus</span>
                    </div>

                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-slate-700 font-medium">Client Success</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative h-[400px] overflow-hidden rounded-2xl shadow-xl"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
                </motion.div>

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">Trusted Advisors</h3>
                  <p className="text-white/90">Providing expert guidance since 2018</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section ref={valuesRef} className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50 to-white" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-50 rounded-full opacity-70" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-50 rounded-full opacity-70" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
              Our Principles
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our business and shape our culture
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
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
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 h-full transform group-hover:-translate-y-2">
                  <div className="bg-blue-50 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section
        ref={achievementsRef}
        className="py-24 bg-gradient-to-r from-blue-700 to-blue-600 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <Image src="/abstract-dots-pattern.png" alt="Abstract pattern" fill className="object-cover" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
              Our Impact
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Achievements</h2>
            <p className="text-xl text-blue-50 max-w-3xl mx-auto">
              Milestones that showcase our commitment to excellence and client success
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Award, value: "500+", label: "Clients Consulted" },
              { icon: Briefcase, value: "200+", label: "Businesses Served" },
              { icon: Users, value: "10+", label: "Expert Team Members" },
              { icon: CheckCircle, value: "95%", label: "Client Satisfaction" },
            ].map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 h-full transform group-hover:-translate-y-2 transition-transform">
                  <achievement.icon className="h-12 w-12 mx-auto mb-4 text-blue-100 group-hover:scale-110 transition-transform" />
                  <div className="text-4xl font-bold mb-2">{achievement.value}</div>
                  <p className="text-blue-50">{achievement.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 opacity-50" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="relative p-8 md:p-12">
              <div className="absolute inset-0 opacity-10">
                <Image src="/abstract-financial-pattern.png" alt="Abstract pattern" fill className="object-cover" />
              </div>

              <div className="relative z-10 text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl font-bold mb-6 text-white"
                >
                  Ready to Take Your Business to the Next Level?
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-lg text-blue-50 mb-8 max-w-2xl mx-auto"
                >
                  Schedule a consultation with our team to discuss your business funding needs and discover the
                  solutions that can help you achieve your goals.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button
                    size="lg"
                    className="bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 shadow-lg group"
                    onClick={() => setIsCalendlyOpen(true)}
                  >
                    Schedule a Consultation
                    <Calendar className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-transparent border-white text-white hover:bg-white/10"
                    asChild
                  >
                    <Link href="/contact">
                      Contact Us
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendly Modal */}
      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />

      {/* Add custom styles for hiding scrollbar */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
