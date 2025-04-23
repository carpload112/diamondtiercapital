"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const partners = [
  {
    name: "Chase Bank",
    logo: "/placeholder.svg?height=60&width=120",
  },
  {
    name: "American Express",
    logo: "/placeholder.svg?height=60&width=120",
  },
  {
    name: "Bank of America",
    logo: "/placeholder.svg?height=60&width=120",
  },
  {
    name: "Wells Fargo",
    logo: "/placeholder.svg?height=60&width=120",
  },
  {
    name: "Capital One",
    logo: "/placeholder.svg?height=60&width=120",
  },
  {
    name: "Citibank",
    logo: "/placeholder.svg?height=60&width=120",
  },
]

export default function Partners() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h3 className="text-lg font-medium text-gray-500">Trusted by businesses nationwide</h3>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="grayscale hover:grayscale-0 transition-all duration-300"
            >
              <Image
                src={partner.logo || "/placeholder.svg"}
                alt={partner.name}
                width={120}
                height={60}
                className="h-12 w-auto object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
