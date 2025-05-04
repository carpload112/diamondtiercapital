"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle, CreditCard, ArrowUp } from "lucide-react"
import CalendlyModal from "@/components/CalendlyModal"
import Image from "next/image"

const cardTypes = [
  {
    name: "Cash Back Cards",
    description: "Business credit cards that offer cash back rewards on purchases.",
    features: [
      "Earn cash back on business expenses",
      "Often higher rewards in business-specific categories",
      "Some offer welcome bonuses for new cardholders",
      "May have annual fees depending on rewards structure",
    ],
  },
  {
    name: "Travel Reward Cards",
    description: "Cards that provide travel-related benefits and rewards for business travelers.",
    features: [
      "Earn points or miles for travel",
      "Airport lounge access with some premium cards",
      "Travel insurance benefits",
      "No foreign transaction fees on many travel cards",
    ],
  },
  {
    name: "Low Interest & Balance Transfer Cards",
    description: "Cards with lower interest rates or promotional balance transfer offers.",
    features: [
      "Lower ongoing APR than typical rewards cards",
      "Introductory 0% APR periods on some cards",
      "Balance transfer options for existing debt",
      "Fewer rewards but more favorable interest terms",
    ],
  },
]

const benefits = [
  "Separate business and personal expenses",
  "Build business credit history",
  "Manage employee spending with additional cards",
  "Access to detailed expense reporting",
  "Cash flow management with grace periods",
  "Potential tax benefits from business expenses",
]

const considerations = [
  {
    title: "Annual Fees",
    description: "Consider whether the card's benefits justify any annual fee it may charge.",
  },
  {
    title: "Interest Rates",
    description: "Compare APRs, especially if you may carry a balance occasionally.",
  },
  {
    title: "Rewards Structure",
    description: "Choose rewards that align with your business spending patterns.",
  },
  {
    title: "Credit Requirements",
    description: "Be aware of the credit score typically needed for approval.",
  },
  {
    title: "Personal Guarantee",
    description: "Most small business cards require a personal guarantee from the business owner.",
  },
]

export default function BusinessCreditCardsPage() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/how-it-works-01.jpg-3Xl1vFULfOfYaJucLehBRVri5K1ZPO.jpeg"
            alt="Business Credit Cards Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-900/90 to-blue-900/80" />
        </div>

        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-white lg:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Business Credit Card Information</h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8">
                Educational resources about business credit card options and how they may benefit your business.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100"
                onClick={() => setIsCalendlyOpen(true)}
              >
                Schedule a Consultation
              </Button>
            </div>
            <div className="lg:w-1/2">
              <Card className="border-none shadow-xl">
                <CardHeader className="bg-primary text-white">
                  <CardTitle className="text-xl">Business Credit Card Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <CreditCard className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold">Cash Back Cards:</span>
                        <span className="text-muted-foreground"> Earn cash back on business purchases</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CreditCard className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold">Travel Reward Cards:</span>
                        <span className="text-muted-foreground"> Earn points or miles for business travel</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CreditCard className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold">Low Interest Cards:</span>
                        <span className="text-muted-foreground"> Better rates for carrying balances</span>
                      </div>
                    </li>
                  </ul>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-muted-foreground mb-4">
                      Diamond Tier Capital provides consultation services to help businesses understand credit card
                      options. We do not directly provide credit cards.
                    </p>
                    <Button className="w-full" onClick={() => setIsCalendlyOpen(true)}>
                      Learn More About Business Credit Cards
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Card Types Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-title">
            <h2 className="mb-4">Types of Business Credit Cards</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Educational information about different business credit card options
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {cardTypes.map((cardType, index) => (
              <Card key={index} className="border-none shadow-card h-full">
                <CardHeader>
                  <CardTitle className="text-xl">{cardType.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{cardType.description}</p>
                  <div>
                    <h4 className="font-semibold mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {cardType.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-primary mr-2 mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section bg-primary text-white">
        <div className="container">
          <div className="section-title">
            <h2 className="mb-4">Benefits of Business Credit Cards</h2>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Potential advantages of using business credit cards for your company
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start bg-white/10 p-6 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                <p>{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Considerations Section */}
      <section className="section bg-secondary">
        <div className="container">
          <div className="section-title">
            <h2 className="mb-4">Important Considerations</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Factors to consider when evaluating business credit card options
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {considerations.map((item, index) => (
              <Card key={index} className="border-none shadow-card h-full">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-title">
            <h2 className="mb-4">Application Process</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              General overview of the business credit card application process
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              {
                title: "Research Options",
                description: "Compare different business credit cards to find the best fit for your business needs.",
              },
              {
                title: "Gather Documentation",
                description: "Prepare business and personal financial information needed for the application.",
              },
              {
                title: "Submit Application",
                description: "Complete the application with accurate business and personal information.",
              },
              {
                title: "Receive Decision",
                description: "Wait for approval, which may be instant or take several business days.",
              },
            ].map((step, index) => (
              <Card key={index} className="border-none shadow-card h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Common Requirements Section */}
      <section className="section bg-secondary">
        <div className="container">
          <div className="section-title">
            <h2 className="mb-4">Common Application Requirements</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Information typically needed when applying for a business credit card
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
            <Card className="border-none shadow-card h-full">
              <CardHeader>
                <CardTitle className="text-lg">Business Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Legal business name",
                    "Business address and phone number",
                    "Tax identification number (EIN)",
                    "Business structure (LLC, corporation, etc.)",
                    "Years in business",
                    "Annual business revenue",
                    "Number of employees",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-none shadow-card h-full">
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Name and contact information",
                    "Social Security number",
                    "Personal income",
                    "Role in the business",
                    "Personal credit score",
                    "Home address",
                    "Date of birth",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Learn More About Business Credit Cards?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            Schedule a consultation to discuss business credit card options and how they may fit your business needs.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6 bg-white text-primary hover:bg-gray-100"
            onClick={() => setIsCalendlyOpen(true)}
          >
            Schedule Your Free Consultation <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Important Disclaimer</h2>
            <Card className="border-none shadow-card">
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  Diamond Tier Capital provides consultation services only. We do not directly provide credit cards or
                  other financial products. The information provided is for educational purposes only and should not be
                  considered financial advice. Credit card approval is subject to the issuer's criteria, and terms and
                  conditions may vary. We recommend consulting with a financial advisor before making financial
                  decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />

      {/* Scroll to Top Button */}
      <motion.button
        className={`fixed bottom-8 right-8 bg-primary/90 text-white p-3 rounded-full shadow-lg transition-opacity duration-300 ${
          showScrollTop ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={scrollToTop}
        initial={{ opacity: 0 }}
        animate={{ opacity: showScrollTop ? 1 : 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>
    </>
  )
}
