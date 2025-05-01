"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Percent, CreditCard, Building2, ShieldCheck } from "lucide-react"
import Link from "next/link"

const services = [
  {
    title: "0% Credit Lines",
    description:
      "Access up to $150,000 with 0% interest for up to 18 months. Perfect for immediate business needs and growth opportunities.",
    icon: <Percent className="h-6 w-6" />,
    color: "bg-blue-50",
    textColor: "text-blue-600",
    features: ["No interest for 18 months", "Quick approval", "Flexible usage"],
    link: "/zero-percent-credit-lines",
  },
  {
    title: "SBA Loans",
    description:
      "Government-backed loans with competitive rates and longer repayment terms. Ideal for long-term business investments.",
    icon: <Building2 className="h-6 w-6" />,
    color: "bg-green-50",
    textColor: "text-green-600",
    features: ["Low interest rates", "Longer terms", "Higher amounts"],
    link: "/sba-loans",
  },
  {
    title: "Credit Card Stacking",
    description:
      "Strategic credit card stacking to maximize your available credit and optimize your business spending power.",
    icon: <CreditCard className="h-6 w-6" />,
    color: "bg-purple-50",
    textColor: "text-purple-600",
    features: ["Multiple cards", "Rewards optimization", "Built credit history"],
    link: "/business-credit-cards",
  },
  {
    title: "Unsecured Loans",
    description:
      "Quick access to capital without collateral requirements. Perfect for businesses needing immediate funding.",
    icon: <ShieldCheck className="h-6 w-6" />,
    color: "bg-orange-50",
    textColor: "text-orange-600",
    features: ["No collateral needed", "Fast funding", "Flexible terms"],
    link: "/unsecured-loans",
  },
]

export default function Services() {
  return (
    <section id="services" className="py-20 bg-white w-full" aria-label="Our Services">
      <div className="container mx-auto px-0 sm:px-4 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Financial Solutions</h2>
          <p className="text-xl text-gray-600">Tailored funding options to help your business grow and succeed</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 md:p-6">
                  <div className={`${service.color} ${service.textColor} p-3 rounded-lg w-fit mb-4`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-600">
                        <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full group hover:bg-blue-600 hover:text-white" asChild>
                    <Link href={service.link}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

