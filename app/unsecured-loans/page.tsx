"use client"

import { motion } from "framer-motion"
import { CheckCircle, Banknote, Clock, ShieldCheck, TrendingUp } from "lucide-react"
import ServicePageLayout from "../components/ServicePageLayout"

export default function UnsecuredLoansPage() {
  return (
    <ServicePageLayout
      title="Unsecured Business Loans"
      subtitle="Quick access to capital without collateral requirements"
      icon={<Banknote className="w-full h-full text-white/90 drop-shadow-lg" />}
      primaryCTA="Get Funded"
      secondaryCTA="Learn More"
    >
      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Unsecured Loans?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the advantages of our unsecured business loans
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "No Collateral Required",
                description: "Get funded without putting your business assets at risk",
              },
              {
                icon: Clock,
                title: "Fast Approval",
                description: "Quick application process with decisions in as little as 24 hours",
              },
              {
                icon: TrendingUp,
                title: "Flexible Use of Funds",
                description: "Use the capital for any legitimate business purpose",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Unsecured Loan Process</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Apply Online", description: "Complete our simple application in minutes." },
              { title: "Quick Decision", description: "Get approved within 24-48 hours." },
              { title: "Receive Funds", description: "Funds deposited directly to your business account." },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-lg shadow-md text-center"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mb-4 mx-auto">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Eligibility Requirements</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See if you qualify for our unsecured business loans
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "Minimum 6 months in business",
              "$10,000+ in monthly revenue",
              "550+ credit score",
              "U.S. based business",
              "No open bankruptcies",
              "Valid business checking account",
            ].map((requirement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
                <p className="text-gray-800">{requirement}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get answers to common questions about our unsecured business loans
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                q: "How much can I borrow with an unsecured business loan?",
                a: "Loan amounts typically range from $5,000 to $500,000, depending on your business's qualifications and needs.",
              },
              {
                q: "What can I use the unsecured loan for?",
                a: "You can use the funds for various business purposes, including working capital, equipment purchases, expansion, or inventory.",
              },
              {
                q: "How long does it take to get approved and funded?",
                a: "Our streamlined process allows for approval within 24-48 hours, with funding possible in as little as 2-3 business days.",
              },
              {
                q: "Do you require a personal guarantee?",
                a: "While we don't require collateral, we may ask for a personal guarantee depending on the loan amount and your business's financial strength.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-bold mb-3">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </ServicePageLayout>
  )
}
