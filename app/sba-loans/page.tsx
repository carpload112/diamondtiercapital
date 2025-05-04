"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import CalendlyModal from "@/components/layout/CalendlyModal"
import Link from "next/link"

export default function SBALoansPage() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* New Hero Section - Simple and Mobile-First */}
      <section className="bg-blue-800 pt-16 pb-12 md:pt-24 md:pb-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">SBA Loans</h1>
            <p className="text-lg text-blue-100 mb-8">
              Small Business Administration (SBA) loans are government-backed loans designed to help small businesses
              access funding with favorable terms
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className="bg-white text-blue-800 hover:bg-blue-50 w-full sm:w-auto"
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

      {/* Types of SBA Loans Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Types of SBA Loans We Can Help With</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
              <h3 className="text-xl font-semibold mb-2 text-blue-800">SBA 7(a) Loans</h3>
              <p className="text-gray-600">
                The most common SBA loan program, offering up to $5 million for various business purposes including
                working capital, equipment, and real estate.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
              <h3 className="text-xl font-semibold mb-2 text-blue-800">SBA 504 Loans</h3>
              <p className="text-gray-600">
                Designed for major fixed asset purchases like real estate and equipment, with loans up to $5.5 million.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
              <h3 className="text-xl font-semibold mb-2 text-blue-800">SBA Microloans</h3>
              <p className="text-gray-600">
                Smaller loans up to $50,000 for startups, small businesses, and certain non-profit childcare centers.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
              <h3 className="text-xl font-semibold mb-2 text-blue-800">SBA Express Loans</h3>
              <p className="text-gray-600">
                Expedited loan processing for amounts up to $500,000 with a response within 36 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Benefits of SBA Loans</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Lower down payments",
                "Longer repayment terms",
                "Competitive interest rates",
                "No balloon payments",
                "Counseling and education resources",
                "No prepayment penalties",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How We Help Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">How We Help You Secure SBA Loans</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: "Eligibility Assessment",
                  description:
                    "We evaluate your business to determine which SBA loan programs you qualify for based on your business size, industry, and financial history.",
                },
                {
                  step: 2,
                  title: "Application Preparation",
                  description:
                    "Our team helps you prepare a comprehensive application package, including business plans, financial statements, and all required documentation.",
                },
                {
                  step: 3,
                  title: "Lender Matching",
                  description:
                    "We connect you with SBA-approved lenders who are most likely to approve your loan based on your business profile and needs.",
                },
                {
                  step: 4,
                  title: "Application Submission & Follow-up",
                  description:
                    "We guide you through the submission process and handle follow-up communications with lenders to ensure your application moves forward.",
                },
                {
                  step: 5,
                  title: "Closing Support",
                  description:
                    "Once approved, we help you understand the terms and conditions and provide support through the closing process.",
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

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-blue-800 text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Explore SBA Loan Options?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our team of SBA loan specialists is ready to help you navigate the application process and secure the
            funding your business needs to grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-800 hover:bg-blue-50 w-full sm:w-auto" asChild>
              <Link href="/applynow">Apply Now</Link>
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
              onClick={() => setIsCalendlyOpen(true)}
            >
              Schedule a Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-gray-500 text-center">
              <strong>Disclaimer:</strong> Diamond Tier Capital provides consultation services only and does not
              directly provide loans, credit cards, or other financial products. All information is for educational
              purposes only. SBA loans are subject to approval by SBA-approved lenders based on their criteria and the
              SBA's guidelines.
            </p>
          </div>
        </div>
      </section>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </div>
  )
}
