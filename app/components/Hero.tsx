"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import Image from "next/image"
import CalendlyModal from "./CalendlyModal"
import { ArrowRight, Calculator, ChevronDown, Sparkles } from "lucide-react"

export default function Hero() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [loanAmount, setLoanAmount] = useState(100000)
  const [loanTerm, setLoanTerm] = useState(60)
  const [interestRate, setInterestRate] = useState(6)
  const [loanType, setLoanType] = useState("SBA 7(a)")
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

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

  const formatCurrency = (value: number | string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(value))
  }

  return (
    <section
      className="relative pt-32 pb-20 md:pt-40 md:pb-32 min-h-screen flex items-center w-full overflow-hidden"
      aria-label="Hero"
    >
      {/* Background with animated gradient overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/how-it-works-01.jpg-3Xl1vFULfOfYaJucLehBRVri5K1ZPO.jpeg"
          alt="Business professionals discussing funding options"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/90 to-gray-900/70" />

        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.3) 0%, transparent 50%)",
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 bg-noise"></div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8 }}
            className="text-white text-center lg:text-left"
          >
            <div className="inline-block px-4 py-1 rounded-full glass-dark text-sm font-medium text-white mb-6 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
              Expert Business Funding Consultation
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-shadow-lg">
              Unlock Your Business
              <span className="block mt-2 text-gradient shimmer">Financial Potential</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
              We help businesses explore various funding options including SBA loans, business credit cards, and
              financing alternatives tailored to your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="btn-gradient text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                onClick={() => setIsCalendlyOpen(true)}
              >
                Schedule Consultation{" "}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 text-lg px-8 py-6 rounded-xl"
                onClick={() => {
                  const servicesSection = document.getElementById("services")
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: "smooth" })
                  } else {
                    // Fallback if services section is not found
                    window.location.href = "/#services"
                  }
                }}
              >
                Explore Services
              </Button>
            </div>

            {/* Mobile calculator toggle */}
            <div className="mt-8 lg:hidden">
              <button
                onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
                className="flex items-center justify-center w-full gap-2 text-sm font-medium text-white/80 hover:text-white"
              >
                <Calculator className="h-4 w-4" />
                {isCalculatorOpen ? "Hide Calculator" : "Show Payment Calculator"}
                <ChevronDown className={`h-4 w-4 transition-transform ${isCalculatorOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`lg:block ${isCalculatorOpen ? "block" : "hidden"}`}
          >
            <div className="glass-card p-6 rounded-2xl shadow-2xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Payment Calculator</h2>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                  <Calculator className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Principal Amount
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                    <Input
                      type="range"
                      id="loanAmount"
                      min="10000"
                      max="5000000"
                      step="10000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full mt-1"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">$10k</span>
                      <span className="text-sm font-medium">{formatCurrency(loanAmount)}</span>
                      <span className="text-xs text-gray-500">$5M</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-1">
                    Term (months)
                  </label>
                  <div className="relative">
                    <Input
                      type="range"
                      id="loanTerm"
                      min="12"
                      max="300"
                      step="12"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="w-full mt-1"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">1 year</span>
                      <span className="text-sm font-medium">
                        {Math.floor(loanTerm / 12)} years ({loanTerm} months)
                      </span>
                      <span className="text-xs text-gray-500">25 years</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
                    Interest Rate (%)
                  </label>
                  <div className="relative">
                    <Input
                      type="range"
                      id="interestRate"
                      min="1"
                      max="15"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full mt-1"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">1%</span>
                      <span className="text-sm font-medium">{interestRate}%</span>
                      <span className="text-xs text-gray-500">15%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="loanType" className="block text-sm font-medium text-gray-700 mb-1">
                    Funding Type
                  </label>
                  <Select value={loanType} onValueChange={setLoanType}>
                    <SelectTrigger id="loanType" className="w-full">
                      <SelectValue placeholder="Select funding type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SBA 7(a)">SBA 7(a)</SelectItem>
                      <SelectItem value="SBA 504">SBA 504</SelectItem>
                      <SelectItem value="Term Loan">Term Loan</SelectItem>
                      <SelectItem value="Line of Credit">Line of Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="gradient-border bg-white">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Estimated Monthly Payment</h3>
                  <p className="text-3xl font-bold text-gradient">${calculateMonthlyPayment()}</p>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-gray-600">Total Interest:</span>
                    <span className="font-medium">${totalInterest()}</span>
                  </div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span className="text-gray-600">Total Repayment:</span>
                    <span className="font-medium">${(Number(calculateMonthlyPayment()) * loanTerm).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    This is only an estimate for educational purposes. Actual terms, rates, and eligibility may vary
                    based on multiple factors.
                  </p>
                </div>
                <Button
                  className="btn-gradient w-full shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={() => setIsCalendlyOpen(true)}
                >
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating badges */}
        <div className="absolute bottom-10 left-10 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="glass-card px-4 py-2 rounded-full shadow-lg flex items-center"
          >
            <span className="text-primary font-medium text-sm">Trusted by 500+ Businesses</span>
          </motion.div>
        </div>

        <div className="absolute bottom-10 right-10 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="glass-card px-4 py-2 rounded-full shadow-lg flex items-center"
          >
            <span className="text-primary font-medium text-sm">98% Client Satisfaction</span>
          </motion.div>
        </div>
      </div>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </section>
  )
}
