"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import Image from "next/image"
import CalendlyModal from "./CalendlyModal"
import { ArrowRight, Calculator } from "lucide-react"

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
    return isNaN(monthlyPayment) ? "0.00" : monthlyPayment.toFixed(2)
  }

  const totalInterest = () => {
    const monthlyPayment = Number.parseFloat(calculateMonthlyPayment())
    const totalAmount = monthlyPayment * loanTerm
    return isNaN(totalAmount) ? "0.00" : (totalAmount - loanAmount).toFixed(2)
  }

  return (
    <section className="relative pt-20 min-h-screen flex items-center w-full overflow-hidden" aria-label="Hero">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/how-it-works-01.jpg-3Xl1vFULfOfYaJucLehBRVri5K1ZPO.jpeg"
          alt="Business professionals discussing funding options"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/90 to-blue-800/85" />

        {/* Abstract shapes */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="a" gradientTransform="rotate(45)">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
            </defs>
            <path d="M0,1000 C300,800 400,600 500,300 C600,0 700,200 1000,100 L1000,1000 Z" fill="url(#a)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white text-center lg:text-left"
          >
            <div className="inline-block px-4 py-1 bg-blue-500/20 backdrop-blur-sm rounded-full text-blue-200 font-medium text-sm mb-6 border border-blue-400/30">
              Premium Business Funding Solutions
            </div>
            <h1 className="font-bold leading-tight mb-6">
              Unlock Your Business
              <span className="block text-gradient mt-2">Potential Today</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-lg mx-auto lg:mx-0">
              Access premium business funding solutions including SBA loans, 0% credit lines, and unsecured financing
              options tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300"
                onClick={() => setIsCalendlyOpen(true)}
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full backdrop-blur-sm"
                onClick={() => {
                  const servicesSection = document.getElementById("services")
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                Explore Solutions
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              {[
                { value: "$50M+", label: "Funding Secured" },
                { value: "200+", label: "Businesses Helped" },
                { value: "24-48h", label: "Fast Approval" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:block"
          >
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Business Loan Calculator</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Loan Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="number"
                      id="loanAmount"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="pl-8 w-full"
                    />
                  </div>
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
                  <div className="relative">
                    <Input
                      type="number"
                      id="interestRate"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
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
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Estimated Monthly Payment</h3>
                  <p className="text-3xl font-bold text-blue-600">${calculateMonthlyPayment()}</p>
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>Total Interest:</span>
                    <span>${totalInterest()}</span>
                  </div>
                </div>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-6"
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
