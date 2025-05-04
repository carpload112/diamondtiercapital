"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, CreditCard, ArrowRight } from "lucide-react"
import CalendlyModal from "@/components/layout/CalendlyModal" // Fixed import path

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

export default function BusinessCreditCardsPage() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white pt-8">
      {/* New Hero Section - Simple and Mobile-First */}
      <section className="bg-blue-600 pt-16 pb-12 md:pt-24 md:pb-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Business Credit Card Information</h1>
            <p className="text-lg text-blue-100 mb-8">
              Educational resources about business credit card options and how they may benefit your business
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
                onClick={() => setIsCalendlyOpen(true)}
              >
                Learn More
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                onClick={() => setIsCalendlyOpen(true)}
              >
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <Card className="border-none shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="md:w-1/4 flex justify-center">
                    <CreditCard className="h-24 w-24 text-blue-600" />
                  </div>
                  <div className="md:w-3/4">
                    <h2 className="text-2xl font-bold mb-4">Business Credit Card Overview</h2>
                    <p className="text-gray-600 mb-4">
                      Business credit cards are designed specifically for business use, offering features and benefits
                      tailored to business needs. They can help separate business and personal expenses while providing
                      rewards and benefits for business spending.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Cash back on business purchases</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Travel rewards for business trips</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Expense management tools</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Card Types Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Types of Business Credit Cards</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {cardTypes.map((cardType, index) => (
              <Card key={index} className="border-none shadow-sm h-full">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{cardType.name}</h3>
                  <p className="text-gray-600 mb-4">{cardType.description}</p>
                  <h4 className="font-medium mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {cardType.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Benefits of Business Credit Cards</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <p className="font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Application Process</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: "Research Options",
                  description: "Compare different business credit cards to find the best fit for your business needs.",
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
                <div key={item.step} className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold">{item.step}</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Considerations Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Important Considerations</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
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
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-blue-600 text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Learn More?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Schedule a consultation to discuss business credit card options and how they may fit your business needs.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" onClick={() => setIsCalendlyOpen(true)}>
            Schedule Your Free Consultation <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-50">
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
