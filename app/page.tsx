"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, CreditCard, Building2, Percent, ShieldCheck, GraduationCap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import CalendlyModal from "@/components/layout/CalendlyModal"

export default function Home() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/how-it-works-01.jpg-3Xl1vFULfOfYaJucLehBRVri5K1ZPO.jpeg"
            alt="Business professionals discussing funding options"
            fill
            className="object-cover"
            priority
            quality={85}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/90 to-gray-900/80" />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white text-center lg:text-left">
              <h1 className="font-bold leading-tight mb-6">
                Expert Business Funding
                <span className="block text-primary mt-2">Consultation Services</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
                We help businesses explore various funding options including SBA loans, business credit cards, and
                financing alternatives tailored to your specific needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="text-lg px-8 py-6" onClick={() => setIsCalendlyOpen(true)}>
                  Schedule Consultation
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                  onClick={() => {
                    const servicesSection = document.getElementById("services")
                    if (servicesSection) {
                      servicesSection.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  Explore Services
                </Button>
              </div>
            </div>

            <div className="lg:block">
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Funding Calculator</h2>
                <Tabs defaultValue="loan" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="loan">Loan</TabsTrigger>
                    <TabsTrigger value="line">Line of Credit</TabsTrigger>
                  </TabsList>
                  <TabsContent value="loan" className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                          <input
                            type="number"
                            defaultValue="100000"
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Term (months)</label>
                        <input
                          type="number"
                          defaultValue="60"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                        <input
                          type="number"
                          defaultValue="6"
                          step="0.1"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Estimated Monthly Payment</h3>
                        <p className="text-3xl font-bold text-primary">$1,933.28</p>
                        <p className="text-sm text-gray-600 mt-2">Total Interest: $15,996.80</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="line" className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Credit Line Amount</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                          <input
                            type="number"
                            defaultValue="50000"
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Utilization (%)</label>
                        <input
                          type="number"
                          defaultValue="60"
                          max="100"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">APR (%)</label>
                        <input
                          type="number"
                          defaultValue="8.5"
                          step="0.1"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">Estimated Monthly Interest</h3>
                        <p className="text-3xl font-bold text-primary">$212.50</p>
                        <p className="text-sm text-gray-600 mt-2">Based on $30,000 utilized</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="mt-6">
                  <Button className="w-full" onClick={() => setIsCalendlyOpen(true)}>
                    Schedule Consultation
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  This calculator is for educational purposes only. Actual rates and terms may vary.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section bg-white" id="services">
        <div className="container">
          <div className="section-title">
            <h2 className="mb-4">Business Funding Consultation</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We help businesses explore funding options that align with their specific goals and needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12">
            {[
              {
                title: "Business Credit Card Consultation",
                description:
                  "We help businesses understand credit card options that may be suitable for their specific needs and goals.",
                icon: CreditCard,
                color: "bg-blue-50",
                textColor: "text-blue-600",
                link: "/business-credit-cards",
              },
              {
                title: "SBA Loan Information",
                description:
                  "We provide educational resources about Small Business Administration loan programs and guidance on the application process.",
                icon: Building2,
                color: "bg-green-50",
                textColor: "text-green-600",
                link: "/sba-loans",
              },
              {
                title: "Credit Education Services",
                description:
                  "We offer educational resources to help businesses understand credit factors and build their business credit profiles.",
                icon: GraduationCap,
                color: "bg-purple-50",
                textColor: "text-purple-600",
                link: "/credit-repair",
              },
              {
                title: "Financing Consultation",
                description:
                  "We provide consultation on various financing options that may be available to businesses based on their specific needs.",
                icon: ShieldCheck,
                color: "bg-orange-50",
                textColor: "text-orange-600",
                link: "/unsecured-loans",
              },
              {
                title: "Introductory Rate Options",
                description:
                  "We help businesses understand credit options that may offer introductory rates and terms suitable for their needs.",
                icon: Percent,
                color: "bg-indigo-50",
                textColor: "text-indigo-600",
                link: "/zero-percent-credit-lines",
              },
            ].map((service, index) => (
              <Card key={index} className="card-hover border-none shadow-card">
                <CardContent className="p-6">
                  <div className={`${service.color} ${service.textColor} p-3 rounded-lg w-fit mb-4`}>
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  <Button variant="outline" className="w-full group hover:bg-primary hover:text-white" asChild>
                    <Link href={service.link}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section bg-secondary">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-8">How It Works</h2>
              <div className="space-y-8">
                {[
                  {
                    title: "Free Consultation",
                    description: "Discuss your business needs and goals with our expert team",
                    number: "01",
                  },
                  {
                    title: "Review Options",
                    description: "Explore potential funding solutions tailored to your business",
                    number: "02",
                  },
                  {
                    title: "Application Guidance",
                    description: "Receive support throughout the application process",
                    number: "03",
                  },
                ].map((step, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full">
                      <span className="text-primary font-bold">{step.number}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-8" asChild>
                <Link href="/contact">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/benefits_of_business_loans-CALUvAhKQ2axz3O42wERaRACy8Wdlc.webp"
                alt="Business Consultation Process"
                width={600}
                height={400}
                className="rounded-2xl shadow-xl"
                loading="lazy"
                quality={85}
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-title">
            <h2 className="mb-4">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hear from businesses we've helped with their funding needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              {
                name: "John Doe",
                company: "Tech Innovators Inc.",
                content:
                  "Diamond Tier Capital provided valuable guidance on business funding options. Their expertise in business credit education was very helpful.",
                avatar: "JD",
              },
              {
                name: "Jane Smith",
                company: "Green Energy Solutions",
                content:
                  "The consultation services from Diamond Tier Capital helped us understand our financing options during our expansion phase.",
                avatar: "JS",
              },
              {
                name: "Robert Johnson",
                company: "Johnson Manufacturing",
                content:
                  "Their team took the time to understand our business needs and provided tailored funding recommendations that worked for us.",
                avatar: "RJ",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="card-hover border-none shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                    </div>
                  </div>
                  <p className="italic text-muted-foreground">&ldquo;{testimonial.content}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Explore Your Funding Options?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            Schedule a consultation with our team to discuss business funding options that may be available to you.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6 bg-white text-primary hover:bg-gray-100"
            onClick={() => setIsCalendlyOpen(true)}
          >
            Schedule Your Free Consultation
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-title">
            <h2 className="mb-4">Why Choose Diamond Tier Capital?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're committed to helping businesses find the right funding solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[
              "Personalized consultation for your business needs",
              "Educational resources about funding options",
              "Guidance throughout the application process",
              "Information about competitive rates and terms",
              "Dedicated support team for ongoing assistance",
              "Transparent and honest approach to business funding",
            ].map((benefit, index) => (
              <div key={index} className="flex items-start p-4 bg-secondary rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <p>{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </>
  )
}
