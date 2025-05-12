"use client"

import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, CreditCard, Building2, Percent, ShieldCheck, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useRef } from "react"

const services = [
  {
    title: "Business Credit Card Consultation",
    description:
      "We help businesses understand credit card options that may be suitable for their specific needs and goals.",
    icon: <CreditCard className="h-6 w-6" />,
    color: "bg-blue-50",
    textColor: "text-blue-600",
    features: ["Card comparison information", "Application guidance", "Strategy consultation"],
    link: "/business-credit-cards",
  },
  {
    title: "SBA Loan Information",
    description:
      "We provide educational resources about Small Business Administration loan programs and guidance on the application process.",
    icon: <Building2 className="h-6 w-6" />,
    color: "bg-green-50",
    textColor: "text-green-600",
    features: ["Program education", "Documentation guidance", "Application information"],
    link: "/sba-loans",
  },
  {
    title: "Credit Education Services",
    description:
      "We offer educational resources to help businesses understand credit factors and build their business credit profiles.",
    icon: <GraduationCap className="h-6 w-6" />,
    color: "bg-purple-50",
    textColor: "text-purple-600",
    features: ["Credit profile review", "Educational resources", "Strategy development"],
    link: "/credit-repair",
  },
  {
    title: "Financing Consultation",
    description:
      "We provide consultation on various financing options that may be available to businesses based on their specific needs.",
    icon: <ShieldCheck className="h-6 w-6" />,
    color: "bg-orange-50",
    textColor: "text-orange-600",
    features: ["Needs assessment", "Options overview", "Application guidance"],
    link: "/unsecured-loans",
  },
  {
    title: "Introductory Rate Options",
    description:
      "We help businesses understand credit options that may offer introductory rates and terms suitable for their needs.",
    icon: <Percent className="h-6 w-6" />,
    color: "bg-indigo-50",
    textColor: "text-indigo-600",
    features: ["Rate comparison information", "Term explanation", "Qualification factors"],
    link: "/zero-percent-credit-lines",
  },
]

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="services" className="section-modern py-24 bg-mesh w-full" aria-label="Our Services">
      <div className="container mx-auto px-4 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Services
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gradient">Business Funding Consultation</h2>
          <p className="text-xl text-gray-600">
            We help businesses explore funding options that may align with their goals
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants} className="h-full">
              <Card className="morphic-card h-full overflow-hidden border-none transition-all duration-300 group">
                <CardContent className="p-0">
                  <div className="p-6 pb-4">
                    <div
                      className={`${service.color} ${service.textColor} p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-600">
                          <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      className="w-full btn-outline-modern group-hover:bg-primary group-hover:text-white"
                      asChild
                    >
                      <Link href={service.link}>
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
