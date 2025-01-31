"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Image from "next/image"
import CalendlyModal from "./CalendlyModal"

export default function Hero() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [loanAmount, setLoanAmount] = useState(100000)
  const [loanTerm, setLoanTerm] = useState(36)
  const [interestRate, setInterestRate] = useState(5)

  const calculateMonthlyPayment = () => {
    const monthlyRate = interestRate / 100 / 12
    const totalPayments = loanTerm
    return (
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1)
    )
  }

  return (
    <section className="relative pt-20 min-h-screen bg-gray-900 flex items-center w-full" aria-label="Hero">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/how-it-works-01.jpg-3Xl1vFULfOfYaJucLehBRVri5K1ZPO.jpeg"
          alt="Business professionals discussing funding options"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900/80" />
      </div>

      <div className="container mx-auto px-0 sm:px-4 py-12 md:py-20 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6">
              Unlock Your Business
              <span className="block text-blue-400 mt-2">Potential Today</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-lg mx-auto lg:mx-0">
              Access premium business funding solutions including SBA loans, 0% credit lines, and unsecured financing
              options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 w-full sm:w-auto"
                onClick={() => setIsCalendlyOpen(true)}
              >
                Get Started →
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10 text-lg px-8 py-6 w-full sm:w-auto"
                onClick={() => {
                  const servicesSection = document.getElementById("services")
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                Learn More
              </Button>
            </div>

            <div className="mt-8 md:mt-12 grid grid-cols-3 gap-4 md:gap-6 border-t border-white/10 pt-8">
              <div>
                <p className="text-2xl md:text-3xl font-bold text-blue-400">$500M+</p>
                <p className="text-xs md:text-sm text-gray-400">Funding Secured</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-blue-400">4.9/5</p>
                <p className="text-xs md:text-sm text-gray-400">Client Rating</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-blue-400">24hrs</p>
                <p className="text-xs md:text-sm text-gray-400">Fast Approval</p>
              </div>
            </div>
          </motion.div>

          <motion.div animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="lg:block">
            <div className="relative bg-white p-4 md:p-6 rounded-lg shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 opacity-75"></div>
              <div className="absolute inset-0.5 bg-white rounded-lg"></div>
              <div className="relative z-10">
                <h2 className="text-xl md:text-2xl font-bold mb-4">Loan Calculator</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-1">
                      Loan Amount: ${loanAmount}
                    </label>
                    <input
                      type="range"
                      id="loanAmount"
                      min="5000"
                      max="500000"
                      step="5000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-1">
                      Loan Term: {loanTerm} months
                    </label>
                    <input
                      type="range"
                      id="loanTerm"
                      min="12"
                      max="60"
                      step="12"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
                      Interest Rate: {interestRate}%
                    </label>
                    <input
                      type="range"
                      id="interestRate"
                      min="1"
                      max="20"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">Monthly Payment</p>
                    <p className="text-2xl text-blue-600">${calculateMonthlyPayment().toFixed(2)}</p>
                  </div>
                  <Button
                    type="button"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-lg"
                    onClick={() => setIsCalendlyOpen(true)}
                  >
                    Get Started →
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </section>
  )
}

