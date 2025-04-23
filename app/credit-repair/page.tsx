"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle, Star, ArrowUp, RefreshCcw } from "lucide-react"
import ServicePageLayout from "../components/ServicePageLayout"
import CreditRepairForm from "../components/CreditRepairForm"

const caseStudies = [
  {
    name: "John D.",
    profession: "Small Business Owner",
    initialScore: 580,
    finalScore: 720,
    duration: "6 months",
    description: "John was struggling to get approved for a business loan due to past financial difficulties.",
    discrepanciesRemoved: [
      "Late payment on credit card (60 days)",
      "Incorrect account balance on personal loan",
      "Outdated address information",
    ],
    result: "Qualified for a $150,000 business expansion loan",
  },
  {
    name: "Sarah M.",
    profession: "Freelance Consultant",
    initialScore: 620,
    finalScore: 780,
    duration: "8 months",
    description: "As a freelancer, Sarah needed better credit to secure apartment leases and client contracts.",
    discrepanciesRemoved: [
      "Erroneous collection account",
      "Duplicate student loan entry",
      "Inaccurate credit utilization report",
    ],
    result: "Approved for premium rewards credit card with $25,000 limit",
  },
  {
    name: "Michael R.",
    profession: "Real Estate Investor",
    initialScore: 540,
    finalScore: 700,
    duration: "9 months",
    description: "Michael's poor credit was holding back his real estate investment plans.",
    discrepanciesRemoved: [
      "Fraudulent credit card account",
      "Outdated tax lien information",
      "Misreported loan payment history",
    ],
    result: "Secured $500,000 in property investment funding",
  },
]

const benefits = [
  "Increased chances of loan approval",
  "Lower interest rates on credit cards and loans",
  "Improved negotiating power with lenders",
  "Enhanced business opportunities",
  "Easier approval for commercial leases",
  "Reduced security deposits for utilities",
]

const testimonials = [
  {
    quote:
      "The team at Diamond Tier Capital transformed my credit score and helped me secure crucial funding for my startup.",
    author: "Alex T., Tech Entrepreneur",
  },
  {
    quote:
      "I was skeptical at first, but the results speak for themselves. My credit score improved by over 150 points!",
    author: "Linda M., Restaurant Owner",
  },
  {
    quote:
      "Their expertise in business credit repair is unmatched. I highly recommend their services to any business owner.",
    author: "Robert K., Real Estate Investor",
  },
]

export default function CreditRepairPage() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <ServicePageLayout
      title="Transform Your Credit Score"
      subtitle="Expert credit repair services tailored for businesses. Boost your score, unlock opportunities."
      icon={<RefreshCcw className="w-full h-full text-white/90 drop-shadow-lg" />}
      primaryCTA="Start Your Journey"
      secondaryCTA="Learn More"
    >
      {/* Application Form Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Credit Repair Journey Today</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fill out the form below to begin your path to better credit and expanded business opportunities
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <CreditRepairForm />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: "500+", label: "Businesses Helped" },
              { value: "150+", label: "Point Avg. Score Increase" },
              { value: "98%", label: "Client Satisfaction" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="text-center py-6">
                    <p className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</p>
                    <p className="text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center"
          >
            Our Credit Repair Process
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Comprehensive Analysis",
                description: "We meticulously review your credit reports from all bureaus.",
              },
              {
                title: "Strategic Planning",
                description: "Our experts develop a tailored plan to address your unique situation.",
              },
              {
                title: "Dispute Resolution",
                description: "We challenge inaccuracies and negotiate with creditors on your behalf.",
              },
              {
                title: "Ongoing Optimization",
                description: "Continuous monitoring and adjustments to maximize your credit score.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mb-4">
                      {index + 1}
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center"
          >
            Real Success Stories
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <div className="mb-4">
                      <CardTitle className="text-xl">{study.name}</CardTitle>
                      <p className="text-sm text-gray-500">{study.profession}</p>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-3xl font-bold text-red-500">{study.initialScore}</div>
                      <ArrowRight className="text-gray-400" />
                      <div className="text-3xl font-bold text-green-500">{study.finalScore}</div>
                    </div>
                    <p className="text-sm text-gray-500 text-center">Credit score improvement in {study.duration}</p>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600 mb-4">{study.description}</p>
                    <h4 className="font-semibold mb-2">Discrepancies Removed:</h4>
                    <ul className="list-disc pl-5 mb-4">
                      {study.discrepanciesRemoved.map((item, i) => (
                        <li key={i} className="text-sm text-gray-600">
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto">
                      <h4 className="font-semibold mb-2">Result:</h4>
                      <p className="text-green-600 font-medium">{study.result}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center"
          >
            Benefits of Professional Credit Repair
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start bg-white bg-opacity-10 p-6 rounded-lg"
              >
                <CheckCircle className="h-6 w-6 text-green-400 mr-4 flex-shrink-0 mt-1" />
                <p className="text-lg">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center"
          >
            What Our Clients Say
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                    <p className="font-semibold">{testimonial.author}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <motion.button
        className={`fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg transition-opacity duration-300 ${
          showScrollTop ? "opacity-100" : "opacity-0"
        }`}
        onClick={scrollToTop}
        initial={{ opacity: 0 }}
        animate={{ opacity: showScrollTop ? 1 : 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp className="h-6 w-6" />
      </motion.button>
    </ServicePageLayout>
  )
}
