"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle, Building2, ArrowUp } from "lucide-react"
import CalendlyModal from "@/components/CalendlyModal"
import Image from "next/image"
import Link from "next/link"

const sbaLoanTypes = [
  {
    name: "SBA 7(a) Loans",
    description: "The SBA's primary program for providing financial assistance to small businesses.",
    features: [
      "Loan amounts up to $5 million",
      "Can be used for working capital, equipment, real estate",
      "Longer repayment terms than conventional loans",
      "Lower down payments and flexible requirements",
    ],
  },
  {
    name: "SBA 504 Loans",
    description: "Designed to provide financing for major fixed assets that promote business growth and job creation.",
    features: [
      "Used primarily for real estate and equipment",
      "Up to $5.5 million for eligible projects",
      "Lower down payments (typically 10%)",
      "Long-term, fixed-rate financing",
    ],
  },
  {
    name: "SBA Microloans",
    description: "Provides small, short-term loans to small businesses and certain non-profit childcare centers.",
    features: [
      "Loans up to $50,000",
      "Average loan amount around $13,000",
      "Shorter repayment terms (up to 6 years)",
      "Can be used for working capital, supplies, equipment",
    ],
  },
]

const eligibilityRequirements = [
  "Operate as a for-profit business",
  "Do business in the United States",
  "Have reasonable owner equity to invest",
  "Use alternative financial resources first",
  "Demonstrate a need for the loan",
  "Use the funds for a sound business purpose",
  "Not be delinquent on any existing debt obligations",
]

const applicationProcess = [
  {
    title: "Preparation",
    description:
      "Gather necessary documentation including business financial statements, tax returns, and business plans.",
  },
  {
    title: "Find a Lender",
    description: "Locate an SBA-approved lender that participates in the SBA loan program you're interested in.",
  },
  {
    title: "Application Submission",
    description: "Complete the application with your lender, who will then submit it to the SBA for approval.",
  },
  {
    title: "Underwriting",
    description: "The lender reviews your application, conducts due diligence, and makes a decision.",
  },
  {
    title: "Closing",
    description: "If approved, review and sign loan documents, after which funds will be disbursed.",
  },
]

export default function SBALoansPage() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Handle scroll to top button visibility
  useState(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  })

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/how-it-works-01.jpg-3Xl1vFULfOfYaJucLehBRVri5K1ZPO.jpeg"
            alt="SBA Loans Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-900/90 to-blue-900/80" />
        </div>

        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-white lg:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">SBA Loan Information</h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8">
                Educational resources about Small Business Administration loan programs and guidance on the application
                process.
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
                  <CardTitle className="text-xl">SBA Loan Programs Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Building2 className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold">SBA 7(a) Loans:</span>
                        <span className="text-muted-foreground"> General small business loans up to $5 million</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Building2 className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold">SBA 504 Loans:</span>
                        <span className="text-muted-foreground"> Fixed asset financing up to $5.5 million</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Building2 className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold">SBA Microloans:</span>
                        <span className="text-muted-foreground"> Small loans up to $50,000</span>
                      </div>
                    </li>
                  </ul>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-muted-foreground mb-4">
                      Diamond Tier Capital provides consultation services to help businesses understand SBA loan
                      options. We do not directly provide loans.
                    </p>
                    <Button className="w-full" onClick={() => setIsCalendlyOpen(true)}>
                      Learn More About SBA Loans
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* SBA Loan Types Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-title">
            <h2 className="mb-4">SBA Loan Programs</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Educational information about different SBA loan programs available to small businesses
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {sbaLoanTypes.map((loanType, index) => (
              <Card key={index} className="border-none shadow-card h-full">
                <CardHeader>
                  <CardTitle className="text-xl">{loanType.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{loanType.description}</p>
                  <div>
                    <h4 className="font-semibold mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {loanType.features.map((feature, i) => (
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

      {/* Eligibility Requirements Section */}
      <section className="section bg-secondary">
        <div className="container">
          <div className="section-title">
            <h2 className="mb-4">General SBA Loan Eligibility</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Basic requirements that businesses typically need to meet for SBA loan consideration
            </p>
          </div>
          <div className="mt-12 max-w-3xl mx-auto">
            <Card className="border-none shadow-card">
              <CardContent className="p-6">
                <ul className="space-y-4">
                  {eligibilityRequirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-muted-foreground">
                    Note: Eligibility requirements can vary by specific loan program and lender. This information is for
                    educational purposes only.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-title">
            <h2 className="mb-4">SBA Loan Application Process</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              General overview of the steps involved in applying for an SBA loan
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-12">
            {applicationProcess.map((step, index) => (
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

      {/* Required Documentation Section */}
      <section className="section bg-secondary">
        <div className="container">
          <div className="section-title">
            <h2 className="mb-4">Common Documentation Requirements</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Documents typically needed when applying for an SBA loan
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
            <Card className="border-none shadow-card h-full">
              <CardHeader>
                <CardTitle className="text-lg">Business Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Business financial statements",
                    "Business tax returns (3 years)",
                    "Business licenses and registrations",
                    "Business plan and projections",
                    "Business debt schedule",
                    "Legal contracts and agreements",
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
                <CardTitle className="text-lg">Personal Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Personal tax returns (3 years)",
                    "Personal financial statement",
                    "Resume or business biography",
                    "Personal credit report",
                    "Personal identification",
                    "Statement of personal history",
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Learn More About SBA Loans?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            Schedule a consultation to discuss SBA loan options and how they may fit your business needs.
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

      {/* Resources Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-title">
            <h2 className="mb-4">Additional SBA Resources</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Helpful links to official SBA resources for more information
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <Card className="border-none shadow-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">SBA Official Website</h3>
                <p className="text-muted-foreground mb-4">
                  Access official information about SBA loan programs directly from the source.
                </p>
                <Button variant="outline" className="w-full hover:bg-primary hover:text-white" asChild>
                  <Link href="https://www.sba.gov/funding-programs/loans" target="_blank" rel="noopener noreferrer">
                    Visit SBA Website <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-none shadow-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Lender Match</h3>
                <p className="text-muted-foreground mb-4">
                  SBA's tool to connect small businesses with SBA-approved lenders.
                </p>
                <Button variant="outline" className="w-full hover:bg-primary hover:text-white" asChild>
                  <Link
                    href="https://www.sba.gov/funding-programs/loans/lender-match"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Find Lenders <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-none shadow-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">SBA Local Assistance</h3>
                <p className="text-muted-foreground mb-4">
                  Find local SBA offices and resource partners for in-person assistance.
                </p>
                <Button variant="outline" className="w-full hover:bg-primary hover:text-white" asChild>
                  <Link href="https://www.sba.gov/local-assistance" target="_blank" rel="noopener noreferrer">
                    Find Local Help <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="mt-12 text-center">
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Diamond Tier Capital provides consultation services only. We do not directly provide loans, credit cards,
              or other financial products. All information is for educational purposes only.
            </p>
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
