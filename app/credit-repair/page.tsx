"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle, Star, ArrowUp } from "lucide-react"
import CalendlyModal from "@/components/CalendlyModal"
import CreditScoreDashboard from "@/components/credit/CreditScoreDashboard"
import Image from "next/image"
import { useScrollTop } from "@/hooks/use-scroll-top"

const educationTopics = [
  {
    name: "Understanding Credit Reports",
    description: "Learn how to read and interpret your credit reports from the major bureaus.",
    benefits: [
      "Identify what factors affect your credit score",
      "Learn how to request your free annual credit reports",
      "Understand the different sections of your credit report",
    ],
  },
  {
    name: "Credit Score Factors",
    description: "Discover the key components that make up your credit score.",
    benefits: [
      "Learn about payment history and its impact",
      "Understand credit utilization ratios",
      "Discover how credit history length affects your score",
    ],
  },
  {
    name: "Building Business Credit",
    description: "Educational resources on establishing and building business credit.",
    benefits: [
      "Separating personal and business credit",
      "Establishing trade lines with vendors",
      "Reporting positive payment history to bureaus",
    ],
  },
]

const benefits = [
  "Better understanding of credit factors",
  "Knowledge of credit reporting processes",
  "Improved financial literacy",
  "Educational resources for business owners",
  "Understanding of business credit profiles",
  "Tools for monitoring credit changes",
]

const testimonials = [
  {
    quote:
      "The educational resources provided by Diamond Tier Capital helped me understand my business credit profile better.",
    author: "Alex T., Tech Entrepreneur",
  },
  {
    quote: "Their credit education program gave me valuable insights into how to build my business credit properly.",
    author: "Linda M., Restaurant Owner",
  },
  {
    quote:
      "The credit monitoring tools and educational materials have been extremely helpful for my business planning.",
    author: "Robert K., Real Estate Investor",
  },
]

export default function CreditRepairPage() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const { showScrollTop, scrollToTop } = useScrollTop(300)

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-Investment-Loans-for-Beginners-in-Real-Estate-uN2JjkoVzKvTlaaQzC05vsfhqNGUIH.webp"
            alt="Real estate investment with house model and coins"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-900/90 to-blue-900/80" />
        </div>

        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-white lg:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Credit Education Services</h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8">
                Educational resources to help you understand credit factors and make informed financial decisions.
              </p>
              <Button size="lg" variant="secondary" onClick={() => setIsCalendlyOpen(true)}>
                Schedule a Consultation
              </Button>
            </div>
            <div className="lg:w-1/2">
              <div className="scale-90 origin-top">
                <CreditScoreDashboard />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: "500+", label: "Clients Educated" },
              { value: "12+", label: "Educational Resources" },
              { value: "98%", label: "Client Satisfaction" },
            ].map((stat, index) => (
              <Card key={index} className="border-none shadow-card text-center">
                <CardContent className="pt-6 pb-6">
                  <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section bg-secondary">
        <div className="container">
          <div className="section-title">
            <h2 className="mb-4">Our Credit Education Process</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A structured approach to help you understand and improve your credit
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {[
              {
                title: "Credit Assessment",
                description: "We help you understand how to review your current credit situation.",
              },
              {
                title: "Educational Resources",
                description: "We provide materials to help you understand credit factors.",
              },
              {
                title: "Monitoring Tools",
                description: "We offer tools to help you monitor changes to your credit profile.",
              },
              {
                title: "Ongoing Support",
                description: "We provide continued educational support as you work on your credit knowledge.",
              },
            ].map((step, index) => (
              <Card key={index} className="border-none shadow-card h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl mb-4">
                    {index + 1}
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Education Topics Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-title">
            <h2 className="mb-4">Educational Resources</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive materials to help you understand credit factors
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {educationTopics.map((topic, index) => (
              <Card key={index} className="border-none shadow-card h-full">
                <CardHeader>
                  <CardTitle className="text-xl">{topic.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{topic.description}</p>
                  <div>
                    <h4 className="font-semibold mb-2">What You'll Learn:</h4>
                    <ul className="space-y-1">
                      {topic.benefits.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-primary mr-2 mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{item}</span>
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

      {/* Benefits Section */}
      <section className="section bg-primary text-white">
        <div className="container">
          <div className="section-title">
            <h2 className="mb-4">Benefits of Credit Education</h2>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Understanding your credit can lead to better financial decisions
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start bg-white/10 p-6 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                <p>{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-secondary">
        <div className="container">
          <div className="section-title">
            <h2 className="mb-4">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hear from businesses we've helped with credit education
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-card">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                  <p className="font-semibold">{testimonial.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Learn More?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            Schedule a consultation to discuss our educational resources and how they can help you understand credit
            factors.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-primary hover:bg-gray-100">
            Schedule Your Free Consultation <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
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
