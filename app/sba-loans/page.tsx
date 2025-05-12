"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  Building,
  ArrowRight,
  ChevronRight,
  FileText,
  DollarSign,
  Clock,
  BarChart,
  ShieldCheck,
  Users,
  Briefcase,
} from "lucide-react"
import CalendlyModal from "@/components/layout/CalendlyModal"
import { motion } from "framer-motion"

const loanTypes = [
  {
    id: "7a",
    name: "7(a) Loans",
    description: "The SBA's primary program for providing financial assistance to small businesses.",
    icon: <DollarSign className="h-10 w-10 text-blue-500" />,
    features: [
      "Loan amounts up to $5 million",
      "Can be used for working capital",
      "Longer repayment terms available",
      "Competitive interest rates",
    ],
  },
  {
    id: "504",
    name: "504 Loans",
    description: "Financing for major fixed assets that promote business growth and job creation.",
    icon: <Building className="h-10 w-10 text-blue-500" />,
    features: [
      "For purchasing fixed assets",
      "Below-market, fixed interest rates",
      "10-20 year repayment terms",
      "Lower down payments",
    ],
  },
  {
    id: "micro",
    name: "Microloans",
    description: "Small, short-term loans to help small businesses and certain not-for-profit childcare centers.",
    icon: <Briefcase className="h-10 w-10 text-blue-500" />,
    features: ["Loans up to $50,000", "Working capital or inventory", "Equipment purchases", "Shorter repayment terms"],
  },
]

const benefits = [
  {
    title: "Lower Down Payments",
    description: "SBA loans often require smaller down payments than conventional loans",
    icon: <DollarSign className="h-8 w-8 text-blue-500" />,
  },
  {
    title: "Longer Repayment Terms",
    description: "Extended repayment periods that may improve cash flow",
    icon: <Clock className="h-8 w-8 text-blue-500" />,
  },
  {
    title: "Competitive Interest Rates",
    description: "Interest rates are negotiated between borrowers and lenders, subject to SBA maximums",
    icon: <BarChart className="h-8 w-8 text-blue-500" />,
  },
  {
    title: "Technical Assistance",
    description: "Access to SBA resource partners for business guidance",
    icon: <Users className="h-8 w-8 text-blue-500" />,
  },
  {
    title: "Flexible Overhead Requirements",
    description: "May have more flexible requirements than conventional loans",
    icon: <ShieldCheck className="h-8 w-8 text-blue-500" />,
  },
  {
    title: "Established Framework",
    description: "Well-established program with clear guidelines and processes",
    icon: <FileText className="h-8 w-8 text-blue-500" />,
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

export default function SBALoansPage() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("7a")
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
              SBA Loan Information
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Educational resources about Small Business Administration loan programs and how they may benefit your
              business
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

      {/* Overview Section */}
      <section className="py-16 relative">
        <div className="container px-4 mx-auto">
          <motion.div
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                  <div className="md:w-1/4 flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                      <Building className="h-12 w-12 text-blue-600" />
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                      SBA Loan Overview
                    </h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      SBA loans are government-backed loans designed to help small businesses access financing. The
                      Small Business Administration doesn't directly lend money but instead guarantees a portion of
                      loans made by participating lenders, reducing their risk and making it easier for small businesses
                      to obtain financing.
                    </p>
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      {["Lower down payments", "Longer repayment terms", "Competitive interest rates"].map(
                        (feature, index) => (
                          <motion.div
                            key={index}
                            variants={fadeIn}
                            className="flex items-start bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl"
                          >
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-800">{feature}</span>
                          </motion.div>
                        ),
                      )}
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Loan Types Section */}
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
              Types of SBA Loans
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Explore different SBA loan programs designed for various business needs
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="7a" value={activeTab} onValueChange={setActiveTab} className="w-full">
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

      {/* Application Process Section */}
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
              SBA Loan Process
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Understanding the typical steps involved in applying for an SBA loan
            </p>
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
                    title: "Determine Eligibility",
                    description: "Assess if your business meets SBA size standards and other eligibility requirements.",
                  },
                  {
                    step: 2,
                    title: "Prepare Documentation",
                    description:
                      "Gather business and personal financial statements, business plans, and other required documents.",
                  },
                  {
                    step: 3,
                    title: "Find a Lender",
                    description:
                      "Identify SBA-approved lenders that participate in the loan program you're interested in.",
                  },
                  {
                    step: 4,
                    title: "Submit Application",
                    description:
                      "Complete the application with your chosen lender, providing all required documentation.",
                  },
                  {
                    step: 5,
                    title: "Underwriting Process",
                    description: "The lender reviews your application and the SBA provides final approval.",
                  },
                  {
                    step: 6,
                    title: "Closing",
                    description: "Sign loan documents and meet any closing requirements to receive funds.",
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
              Benefits of SBA Loans
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Potential advantages of SBA-backed financing options
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

      {/* Statistics Section */}
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
              SBA Loan Statistics
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">Key figures about SBA lending programs</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { value: "$5M+", label: "Maximum 7(a) loan amount" },
              { value: "10-25", label: "Years for typical repayment terms" },
              { value: "75-85%", label: "Typical SBA guarantee percentage" },
              { value: "Billions", label: "Annual SBA loan volume" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg text-center"
              >
                <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                  {stat.value}
                </div>
                <p className="text-gray-600">{stat.label}</p>
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
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">Common questions about SBA loans</p>
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
                q: "What types of businesses qualify for SBA loans?",
                a: "Most for-profit small businesses that operate in the U.S. may qualify. The SBA has specific size standards that vary by industry. Businesses must also demonstrate good character, credit, management, and ability to repay the loan.",
              },
              {
                q: "How long does it take to get an SBA loan?",
                a: "The timeline varies by loan type and lender. Some SBA Express loans may be processed in as little as 36 hours, while standard 7(a) loans typically take 60-90 days from application to funding.",
              },
              {
                q: "What can SBA loan funds be used for?",
                a: "SBA loans can be used for many business purposes including working capital, purchasing equipment or real estate, refinancing debt, or acquiring a business, depending on the specific loan program.",
              },
              {
                q: "Do I need collateral for an SBA loan?",
                a: "While the SBA does not require collateral for all loans, lenders may require it based on their policies. For loans over $350,000, the SBA requires lenders to collateralize the loan to the maximum extent possible.",
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
              Schedule a consultation to discuss SBA loan options and how they may fit your business needs.
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
              directly provide SBA loans or other financial products. All information is for educational purposes only.
              SBA loan approval is subject to SBA and lender criteria, and terms and conditions may vary.
            </p>
          </div>
        </div>
      </section>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </div>
  )
}
