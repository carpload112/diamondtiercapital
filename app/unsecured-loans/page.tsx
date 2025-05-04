"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Banknote, Clock, ShieldCheck, ArrowRight } from "lucide-react"
import CalendlyModal from "@/components/layout/CalendlyModal"

export default function UnsecuredLoansPage() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white pt-4">
      {/* New Hero Section - Simple and Mobile-First */}
      <section className="bg-blue-700 pt-16 pb-12 md:pt-24 md:pb-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Unsecured Business Financing</h1>
            <p className="text-lg text-blue-100 mb-8">Learn about financing options that may not require collateral</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className="bg-white text-blue-700 hover:bg-blue-50 w-full sm:w-auto"
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

      {/* Key Features Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Collateral Requirement</h3>
              <p className="text-gray-600">
                These financing options typically don't require specific business assets as collateral.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Streamlined Process</h3>
              <p className="text-gray-600">
                Learn about the application process for unsecured business financing options.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Banknote className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Use</h3>
              <p className="text-gray-600">
                Funds may be used for various legitimate business purposes based on your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Process Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Our Consultation Process</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
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
                <div key={item.step} className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center flex-shrink-0 mt-1">
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

      {/* Common Considerations Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Common Considerations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Business operating history",
              "Monthly revenue",
              "Credit profile",
              "Business location",
              "Industry type",
              "Banking relationship",
            ].map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <p className="font-medium">{item}</p>
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
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-blue-700 text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Learn More?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Schedule a consultation to discuss financing options that may be available for your business.
          </p>
          <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50" onClick={() => setIsCalendlyOpen(true)}>
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
