"use client"

import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  CheckCircle,
  CreditCard,
  Building2,
  Percent,
  ShieldCheck,
  GraduationCap,
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect, useCallback } from "react"
import CalendlyModal from "@/components/layout/CalendlyModal"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

// Add proper TypeScript interfaces
interface CalculatorState {
  loanAmount: number
  term: number
  interestRate: number
  creditLineAmount: number
  utilization: number
  apr: number
}

export default function Home() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [calculatorValues, setCalculatorValues] = useState<CalculatorState>({
    loanAmount: 100000,
    term: 60,
    interestRate: 6,
    creditLineAmount: 50000,
    utilization: 60,
    apr: 8.5,
  })
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6])

  // Calculator functions
  const calculateMonthlyPayment = useCallback(() => {
    const { loanAmount, term, interestRate } = calculatorValues
    const monthlyRate = interestRate / 100 / 12
    const payment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1)
    return isNaN(payment) ? 0 : payment
  }, [calculatorValues])

  const calculateMonthlyInterest = useCallback(() => {
    const { creditLineAmount, utilization, apr } = calculatorValues
    const utilized = (creditLineAmount * utilization) / 100
    const monthlyInterest = (utilized * apr) / 100 / 12
    return isNaN(monthlyInterest) ? 0 : monthlyInterest
  }, [calculatorValues])

  const handleCalculatorChange = useCallback((field: keyof CalculatorState, value: number) => {
    setCalculatorValues((prev) => ({ ...prev, [field]: value }))
  }, [])

  const scrollToServices = useCallback(() => {
    const servicesSection = document.getElementById("services")
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const monthlyPayment = calculateMonthlyPayment()
  const totalInterest = monthlyPayment * calculatorValues.term - calculatorValues.loanAmount
  const monthlyInterest = calculateMonthlyInterest()
  const utilizedAmount = (calculatorValues.creditLineAmount * calculatorValues.utilization) / 100

  return (
    <>
      {/* Add structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialService",
            name: "Diamond Tier Capital",
            description: "Expert business funding consultation services",
            url: "https://diamondtiercapital.com",
            serviceType: "Business Funding Consultation",
            areaServed: "United States",
          }),
        }}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden" aria-labelledby="hero-heading">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/how-it-works-01.jpg-3Xl1vFULfOfYaJucLehBRVri5K1ZPO.jpeg"
            alt=""
            fill
            className="object-cover"
            priority
            quality={85}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/90 to-gray-900/80" />

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
          <div className="absolute inset-0 bg-noise" aria-hidden="true"></div>
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.8 }}
              className="text-white text-center lg:text-left"
            >
              <div className="inline-flex items-center px-4 py-1 rounded-full glass-dark text-sm font-medium text-white mb-6">
                <Sparkles className="h-4 w-4 mr-2 text-yellow-400" aria-hidden="true" />
                <span>Expert Business Funding Consultation</span>
              </div>
              <h1 id="hero-heading" className="font-bold leading-tight mb-6 text-shadow-lg">
                Expert Business Funding
                <span className="block text-gradient shimmer mt-2">Consultation Services</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
                We help businesses explore various funding options including SBA loans, business credit cards, and
                financing alternatives tailored to your specific needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="btn-gradient text-lg px-8 py-6 rounded-xl"
                  onClick={() => setIsCalendlyOpen(true)}
                  aria-describedby="consultation-description"
                >
                  Schedule Consultation
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 text-lg px-8 py-6 rounded-xl"
                  onClick={scrollToServices}
                >
                  Explore Services
                </Button>
              </div>
              <p id="consultation-description" className="sr-only">
                Schedule a free consultation to discuss your business funding needs
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:block"
            >
              <Card className="glass-card shadow-xl p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Funding Calculator</h2>
                <Tabs defaultValue="loan" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6" role="tablist">
                    <TabsTrigger value="loan" role="tab">
                      Loan
                    </TabsTrigger>
                    <TabsTrigger value="line" role="tab">
                      Line of Credit
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="loan" className="space-y-6" role="tabpanel">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="loan-amount" className="block text-sm font-medium text-gray-700 mb-1">
                          Loan Amount
                        </label>
                        <div className="relative">
                          <span
                            className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"
                            aria-hidden="true"
                          >
                            $
                          </span>
                          <input
                            id="loan-amount"
                            type="number"
                            value={calculatorValues.loanAmount}
                            onChange={(e) => handleCalculatorChange("loanAmount", Number(e.target.value))}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            min="1000"
                            max="10000000"
                            step="1000"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="loan-term" className="block text-sm font-medium text-gray-700 mb-1">
                          Term (months)
                        </label>
                        <input
                          id="loan-term"
                          type="number"
                          value={calculatorValues.term}
                          onChange={(e) => handleCalculatorChange("term", Number(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                          min="12"
                          max="360"
                        />
                      </div>
                      <div>
                        <label htmlFor="interest-rate" className="block text-sm font-medium text-gray-700 mb-1">
                          Interest Rate (%)
                        </label>
                        <input
                          id="interest-rate"
                          type="number"
                          value={calculatorValues.interestRate}
                          onChange={(e) => handleCalculatorChange("interestRate", Number(e.target.value))}
                          step="0.1"
                          min="0.1"
                          max="50"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div className="gradient-border bg-white">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Estimated Monthly Payment</h3>
                        <p className="text-3xl font-bold text-gradient">
                          $
                          {monthlyPayment.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Total Interest: $
                          {totalInterest.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="line" className="space-y-6" role="tabpanel">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="credit-line-amount" className="block text-sm font-medium text-gray-700 mb-1">
                          Credit Line Amount
                        </label>
                        <div className="relative">
                          <span
                            className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"
                            aria-hidden="true"
                          >
                            $
                          </span>
                          <input
                            id="credit-line-amount"
                            type="number"
                            value={calculatorValues.creditLineAmount}
                            onChange={(e) => handleCalculatorChange("creditLineAmount", Number(e.target.value))}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            min="1000"
                            max="5000000"
                            step="1000"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="utilization" className="block text-sm font-medium text-gray-700 mb-1">
                          Utilization (%)
                        </label>
                        <input
                          id="utilization"
                          type="number"
                          value={calculatorValues.utilization}
                          onChange={(e) => handleCalculatorChange("utilization", Number(e.target.value))}
                          max="100"
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div>
                        <label htmlFor="apr" className="block text-sm font-medium text-gray-700 mb-1">
                          APR (%)
                        </label>
                        <input
                          id="apr"
                          type="number"
                          value={calculatorValues.apr}
                          onChange={(e) => handleCalculatorChange("apr", Number(e.target.value))}
                          step="0.1"
                          min="0.1"
                          max="50"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div className="gradient-border bg-white">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Estimated Monthly Interest</h3>
                        <p className="text-3xl font-bold text-gradient">
                          $
                          {monthlyInterest.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Based on $
                          {utilizedAmount.toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}{" "}
                          utilized
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="mt-6">
                  <Button className="btn-gradient w-full" onClick={() => setIsCalendlyOpen(true)}>
                    Schedule Consultation
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  This calculator is for educational purposes only. Actual rates and terms may vary.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-modern bg-mesh" id="services" aria-labelledby="services-heading">
        <div className="container relative z-10">
          <div className="section-title">
            <h2 id="services-heading" className="text-4xl font-bold mb-4 text-gradient">
              Business Funding Consultation
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We help businesses explore funding options that align with their specific goals and needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12" role="list">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0 * 0.1 }}
              viewport={{ once: true }}
              role="listitem"
            >
              <Card className="morphic-card card-hover border-none shadow-card h-full">
                <CardContent className="p-6">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-lg w-fit mb-4" aria-hidden="true">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Business Credit Card Consultation</h3>
                  <p className="text-muted-foreground mb-6">
                    We help businesses understand credit card options that may be suitable for their specific needs and
                    goals.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full btn-outline-modern group hover:bg-primary hover:text-white"
                    asChild
                  >
                    <Link href="/business-credit-cards">
                      Learn More
                      <ArrowRight
                        className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                        aria-hidden="true"
                      />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 * 0.1 }}
              viewport={{ once: true }}
              role="listitem"
            >
              <Card className="morphic-card card-hover border-none shadow-card h-full">
                <CardContent className="p-6">
                  <div className="bg-green-50 text-green-600 p-3 rounded-lg w-fit mb-4" aria-hidden="true">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">SBA Loan Information</h3>
                  <p className="text-muted-foreground mb-6">
                    We provide educational resources about Small Business Administration loan programs and guidance on
                    the application process.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full btn-outline-modern group hover:bg-primary hover:text-white"
                    asChild
                  >
                    <Link href="/sba-loans">
                      Learn More
                      <ArrowRight
                        className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                        aria-hidden="true"
                      />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2 * 0.1 }}
              viewport={{ once: true }}
              role="listitem"
            >
              <Card className="morphic-card card-hover border-none shadow-card h-full">
                <CardContent className="p-6">
                  <div className="bg-purple-50 text-purple-600 p-3 rounded-lg w-fit mb-4" aria-hidden="true">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Credit Education Services</h3>
                  <p className="text-muted-foreground mb-6">
                    We offer educational resources to help businesses understand credit factors and build their business
                    credit profiles.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full btn-outline-modern group hover:bg-primary hover:text-white"
                    asChild
                  >
                    <Link href="/credit-repair">
                      Learn More
                      <ArrowRight
                        className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                        aria-hidden="true"
                      />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 3 * 0.1 }}
              viewport={{ once: true }}
              role="listitem"
            >
              <Card className="morphic-card card-hover border-none shadow-card h-full">
                <CardContent className="p-6">
                  <div className="bg-orange-50 text-orange-600 p-3 rounded-lg w-fit mb-4" aria-hidden="true">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Financing Consultation</h3>
                  <p className="text-muted-foreground mb-6">
                    We provide consultation on various financing options that may be available to businesses based on
                    their specific needs.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full btn-outline-modern group hover:bg-primary hover:text-white"
                    asChild
                  >
                    <Link href="/unsecured-loans">
                      Learn More
                      <ArrowRight
                        className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                        aria-hidden="true"
                      />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 4 * 0.1 }}
              viewport={{ once: true }}
              role="listitem"
            >
              <Card className="morphic-card card-hover border-none shadow-card h-full">
                <CardContent className="p-6">
                  <div className="bg-indigo-50 text-indigo-600 p-3 rounded-lg w-fit mb-4" aria-hidden="true">
                    <Percent className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Introductory Rate Options</h3>
                  <p className="text-muted-foreground mb-6">
                    We help businesses understand credit options that may offer introductory rates and terms suitable
                    for their needs.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full btn-outline-modern group hover:bg-primary hover:text-white"
                    asChild
                  >
                    <Link href="/zero-percent-credit-lines">
                      Learn More
                      <ArrowRight
                        className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                        aria-hidden="true"
                      />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        ref={containerRef}
        className="section bg-gradient-to-b from-white to-secondary/50 relative overflow-hidden"
        aria-labelledby="how-it-works-heading"
      >
        <motion.div style={{ opacity }} className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Simple Process
              </div>
              <h2 id="how-it-works-heading" className="text-3xl font-bold mb-8 text-gradient">
                How It Works
              </h2>
              <div className="space-y-8" role="list">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0 * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4 items-start"
                  role="listitem"
                >
                  <div
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center glass-card rounded-full"
                    aria-hidden="true"
                  >
                    <span className="text-gradient font-bold">01</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Free Consultation</h3>
                    <p className="text-muted-foreground">Discuss your business needs and goals with our expert team</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4 items-start"
                  role="listitem"
                >
                  <div
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center glass-card rounded-full"
                    aria-hidden="true"
                  >
                    <span className="text-gradient font-bold">02</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Review Options</h3>
                    <p className="text-muted-foreground">
                      Explore potential funding solutions tailored to your business
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 2 * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4 items-start"
                  role="listitem"
                >
                  <div
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center glass-card rounded-full"
                    aria-hidden="true"
                  >
                    <span className="text-gradient font-bold">03</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Application Guidance</h3>
                    <p className="text-muted-foreground">Receive support throughout the application process</p>
                  </div>
                </motion.div>
              </div>
              <Button className="mt-8 btn-gradient" asChild>
                <Link href="/contact">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl transform rotate-3 scale-105"
                aria-hidden="true"
              ></div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/benefits_of_business_loans-CALUvAhKQ2axz3O42wERaRACy8Wdlc.webp"
                alt="Business professionals in consultation meeting discussing funding options"
                width={600}
                height={400}
                className="rounded-2xl shadow-xl relative z-10"
                loading="lazy"
                quality={85}
                sizes="(max-width: 768px) 100vw, 600px"
              />

              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 glass-card rounded-xl shadow-lg p-4 z-20 floating">
                <div className="flex items-center gap-3">
                  <div
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full"
                    aria-hidden="true"
                  >
                    <span className="text-primary font-bold">98%</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Client Satisfaction</p>
                    <p className="text-xs text-gray-500">Based on 500+ reviews</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-[30%] -left-[10%] w-[40%] h-[60%] rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute -bottom-[30%] -right-[10%] w-[40%] h-[60%] rounded-full bg-accent/5 blur-3xl"></div>
          <div className="absolute inset-0 bg-noise"></div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-mesh" aria-labelledby="testimonials-heading">
        <div className="container relative z-10">
          <div className="section-title">
            <h2 id="testimonials-heading" className="text-4xl font-bold mb-4 text-gradient">
              What Our Clients Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hear from businesses we've helped with their funding needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12" role="list">
            <Card className="morphic-card card-hover border-none shadow-card" role="listitem">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold"
                    aria-hidden="true"
                  >
                    JD
                  </div>
                  <div>
                    <div className="font-semibold">John Doe</div>
                    <div className="text-sm text-muted-foreground">Tech Innovators Inc.</div>
                  </div>
                </div>
                <blockquote className="italic text-muted-foreground">
                  &ldquo;Diamond Tier Capital provided valuable guidance on business funding options. Their expertise in
                  business credit education was very helpful.&rdquo;
                </blockquote>
              </CardContent>
            </Card>

            <Card className="morphic-card card-hover border-none shadow-card" role="listitem">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold"
                    aria-hidden="true"
                  >
                    JS
                  </div>
                  <div>
                    <div className="font-semibold">Jane Smith</div>
                    <div className="text-sm text-muted-foreground">Green Energy Solutions</div>
                  </div>
                </div>
                <blockquote className="italic text-muted-foreground">
                  &ldquo;The consultation services from Diamond Tier Capital helped us understand our financing options
                  during our expansion phase.&rdquo;
                </blockquote>
              </CardContent>
            </Card>

            <Card className="morphic-card card-hover border-none shadow-card" role="listitem">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold"
                    aria-hidden="true"
                  >
                    RJ
                  </div>
                  <div>
                    <div className="font-semibold">Robert Johnson</div>
                    <div className="text-sm text-muted-foreground">Johnson Manufacturing</div>
                  </div>
                </div>
                <blockquote className="italic text-muted-foreground">
                  &ldquo;Their team took the time to understand our business needs and provided tailored funding
                  recommendations that worked for us.&rdquo;
                </blockquote>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-primary to-accent text-white" aria-labelledby="cta-heading">
        <div className="container text-center relative z-10">
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Explore Your Funding Options?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            Schedule a consultation with our team to discuss business funding options that may be available to you.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6 bg-white text-primary hover:bg-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => setIsCalendlyOpen(true)}
          >
            Schedule Your Free Consultation
          </Button>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 bg-noise opacity-10" aria-hidden="true"></div>
      </section>

      {/* Benefits Section */}
      <section className="section bg-mesh" aria-labelledby="benefits-heading">
        <div className="container relative z-10">
          <div className="section-title">
            <h2 id="benefits-heading" className="text-4xl font-bold mb-4 text-gradient">
              Why Choose Diamond Tier Capital?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're committed to helping businesses find the right funding solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12" role="list">
            {[
              "Personalized consultation for your business needs",
              "Educational resources about funding options",
              "Guidance throughout the application process",
              "Information about competitive rates and terms",
              "Dedicated support team for ongoing assistance",
              "Transparent and honest approach to business funding",
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-start p-4 glass-card rounded-lg"
                role="listitem"
              >
                <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <p>{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </>
  )
}
