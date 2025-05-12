"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  CreditCard,
  Percent,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Calendar,
  Briefcase,
  LineChart,
  PiggyBank,
  BarChart4,
  Users,
} from "lucide-react"
import CalendlyModal from "@/components/layout/CalendlyModal"
import { motion } from "framer-motion"
import Image from "next/image"

// Credit options data
const creditOptions = [
  {
    id: "business",
    title: "Business Credit Cards",
    description:
      "Business credit cards with introductory rate offers for qualified applicants, providing flexible credit access for various business needs.",
    icon: <CreditCard className="h-6 w-6 text-blue-600" />,
    features: [
      "0% intro APR periods on purchases",
      "0% intro APR periods on balance transfers",
      "Rewards on business spending",
      "Employee cards available",
    ],
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "credit-line",
    title: "Business Lines of Credit",
    description:
      "Revolving credit lines that may offer introductory rates for qualified businesses, providing ongoing access to funds as needed.",
    icon: <LineChart className="h-6 w-6 text-green-600" />,
    features: [
      "Draw funds as needed",
      "Only pay interest on what you use",
      "Potential introductory rate offers",
      "Revolving credit structure",
    ],
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "balance-transfer",
    title: "Balance Transfer Options",
    description:
      "Options designed specifically for transferring existing business debt to potentially take advantage of introductory rate periods.",
    icon: <PiggyBank className="h-6 w-6 text-purple-600" />,
    features: [
      "Consolidate existing debt",
      "Potential savings on interest",
      "Simplified payment management",
      "Various term options available",
    ],
    color: "from-purple-500 to-fuchsia-600",
  },
]

// Benefits data
const benefits = [
  "Potential interest savings during introductory periods",
  "Improved cash flow management",
  "Flexible funding for business opportunities",
  "Rewards on business spending with certain options",
  "Separation of business and personal expenses",
  "Build business credit history",
]

// Process steps data
const processSteps = [
  {
    step: 1,
    title: "Schedule a Consultation",
    description: "Book a free consultation with our team to discuss your business credit needs.",
    icon: <Calendar className="h-6 w-6 text-white" />,
  },
  {
    step: 2,
    title: "Review Credit Options",
    description: "We'll explain potential credit options that may be available for your business.",
    icon: <CreditCard className="h-6 w-6 text-white" />,
  },
  {
    step: 3,
    title: "Get Application Guidance",
    description: "Receive information about application processes and requirements.",
    icon: <Briefcase className="h-6 w-6 text-white" />,
  },
  {
    step: 4,
    title: "Make Informed Decisions",
    description: "Use our educational resources to make the best decisions for your business.",
    icon: <ShieldCheck className="h-6 w-6 text-white" />,
  },
]

// Potential uses data
const potentialUses = [
  {
    title: "Inventory Purchases",
    description: "Stock up on inventory to meet customer demand or prepare for busy seasons.",
    icon: <Briefcase className="h-6 w-6 text-blue-600" />,
  },
  {
    title: "Equipment Upgrades",
    description: "Invest in new equipment to improve efficiency and productivity.",
    icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
  },
  {
    title: "Marketing Campaigns",
    description: "Fund marketing initiatives to attract new customers and grow your business.",
    icon: <LineChart className="h-6 w-6 text-purple-600" />,
  },
  {
    title: "Managing Cash Flow",
    description: "Bridge timing gaps between accounts receivable and payable obligations.",
    icon: <PiggyBank className="h-6 w-6 text-amber-600" />,
  },
]

export default function ZeroPercentCreditLinesPage() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("business")

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background with animated gradient overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/business-financing.png"
            alt="Business credit options with introductory rates"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/95 via-indigo-800/90 to-purple-900/80" />

          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)",
            }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />

          {/* Noise texture overlay */}
          <div className="absolute inset-0 bg-noise"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block px-4 py-1 rounded-full glass-dark text-sm font-medium text-white mb-6 flex items-center justify-center mx-auto">
                <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
                Smart Business Financing Options
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-shadow-lg">
                Introductory Rate <span className="text-gradient shimmer">Credit Options</span>
              </h1>
              <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                Learn about business credit options that may offer introductory rates to help manage expenses and fund
                growth opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="btn-gradient text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                  onClick={() => setIsCalendlyOpen(true)}
                >
                  Schedule Consultation{" "}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 text-lg px-8 py-6 rounded-xl"
                  onClick={() => {
                    const benefitsSection = document.getElementById("benefits")
                    if (benefitsSection) {
                      benefitsSection.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  Explore Benefits
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating stats */}
        <div className="absolute bottom-10 left-10 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="glass-card px-4 py-2 rounded-full shadow-lg flex items-center"
          >
            <BarChart4 className="h-4 w-4 mr-2 text-indigo-600" />
            <span className="text-indigo-800 font-medium text-sm">Potential interest savings</span>
          </motion.div>
        </div>

        <div className="absolute bottom-10 right-10 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="glass-card px-4 py-2 rounded-full shadow-lg flex items-center"
          >
            <Users className="h-4 w-4 mr-2 text-indigo-600" />
            <span className="text-indigo-800 font-medium text-sm">Trusted by 10,000+ businesses</span>
          </motion.div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section id="benefits" className="py-20 bg-mesh relative overflow-hidden">
        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium mb-4">
              Key Benefits
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Why Consider These Options</h2>
            <p className="text-lg text-gray-600">
              Introductory rate credit options may offer several advantages for qualified businesses
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Percent className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-800">Introductory Rates</h3>
              <p className="text-gray-600">
                Some credit options offer introductory rates for qualified applicants, which may help with initial
                financing costs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-800">Flexible Credit Limits</h3>
              <p className="text-gray-600">
                Various credit limits may be available based on qualification factors and business needs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-indigo-800">Application Guidance</h3>
              <p className="text-gray-600">
                We provide information about application processes and requirements for various credit options.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Credit Options Section */}
      <section className="py-20 bg-gradient-to-b from-white to-indigo-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -left-[10%] w-[40%] h-[60%] rounded-full bg-indigo-500/5 blur-3xl"></div>
          <div className="absolute -bottom-[30%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-500/5 blur-3xl"></div>
          <div className="absolute inset-0 bg-noise"></div>
        </div>

        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium mb-4">
              Credit Options
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Explore Financing Solutions</h2>
            <p className="text-lg text-gray-600">
              Learn about different credit options that may offer introductory rates for qualified businesses
            </p>
          </motion.div>

          {/* Credit Option Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {creditOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveTab(option.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === option.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.title}
              </button>
            ))}
          </div>

          {/* Credit Option Content */}
          <div className="max-w-5xl mx-auto">
            {creditOptions.map((option) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: activeTab === option.id ? 1 : 0,
                  y: activeTab === option.id ? 0 : 20,
                  display: activeTab === option.id ? "block" : "none",
                }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${option.color} p-6 text-white`}>
                  <div className="flex items-center">
                    <div className="bg-white/20 p-3 rounded-lg mr-4">{option.icon}</div>
                    <h3 className="text-2xl font-bold">{option.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-6">{option.description}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <div className="bg-indigo-100 p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                          <CheckCircle className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-center">
                    <Button
                      className="btn-gradient shadow-md hover:shadow-lg transition-all duration-300 group"
                      onClick={() => setIsCalendlyOpen(true)}
                    >
                      Learn More About {option.title}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium mb-4">
              Our Process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">How It Works</h2>
            <p className="text-lg text-gray-600">
              Our straightforward process helps you understand credit options that may be available to your business
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="space-y-12">
              {processSteps.map((item, index) => (
                <motion.div key={item.step} variants={fadeIn} className="flex items-start">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg">
                      {item.icon}
                    </div>
                    {index < processSteps.length - 1 && (
                      <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-indigo-600/50 to-transparent"></div>
                    )}
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold mb-2 text-indigo-800">
                      Step {item.step}: {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Potential Uses Section */}
      <section className="py-20 bg-gradient-to-b from-indigo-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -right-[10%] w-[40%] h-[60%] rounded-full bg-indigo-500/5 blur-3xl"></div>
          <div className="absolute -bottom-[30%] -left-[10%] w-[40%] h-[60%] rounded-full bg-purple-500/5 blur-3xl"></div>
          <div className="absolute inset-0 bg-noise"></div>
        </div>

        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium mb-4">
              Business Applications
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Potential Business Uses</h2>
            <p className="text-lg text-gray-600">
              Explore how businesses may utilize credit options with introductory rates
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {potentialUses.map((use, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-3 rounded-lg mr-4 flex-shrink-0">{use.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-indigo-800">{use.title}</h3>
                    <p className="text-gray-600">{use.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              className="btn-gradient shadow-md hover:shadow-lg transition-all duration-300 group"
              onClick={() => setIsCalendlyOpen(true)}
            >
              Discuss Your Business Needs
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium mb-4">
              Common Questions
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Get answers to common questions about introductory rate credit options
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {[
                {
                  question: "How long do introductory rates typically last?",
                  answer:
                    "Introductory rate periods vary by credit card issuer and specific offer. They may range from several months to over a year for qualified applicants.",
                },
                {
                  question: "What happens after the introductory period?",
                  answer:
                    "After the introductory period ends, the standard interest rate will typically apply to any remaining balance. It's important to understand the terms before applying.",
                },
                {
                  question: "Is there a credit check required?",
                  answer:
                    "Yes, credit card issuers typically perform a credit check as part of their application process. Approval and terms are based on various factors including credit history.",
                },
                {
                  question: "What can I use these credit options for?",
                  answer:
                    "Business credit cards can typically be used for various legitimate business expenses, subject to the card issuer's terms and conditions.",
                },
                {
                  question: "How does your consultation service work?",
                  answer:
                    "Our consultation service begins with understanding your business needs and goals. We then provide educational information about credit options that may be suitable for your situation.",
                },
              ].map((faq, index) => (
                <motion.div key={index} variants={fadeIn} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-indigo-800 mb-3 flex items-start">
                      <ChevronRight className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 ml-7">{faq.answer}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-700 to-purple-800 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-noise opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -left-[10%] w-[40%] h-[60%] rounded-full bg-indigo-500/10 blur-3xl"></div>
          <div className="absolute -bottom-[30%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-500/10 blur-3xl"></div>
        </div>

        <div className="container px-4 mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Learn More?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Schedule a consultation to discuss business credit options that may be available to you.
            </p>
            <Button
              size="lg"
              className="bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={() => setIsCalendlyOpen(true)}
            >
              Schedule Your Free Consultation
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-100">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-gray-500 text-center">
              <strong>Disclaimer:</strong> Diamond Tier Capital provides consultation services only and does not
              directly provide credit cards or other financial products. All information is for educational purposes
              only. Credit card approval is subject to the issuer's criteria, and terms and conditions may vary.
            </p>
          </div>
        </div>
      </section>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </div>
  )
}
