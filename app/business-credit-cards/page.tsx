"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  CreditCard,
  ArrowRight,
  ChevronRight,
  Star,
  Shield,
  Wallet,
  Clock,
  BadgePercent,
} from "lucide-react"
import CalendlyModal from "@/components/layout/CalendlyModal"
import { motion } from "framer-motion"

const cardTypes = [
  {
    id: "cashback",
    name: "Cash Back Cards",
    description: "Business credit cards that offer cash back rewards on purchases.",
    icon: <BadgePercent className="h-10 w-10 text-indigo-500" />,
    features: [
      "Earn cash back on business expenses",
      "Often higher rewards in business-specific categories",
      "Some offer welcome bonuses for new cardholders",
      "May have annual fees depending on rewards structure",
    ],
  },
  {
    id: "travel",
    name: "Travel Reward Cards",
    description: "Cards that provide travel-related benefits and rewards for business travelers.",
    icon: <Wallet className="h-10 w-10 text-indigo-500" />,
    features: [
      "Earn points or miles for travel",
      "Airport lounge access with some premium cards",
      "Travel insurance benefits",
      "No foreign transaction fees on many travel cards",
    ],
  },
  {
    id: "lowinterest",
    name: "Low Interest & Balance Transfer Cards",
    description: "Cards with lower interest rates or promotional balance transfer offers.",
    icon: <Clock className="h-10 w-10 text-indigo-500" />,
    features: [
      "Lower ongoing APR than typical rewards cards",
      "Introductory 0% APR periods on some cards",
      "Balance transfer options for existing debt",
      "Fewer rewards but more favorable interest terms",
    ],
  },
]

const benefits = [
  {
    title: "Separate Business & Personal Expenses",
    description: "Keep your business finances organized and simplify tax preparation",
    icon: <Shield className="h-8 w-8 text-indigo-500" />,
  },
  {
    title: "Build Business Credit History",
    description: "Establish and grow your business credit profile separate from personal credit",
    icon: <Star className="h-8 w-8 text-indigo-500" />,
  },
  {
    title: "Manage Employee Spending",
    description: "Issue additional cards with customized spending limits for team members",
    icon: <Wallet className="h-8 w-8 text-indigo-500" />,
  },
  {
    title: "Detailed Expense Reporting",
    description: "Access comprehensive spending analytics and categorization tools",
    icon: <CreditCard className="h-8 w-8 text-indigo-500" />,
  },
  {
    title: "Cash Flow Management",
    description: "Leverage grace periods to optimize your business cash flow",
    icon: <Clock className="h-8 w-8 text-indigo-500" />,
  },
  {
    title: "Potential Tax Benefits",
    description: "Business expenses may be tax-deductible (consult with a tax professional)",
    icon: <BadgePercent className="h-8 w-8 text-indigo-500" />,
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

export default function BusinessCreditCardsPage() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("cashback")
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
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 z-0"></div>
        <div className="absolute inset-0 bg-[url('/abstract-financial-pattern.png')] bg-no-repeat bg-cover opacity-5 z-0"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-indigo-500 rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500 rounded-full opacity-10 animate-float-delay"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-500 rounded-full opacity-10 animate-float-slow"></div>

        <div className="container relative px-4 mx-auto z-10">
          <motion.div className="max-w-3xl mx-auto text-center" initial="hidden" animate="visible" variants={fadeIn}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              Business Credit Card Information
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Educational resources about business credit card options and how they may benefit your business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                onClick={() => setIsCalendlyOpen(true)}
              >
                Learn More
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-all duration-300"
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
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <CreditCard className="h-12 w-12 text-indigo-600" />
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                      Business Credit Card Overview
                    </h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      Business credit cards are designed specifically for business use, offering features and benefits
                      tailored to business needs. They can help separate business and personal expenses while providing
                      rewards and benefits for business spending.
                    </p>
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      {[
                        "Cash back on business purchases",
                        "Travel rewards for business trips",
                        "Expense management tools",
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          variants={fadeIn}
                          className="flex items-start bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl"
                        >
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-800">{feature}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Card Types Section */}
      <section className="py-16 relative">
        <div className="container px-4 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              Types of Business Credit Cards
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Explore different card options designed for various business needs
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="cashback" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-1 rounded-xl">
                {cardTypes.map((type) => (
                  <TabsTrigger
                    key={type.id}
                    value={type.id}
                    className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md rounded-lg py-3"
                  >
                    {type.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {cardTypes.map((cardType) => (
                <TabsContent key={cardType.id} value={cardType.id} className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="border-none shadow-lg bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden">
                      <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                          <div className="md:w-1/3">
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl flex flex-col items-center text-center h-full">
                              {cardType.icon}
                              <h3 className="text-2xl font-bold mt-4 mb-2 text-indigo-700">{cardType.name}</h3>
                              <p className="text-gray-600">{cardType.description}</p>
                            </div>
                          </div>
                          <div className="md:w-2/3">
                            <h4 className="font-semibold text-lg mb-4 text-indigo-700">Key Features:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {cardType.features.map((feature, i) => (
                                <div
                                  key={i}
                                  className="flex items-start bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl"
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

      {/* Benefits Section */}
      <section className="py-16 relative bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-[url('/abstract-dots-pattern.png')] bg-no-repeat bg-cover opacity-5 z-0"></div>
        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              Benefits of Business Credit Cards
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Discover how business credit cards can support your company's financial management
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
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-indigo-700">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              Application Process
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Understanding the typical steps involved in applying for a business credit card
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-600 to-purple-600 hidden md:block"></div>

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
                    title: "Research Options",
                    description:
                      "Compare different business credit cards to find the best fit for your business needs.",
                  },
                  {
                    step: 2,
                    title: "Gather Documentation",
                    description: "Prepare business and personal financial information needed for the application.",
                  },
                  {
                    step: 3,
                    title: "Submit Application",
                    description: "Complete the application with accurate business and personal information.",
                  },
                  {
                    step: 4,
                    title: "Receive Decision",
                    description: "Wait for approval, which may be instant or take several business days.",
                  },
                ].map((item) => (
                  <motion.div key={item.step} variants={fadeIn} className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center flex-shrink-0 mt-1 z-10">
                      <span className="font-bold">{item.step}</span>
                    </div>
                    <div className="ml-6 bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg flex-1">
                      <h3 className="text-xl font-semibold mb-2 text-indigo-700">{item.title}</h3>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Considerations Section */}
      <section className="py-16 relative bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-[url('/abstract-financial-grid.png')] bg-no-repeat bg-cover opacity-5 z-0"></div>
        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              Important Considerations
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Key factors to evaluate when exploring business credit card options
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Annual Fees",
                description: "Consider whether the card's benefits justify any annual fee it may charge.",
                icon: <BadgePercent className="h-8 w-8 text-indigo-500" />,
              },
              {
                title: "Interest Rates",
                description: "Compare APRs, especially if you may carry a balance occasionally.",
                icon: <Clock className="h-8 w-8 text-indigo-500" />,
              },
              {
                title: "Rewards Structure",
                description: "Choose rewards that align with your business spending patterns.",
                icon: <Star className="h-8 w-8 text-indigo-500" />,
              },
              {
                title: "Credit Requirements",
                description: "Be aware of the credit score typically needed for approval.",
                icon: <Shield className="h-8 w-8 text-indigo-500" />,
              },
              {
                title: "Personal Guarantee",
                description: "Most small business cards require a personal guarantee from the business owner.",
                icon: <CreditCard className="h-8 w-8 text-indigo-500" />,
              },
              {
                title: "Additional Card Benefits",
                description: "Evaluate perks like purchase protection, extended warranties, and travel insurance.",
                icon: <Wallet className="h-8 w-8 text-indigo-500" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mr-4 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-indigo-700">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 z-0"></div>
        <div className="absolute inset-0 bg-[url('/abstract-business-pattern.png')] bg-no-repeat bg-cover opacity-10 z-0"></div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full opacity-10 animate-float-delay"></div>

        <div className="container px-4 mx-auto text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Learn More?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-indigo-100">
              Schedule a consultation to discuss business credit card options and how they may fit your business needs.
            </p>
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all duration-300 group"
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
