"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GraduationCap, FileSearch, BarChart } from "lucide-react"
import { useRouter } from "next/navigation"

const features = [
  {
    icon: GraduationCap,
    title: "Credit Education",
    description: "We provide educational resources to help you understand factors that affect your credit.",
  },
  {
    icon: FileSearch,
    title: "Report Review Guidance",
    description: "We offer information on how to review your credit reports for potential inaccuracies.",
  },
  {
    icon: BarChart,
    title: "Progress Monitoring Tools",
    description: "Access educational tools to help track your credit journey.",
  },
]

export default function CreditRepairSection() {
  const router = useRouter()

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Credit Education Services
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Understanding your credit is an important part of your financial journey. Our team offers educational
            resources to help you make informed decisions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border-t-4 border-blue-500"
              >
                <feature.icon className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => router.push("/credit-repair")}
            >
              Learn About Credit Education
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto text-blue-600 border-blue-600 hover:bg-blue-100 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => router.push("/credit-repair")}
            >
              Explore Resources
            </Button>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 w-full h-1/3 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <motion.path
            fill="#3B82F6"
            fillOpacity="0.1"
            d="M0,32L48,53.3C96,75,192,117,288,122.7C384,128,480,96,576,90.7C672,85,768,107,864,128C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            animate={{
              d: [
                "M0,32L48,53.3C96,75,192,117,288,122.7C384,128,480,96,576,90.7C672,85,768,107,864,128C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,101.3C672,107,768,149,864,165.3C960,181,1056,171,1152,144C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              ],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              duration: 10,
              ease: "easeInOut",
            }}
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-10 right-10 text-blue-400 opacity-50 hidden md:block"
        animate={{ y: [0, -20, 0], rotate: [0, 360] }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <GraduationCap size={40} />
      </motion.div>
    </section>
  )
}
