"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollToTop } from "@/components/ui/scroll-to-top"
import Link from "next/link"

export default function SBALoansPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    const handleScroll = () => {
      // Any scroll handling logic here
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-16"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">SBA Loans</h1>
          <p className="text-xl text-gray-700 mb-8">
            Small Business Administration (SBA) loans are government-backed loans designed to help small businesses
            access funding with favorable terms.
          </p>

          <div className="bg-white rounded-lg shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Types of SBA Loans We Can Help With</h2>

            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-xl font-medium text-blue-700">SBA 7(a) Loans</h3>
                <p className="text-gray-600 mt-2">
                  The most common SBA loan program, offering up to $5 million for various business purposes including
                  working capital, equipment, and real estate.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-xl font-medium text-blue-700">SBA 504 Loans</h3>
                <p className="text-gray-600 mt-2">
                  Designed for major fixed asset purchases like real estate and equipment, with loans up to $5.5
                  million.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-xl font-medium text-blue-700">SBA Microloans</h3>
                <p className="text-gray-600 mt-2">
                  Smaller loans up to $50,000 for startups, small businesses, and certain non-profit childcare centers.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-xl font-medium text-blue-700">SBA Express Loans</h3>
                <p className="text-gray-600 mt-2">
                  Expedited loan processing for amounts up to $500,000 with a response within 36 hours.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Benefits of SBA Loans</h2>

            <ul className="grid md:grid-cols-2 gap-4">
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-gray-700">Lower down payments</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-gray-700">Longer repayment terms</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-gray-700">Competitive interest rates</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-gray-700">No balloon payments</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-gray-700">Counseling and education resources</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-gray-700">No prepayment penalties</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">How We Help You Secure SBA Loans</h2>

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="bg-blue-100 rounded-full p-3 text-blue-600 font-bold text-xl w-10 h-10 flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-medium text-blue-700">Eligibility Assessment</h3>
                  <p className="text-gray-600 mt-1">
                    We evaluate your business to determine which SBA loan programs you qualify for based on your
                    business size, industry, and financial history.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="bg-blue-100 rounded-full p-3 text-blue-600 font-bold text-xl w-10 h-10 flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-medium text-blue-700">Application Preparation</h3>
                  <p className="text-gray-600 mt-1">
                    Our team helps you prepare a comprehensive application package, including business plans, financial
                    statements, and all required documentation.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="bg-blue-100 rounded-full p-3 text-blue-600 font-bold text-xl w-10 h-10 flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-medium text-blue-700">Lender Matching</h3>
                  <p className="text-gray-600 mt-1">
                    We connect you with SBA-approved lenders who are most likely to approve your loan based on your
                    business profile and needs.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="bg-blue-100 rounded-full p-3 text-blue-600 font-bold text-xl w-10 h-10 flex items-center justify-center shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-medium text-blue-700">Application Submission & Follow-up</h3>
                  <p className="text-gray-600 mt-1">
                    We guide you through the submission process and handle follow-up communications with lenders to
                    ensure your application moves forward.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="bg-blue-100 rounded-full p-3 text-blue-600 font-bold text-xl w-10 h-10 flex items-center justify-center shrink-0">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-medium text-blue-700">Closing Support</h3>
                  <p className="text-gray-600 mt-1">
                    Once approved, we help you understand the terms and conditions and provide support through the
                    closing process.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 text-white rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-4">Ready to Explore SBA Loan Options?</h2>
            <p className="mb-6">
              Our team of SBA loan specialists is ready to help you navigate the application process and secure the
              funding your business needs to grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/applynow">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto">Apply Now</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-blue-700 w-full sm:w-auto">
                  Schedule a Consultation
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <p className="text-sm text-gray-500">
              <strong>Disclaimer:</strong> Diamond Tier Capital provides consultation services only and does not
              directly provide loans, credit cards, or other financial products. All information is for educational
              purposes only. SBA loans are subject to approval by SBA-approved lenders based on their criteria and the
              SBA's guidelines.
            </p>
          </div>
        </div>
      </motion.div>

      <ScrollToTop />
    </div>
  )
}
