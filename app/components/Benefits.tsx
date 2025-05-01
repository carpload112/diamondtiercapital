import { CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

const benefits = [
  "Tailored financial solutions for your business needs",
  "Expert guidance throughout the application process",
  "Quick approval and funding times",
  "Competitive rates and flexible terms",
  "Dedicated support team for ongoing assistance",
]

export default function Benefits() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Diamond Tier Capital?</h2>
        <div className="flex flex-wrap justify-center items-center">
          <div className="w-full md:w-1/2 pr-4">
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center bg-white p-4 rounded-lg shadow-md"
                >
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <motion.img
              src="/placeholder.svg?height=400&width=400"
              alt="Business growth illustration"
              className="mx-auto rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

