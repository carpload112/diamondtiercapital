"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CreditCard, FileSearch, BarChart, ArrowRight, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

const features = [
  {
    icon: CreditCard,
    title: "Boost Your Score",
    description: "We'll help you increase your credit score through strategic interventions.",
  },
  {
    icon: FileSearch,
    title: "Dispute Inaccuracies",
    description: "We'll identify and challenge incorrect items on your credit report.",
  },
  {
    icon: BarChart,
    title: "Track Progress",
    description: "Monitor your credit improvement journey with our detailed analytics.",
  },
]

export default function CreditRepairSection() {
  const router = useRouter()

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 z-0"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-200 rounded-full filter blur-3xl opacity-20 z-0"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-indigo-300 rounded-full filter blur-3xl opacity-20 z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1 bg-blue-100 rounded-full text-blue-600 font-medium text-sm mb-6">
              Credit Repair Services
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Repair Your Credit, <span className="text-gradient">Unlock Funding</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Don't let poor credit hold you back. Our expert team is here to help you improve your score and qualify
              for better business funding options.
            </p>

            <div className="space-y-6 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600 mr-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300"
                onClick={() => router.push("/credit-repair")}
              >
                Start Your Credit Repair Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="text-blue-600 border-blue-200 hover:bg-blue-50 px-6 py-3 rounded-full"
                onClick={() => router.push("/credit-repair")}
              >
                Learn More
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-white text-sm font-medium ml-4">Credit Score Dashboard</div>
              </div>

              <div className="pt-16 p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Your Credit Score</h3>
                  <div className="flex items-center">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" strokeWidth="10" />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="10"
                          strokeDasharray="220 283"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">780</div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm text-gray-500">Current Score</div>
                      <div className="text-green-600 font-semibold">Excellent</div>
                      <div className="text-sm text-gray-500 mt-1">+135 points since start</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <h3 className="text-lg font-semibold">Improvements Made</h3>
                  {[
                    "Removed 3 incorrect late payments",
                    "Disputed 2 collections accounts",
                    "Reduced credit utilization by 25%",
                    "Added positive payment history",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium">Score History</div>
                    <div className="text-xs text-green-600">+27% improvement</div>
                  </div>
                  <div className="h-20 relative">
                    <div className="absolute inset-0">
                      <svg viewBox="0 0 100 40" className="w-full h-full">
                        <path
                          d="M0,35 L20,30 L40,25 L60,15 L80,10 L100,5"
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <div>Jan</div>
                    <div>Feb</div>
                    <div>Mar</div>
                    <div>Apr</div>
                    <div>May</div>
                    <div>Jun</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-100 rounded-full opacity-50 z-0"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-100 rounded-full opacity-50 z-0"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
