"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import Image from "next/image"
import CalendlyModal from "./CalendlyModal"

export default function Hero() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [loanAmount, setLoanAmount] = useState(100000)
  const [loanTerm, setLoanTerm] = useState(60)
  const [interestRate, setInterestRate] = useState(6)
  const [loanType, setLoanType] = useState("SBA 7(a)")

  const calculateMonthlyPayment = () => {
    const monthlyRate = interestRate / 100 / 12
    const totalPayments = loanTerm
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1)
    return monthlyPayment.toFixed(2)
  }

  const totalInterest = () => {
    const totalAmount = calculateMonthlyPayment() * loanTerm
    return (totalAmount - loanAmount).toFixed(2)
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

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10 w-full">
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 w-full sm:w-auto"
                onClick={() => setIsCalendlyOpen(true)}
              >
                Get Started →
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10 text-lg px-8 py-4 w-full sm:w-auto"
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:block"
          >
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Business Loan Calculator</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Loan Amount
                  </label>
                  <Input
                    type="number"
                    id="loanAmount"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-1">
                    Loan Term (months)
                  </label>
                  <Input
                    type="number"
                    id="loanTerm"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
                    Interest Rate (%)
                  </label>
                  <Input
                    type="number"
                    id="interestRate"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="loanType" className="block text-sm font-medium text-gray-700 mb-1">
                    Loan Type
                  </label>
                  <Select value={loanType} onValueChange={setLoanType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SBA 7(a)">SBA 7(a)</SelectItem>
                      <SelectItem value="SBA 504">SBA 504</SelectItem>
                      <SelectItem value="Term Loan">Term Loan</SelectItem>
                      <SelectItem value="Line of Credit">Line of Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-gray-100 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Estimated Monthly Payment</h3>
                  <p className="text-3xl font-bold text-blue-600">${calculateMonthlyPayment()}</p>
                  <p className="text-sm text-gray-600 mt-2">Total Interest: ${totalInterest()}</p>
                </div>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setIsCalendlyOpen(true)}
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </section>
  )
}

