"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, CreditCard, Percent, ShieldCheck, ArrowRight } from "lucide-react"
import CalendlyModal from "@/components/layout/CalendlyModal" // Fixed import path

export default function ZeroPercentCreditLinesPage() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* New Hero Section - Simple and Mobile-First */}
      <section className="bg-blue-600 pt-16 pb-12 md:pt-24 md:pb-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Introductory Rate Credit Options</h1>
            <p className="text-lg text-blue-100 mb-8">
              Learn about business credit options that may offer introductory rates
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

      {/* Key Benefits Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Percent className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Introductory Rates</h3>
              <p className="text-gray-600">
                Some credit options offer introductory rates for qualified applicants, which may help with initial
                financing costs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Credit Limits</h3>
              <p className="text-gray-600">
                Various credit limits may be available based on qualification factors and business needs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Application Guidance</h3>
              <p className="text-gray-600">
                We provide information about application processes and requirements for various credit options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: "Schedule a Consultation",
                  description: "Book a free consultation with our team to discuss your business credit needs.",
                },
                {
                  step: 2,
                  title: "Review Credit Options",
                  description: "We'll explain potential credit options that may be available for your business.",
                },
                {
                  step: 3,
                  title: "Get Application Guidance",
                  description: "Receive information about application processes and requirements.",
                },
                {
                  step: 4,
                  title: "Make Informed Decisions",
                  description: "Use our educational resources to make the best decisions for your business.",
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

      {/* Potential Uses Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Potential Business Uses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Inventory purchases",
              "Equipment upgrades",
              "Marketing campaigns",
              "Hiring new employees",
              "Expanding business locations",
              "Managing cash flow",
            ].map((use, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <p className="font-medium">{use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: "How long do introductory rates typically last?",
                a: "Introductory rate periods vary by credit card issuer and specific offer. They may range from several months to over a year for qualified applicants.",
              },
              {
                q: "What happens after the introductory period?",
                a: "After the introductory period ends, the standard interest rate will typically apply to any remaining balance. It's important to understand the terms before applying.",
              },
              {
                q: "Is there a credit check required?",
                a: "Yes, credit card issuers typically perform a credit check as part of their application process. Approval and terms are based on various factors including credit history.",
              },
              {
                q: "What can I use these credit options for?",
                a: "Business credit cards can typically be used for various legitimate business expenses, subject to the card issuer's terms and conditions.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
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
            Schedule a consultation to discuss business credit options that may be available to you.
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
