"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Star } from "lucide-react"
import CalendlyModal from "@/components/layout/CalendlyModal"

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

  return (
    <div className="min-h-screen bg-white pt-4">
      {/* New Hero Section - Simple and Mobile-First */}
      <section className="bg-blue-700 pt-16 pb-12 md:pt-24 md:pb-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Credit Education Services</h1>
            <p className="text-lg text-blue-100 mb-8">
              Educational resources to help you understand credit factors and make informed financial decisions
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className="bg-white text-blue-700 hover:bg-blue-50 w-full sm:w-auto"
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

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: "500+", label: "Clients Educated" },
              { value: "12+", label: "Educational Resources" },
              { value: "98%", label: "Client Satisfaction" },
            ].map((stat, index) => (
              <Card key={index} className="border-none shadow-sm text-center">
                <CardContent className="p-6">
                  <p className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Education Process Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Our Credit Education Process</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: "Credit Assessment",
                  description: "We help you understand how to review your current credit situation.",
                },
                {
                  step: 2,
                  title: "Educational Resources",
                  description: "We provide materials to help you understand credit factors.",
                },
                {
                  step: 3,
                  title: "Monitoring Tools",
                  description: "We offer tools to help you monitor changes to your credit profile.",
                },
                {
                  step: 4,
                  title: "Ongoing Support",
                  description: "We provide continued educational support as you work on your credit knowledge.",
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center flex-shrink-0 mt-1">
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

      {/* Education Topics Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Educational Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {educationTopics.map((topic, index) => (
              <Card key={index} className="border-none shadow-sm h-full">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{topic.name}</h3>
                  <p className="text-gray-600 mb-4">{topic.description}</p>
                  <h4 className="font-medium mb-2">What You'll Learn:</h4>
                  <ul className="space-y-1">
                    {topic.benefits.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Benefits of Credit Education</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <p className="font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">What Our Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-sm">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                  <p className="font-semibold">{testimonial.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-blue-700 text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Learn More?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Schedule a consultation to discuss our educational resources and how they can help you understand credit
            factors.
          </p>
          <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50" onClick={() => setIsCalendlyOpen(true)}>
            Schedule Your Free Consultation <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-gray-500 text-center">
              <strong>Disclaimer:</strong> Diamond Tier Capital provides consultation services only and does not
              directly provide credit repair services or other financial products. All information is for educational
              purposes only.
            </p>
          </div>
        </div>
      </section>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </div>
  )
}
