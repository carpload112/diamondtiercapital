"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Star, BookOpen, BarChart3, Award, Shield, TrendingUp } from "lucide-react"
import CalendlyModal from "@/components/layout/CalendlyModal"
import Image from "next/image"
import { useRouter } from "next/navigation"

const educationTopics = [
  {
    icon: BookOpen,
    name: "Understanding Credit Reports",
    description: "Learn how to read and interpret your credit reports from the major bureaus.",
    benefits: [
      "Identify what factors affect your credit score",
      "Learn how to request your free annual credit reports",
      "Understand the different sections of your credit report",
    ],
  },
  {
    icon: BarChart3,
    name: "Credit Score Factors",
    description: "Discover the key components that make up your credit score.",
    benefits: [
      "Learn about payment history and its impact",
      "Understand credit utilization ratios",
      "Discover how credit history length affects your score",
    ],
  },
  {
    icon: TrendingUp,
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
  {
    icon: BookOpen,
    title: "Better understanding of credit factors",
    description: "Learn the key elements that influence your credit score and how to manage them effectively.",
  },
  {
    icon: Shield,
    title: "Knowledge of credit reporting processes",
    description: "Understand how credit bureaus collect and report information about your financial activities.",
  },
  {
    icon: Award,
    title: "Improved financial literacy",
    description: "Gain valuable insights into financial management principles that support good credit.",
  },
  {
    icon: TrendingUp,
    title: "Educational resources for business owners",
    description: "Access specialized materials designed for entrepreneurs and business credit development.",
  },
]

const testimonials = [
  {
    quote:
      "The educational resources provided by Diamond Tier Capital helped me understand my business credit profile better.",
    author: "Alex T., Tech Entrepreneur",
    rating: 5,
    image: "/diverse-business-person.png",
  },
  {
    quote: "Their credit education program gave me valuable insights into how to build my business credit properly.",
    author: "Linda M., Restaurant Owner",
    rating: 5,
    image: "/restaurant-owner.png",
  },
  {
    quote:
      "The credit monitoring tools and educational materials have been extremely helpful for my business planning.",
    author: "Robert K., Real Estate Investor",
    rating: 5,
    image: "/real-estate-investor.png",
  },
]

export default function CreditRepairPage() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background with animated gradient overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/abstract-financial-pattern.png"
            alt="Abstract financial pattern background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-800/90 to-indigo-900/80" />

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
          <div className="absolute inset-0 bg-noise"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.6 }}
              className="inline-block px-4 py-1 rounded-full glass-dark text-sm font-medium text-white mb-6"
            >
              <Star className="h-4 w-4 inline mr-2 text-yellow-400" />
              Educational Resources for Financial Success
            </motion.div>

            <motion.h1
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Credit Education <span className="text-gradient shimmer block">Services</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-blue-100 mb-8"
            >
              Educational resources to help you understand credit factors and make informed financial decisions
            </motion.p>

            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="btn-gradient text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                onClick={() => setIsCalendlyOpen(true)}
              >
                Schedule Consultation{" "}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 text-lg px-8 py-6 rounded-xl"
                onClick={() => {
                  const educationSection = document.getElementById("education-topics")
                  if (educationSection) {
                    educationSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                Explore Resources
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-16 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <motion.path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,213.3C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              animate={{
                d: [
                  "M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,213.3C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
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
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <Image src="/abstract-dots-pattern.png" alt="Abstract pattern" fill className="object-cover" />
        </div>

        <div className="container px-4 mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: "500+", label: "Clients Educated", icon: BookOpen },
              { value: "12+", label: "Educational Resources", icon: Award },
              { value: "98%", label: "Client Satisfaction", icon: Star },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <stat.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-4xl font-bold text-blue-700 mb-2">{stat.value}</p>
                    <p className="text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Process Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-30"></div>

        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Credit Education Process</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide a structured approach to help you understand and improve your credit knowledge
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-10 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-600 hidden md:block"></div>

              <div className="space-y-12">
                {[
                  {
                    step: 1,
                    title: "Credit Assessment",
                    description: "We help you understand how to review your current credit situation.",
                    icon: BookOpen,
                  },
                  {
                    step: 2,
                    title: "Educational Resources",
                    description: "We provide materials to help you understand credit factors.",
                    icon: Award,
                  },
                  {
                    step: 3,
                    title: "Monitoring Tools",
                    description: "We offer tools to help you monitor changes to your credit profile.",
                    icon: BarChart3,
                  },
                  {
                    step: 4,
                    title: "Ongoing Support",
                    description: "We provide continued educational support as you work on your credit knowledge.",
                    icon: Shield,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg z-10">
                      <item.icon className="h-8 w-8" />
                    </div>
                    <div className="ml-6 glass-card p-6 flex-1 rounded-xl">
                      <div className="flex items-center mb-2">
                        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mr-3">
                          {item.step}
                        </span>
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                      </div>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Topics Section */}
      <section id="education-topics" className="py-16 bg-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 opacity-10">
          <Image src="/abstract-financial-grid.png" alt="Abstract financial grid" fill className="object-cover" />
        </div>

        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Educational Resources</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive materials designed to enhance your understanding of credit
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {educationTopics.map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 h-full overflow-hidden group">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <topic.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {topic.name}
                    </h3>
                    <p className="text-gray-600 mb-6">{topic.description}</p>
                    <h4 className="font-medium mb-3 text-blue-700">What You'll Learn:</h4>
                    <ul className="space-y-2">
                      {topic.benefits.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-30"></div>

        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)",
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

        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefits of Credit Education</h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Discover how our educational resources can help you make better financial decisions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mr-4">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-blue-100">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-5">
          <Image src="/abstract-business-pattern.png" alt="Abstract business pattern" fill className="object-cover" />
        </div>

        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from business owners who have benefited from our credit education services
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.author}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <p className="font-semibold">{testimonial.author}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-30"></div>

        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)",
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

        <div className="container px-4 mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Learn More?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Schedule a consultation to discuss our educational resources and how they can help you understand credit
              factors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                onClick={() => setIsCalendlyOpen(true)}
              >
                Schedule Your Free Consultation{" "}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl"
                onClick={() => router.push("/contact")}
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
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
