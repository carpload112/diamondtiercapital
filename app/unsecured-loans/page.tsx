"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  Banknote,
  Clock,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Building,
  CreditCard,
  BarChart,
  Calendar,
  DollarSign,
  FileText,
} from "lucide-react"
import CalendlyModal from "@/components/layout/CalendlyModal"
import { motion } from "framer-motion"

const loanTypes = [
  {
    id: "term",
    name: "Term Loans",
    description: "Traditional unsecured business loans with fixed repayment terms.",
    icon: <Calendar className="h-10 w-10 text-indigo-500" />,
    features: [
      "Fixed monthly payments",
      "Predictable repayment schedule",
      "Typically higher loan amounts",
      "Longer repayment periods available",
    ],
  },
  {
    id: "line",
    name: "Lines of Credit",
    description: "Flexible funding that allows businesses to draw funds as needed.",
    icon: <CreditCard className="h-10 w-10 text-indigo-500" />,
    features: [
      "Draw funds as needed",
      "Pay interest only on what you use",
      "Revolving credit availability",
      "Flexible for managing cash flow",
    ],
  },
  {
    id: "revenue",
    name: "Revenue-Based Financing",
    description: "Financing options where repayment is tied to business revenue.",
    icon: <BarChart className="h-10 w-10 text-indigo-500" />,
    features: [
      "Payments fluctuate with revenue",
      "No fixed monthly payment",
      "Typically faster approval process",
      "Less emphasis on credit scores",
    ],
  },
]

const benefits = [
  {
    title: "No Collateral Required",
    description: "Access financing without pledging specific business assets",
    icon: <ShieldCheck className="h-8 w-8 text-indigo-500" />,
  },
  {
    title: "Faster Processing",
    description: "Often quicker approval and funding than secured options",
    icon: <Clock className="h-8 w-8 text-indigo-500" />,
  },
  {
    title: "Flexible Use of Funds",
    description: "Use capital for various business needs and opportunities",
    icon: <Banknote className="h-8 w-8 text-indigo-500" />,
  },
  {
    title: "Build Business Credit",
    description: "Establish and improve your business credit profile",
    icon: <Building className="h-8 w-8 text-indigo-500" />,
  },
  {
    title: "Preserve Equity",
    description: "Grow without diluting ownership in your business",
    icon: <DollarSign className="h-8 w-8 text-indigo-500" />,
  },
  {
    title: "Simplified Documentation",
    description: "Often requires less paperwork than traditional loans",
    icon: <FileText className="h-8 w-8 text-indigo-500" />,
  },
]

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
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

export default function UnsecuredLoansPage() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("term")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 z-0"></div>
        <div className="absolute inset-0 bg-[url('/abstract-financial-pattern.png')] bg-no-repeat bg-cover opacity-5 z-0"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500 rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-500 rounded-full opacity-10 animate-float-delay"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500 rounded-full opacity-10 animate-float-slow"></div>

        <div className="container relative px-4 mx-auto z-10">
          <motion.div className="max-w-3xl mx-auto text-center" initial="hidden" animate="visible" variants={fadeIn}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Unsecured Business Financing
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Learn about financing options that may not require collateral to help grow your business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                onClick={() => setIsCalendlyOpen(true)}
              >
                Learn More
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-300"
                onClick={() => setIsCalendlyOpen(true)}
              >
                Schedule Consultation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 relative">
        <div className="container px-4 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Key Features
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Understanding the distinctive characteristics of unsecured business financing
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={fadeIn}
              className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-700">No Collateral Requirement</h3>
              <p className="text-gray-600 leading-relaxed">
                These financing options typically don't require specific business assets as collateral, making them
                accessible to businesses without significant physical assets.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-700">Streamlined Process</h3>
              <p className="text-gray-600 leading-relaxed">
                Learn about the application process for unsecured business financing options, which often features
                faster approvals and less documentation than traditional loans.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-4">
                <Banknote className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-700">Flexible Use</h3>
              <p className="text-gray-600 leading-relaxed">
                Funds may be used for various legitimate business purposes based on your needs, from working capital and
                inventory to expansion and equipment.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Financing Types Section */}
      <section className="py-16 relative bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute inset-0 bg-[url('/abstract-dots-pattern.png')] bg-no-repeat bg-cover opacity-5 z-0"></div>
        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Types of Unsecured Financing
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Explore different financing options that may be available without collateral requirements
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="term" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-1 rounded-xl">
                {loanTypes.map((type) => (
                  <TabsTrigger
                    key={type.id}
                    value={type.id}
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md rounded-lg py-3"
                  >
                    {type.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {loanTypes.map((loanType) => (
                <TabsContent key={loanType.id} value={loanType.id} className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="border-none shadow-lg bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden">
                      <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                          <div className="md:w-1/3">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl flex flex-col items-center text-center h-full">
                              {loanType.icon}
                              <h3 className="text-2xl font-bold mt-4 mb-2 text-blue-700">{loanType.name}</h3>
                              <p className="text-gray-600">{loanType.description}</p>
                            </div>
                          </div>
                          <div className="md:w-2/3">
                            <h4 className="font-semibold text-lg mb-4 text-blue-700">Key Features:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {loanType.features.map((feature, i) => (
                                <div
                                  key={i}
                                  className="flex items-start bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl"
                                >
                                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Consultation Process Section */}
      <section className="py-16 relative">
        <div className="container px-4 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Our Consultation Process
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">How we help you understand your financing options</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-600 to-indigo-600 hidden md:block"></div>

              <motion.div
                className="space-y-12"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  {
                    step: 1,
                    title: "Discuss Your Needs",
                    description: "We learn about your business financing needs and goals.",
                  },
                  {
                    step: 2,
                    title: "Review Financing Options",
                    description: "We explain potential financing options that may be available for your situation.",
                  },
                  {
                    step: 3,
                    title: "Provide Educational Resources",
                    description: "We offer information to help you make informed decisions about your financing.",
                  },
                  {
                    step: 4,
                    title: "Ongoing Support",
                    description: "We provide continued educational support as you explore financing options.",
                  },
                ].map((item) => (
                  <motion.div key={item.step} variants={fadeIn} className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 mt-1 z-10">
                      <span className="font-bold">{item.step}</span>
                    </div>
                    <div className="ml-6 bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg flex-1">
                      <h3 className="text-xl font-semibold mb-2 text-blue-700">{item.title}</h3>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 relative bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute inset-0 bg-[url('/abstract-business-pattern.png')] bg-no-repeat bg-cover opacity-5 z-0"></div>
        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Benefits of Unsecured Financing
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Potential advantages of unsecured business financing options
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-blue-700">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Common Considerations Section */}
      <section className="py-16 relative">
        <div className="container px-4 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Common Considerations
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Factors that may be evaluated for unsecured business financing
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              "Business operating history",
              "Monthly revenue",
              "Credit profile",
              "Business location",
              "Industry type",
              "Banking relationship",
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white/80 backdrop-blur-lg p-5 rounded-xl shadow-md flex items-center"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mr-4 flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <p className="font-medium text-gray-700">{item}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 relative bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute inset-0 bg-[url('/abstract-financial-grid.png')] bg-no-repeat bg-cover opacity-5 z-0"></div>
        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Common questions about unsecured business financing
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto space-y-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                q: "How much financing may be available with unsecured options?",
                a: "Financing amounts vary based on multiple factors including business qualifications, lender criteria, and specific financing products. We can discuss potential options during a consultation.",
              },
              {
                q: "What can unsecured financing be used for?",
                a: "Unsecured financing can typically be used for various legitimate business purposes, including working capital, equipment purchases, expansion, or inventory, subject to lender terms.",
              },
              {
                q: "How long does the application process typically take?",
                a: "Application processing times vary by lender and financing type. Some options may offer decisions within days, while others may take longer.",
              },
              {
                q: "Is a personal guarantee required?",
                a: "While unsecured financing may not require specific collateral, many lenders do require a personal guarantee. We can discuss this in more detail during a consultation.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg"
              >
                <h3 className="text-lg font-semibold mb-3 text-blue-700">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 z-0"></div>
        <div className="absolute inset-0 bg-[url('/abstract-business-pattern.png')] bg-no-repeat bg-cover opacity-10 z-0"></div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full opacity-10 animate-float-delay"></div>

        <div className="container px-4 mx-auto text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Learn More?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
              Schedule a consultation to discuss financing options that may be available for your business.
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={() => setIsCalendlyOpen(true)}
            >
              Schedule Your Free Consultation
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-gray-500 text-center">
              <strong>Disclaimer:</strong> Diamond Tier Capital provides consultation services only and does not
              directly provide loans or other financial products. All information is for educational purposes only. Loan
              approval is subject to lender criteria, and terms and conditions may vary.
            </p>
          </div>
        </div>
      </section>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </div>
  )
}
