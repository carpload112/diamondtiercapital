"use client"

import { motion } from "framer-motion"
import { CheckCircle, Percent } from "lucide-react"
import ServicePageLayout from "../components/ServicePageLayout"

export default function ZeroPercentCreditLinesPage() {
  return (
    <ServicePageLayout
      title="0% Credit Lines"
      subtitle="Access flexible funding with no interest for up to 18 months"
      icon={<Percent className="w-full h-full text-white/90 drop-shadow-lg" />}
      primaryCTA="Get Your Credit Line"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Benefits of 0% Credit Lines</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock the power of interest-free financing for your business growth
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Percent,
                title: "0% Interest",
                description: "No interest charges for up to 18 months on your credit line",
              },
              {
                icon: CheckCircle,
                title: "Flexible Credit Limits",
                description: "Access credit limits up to $150,000 for your business needs",
              },
              {
                icon: CheckCircle,
                title: "No Collateral Required",
                description: "Unsecured credit lines with no need for business assets as collateral",
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

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: "Apply", description: "Complete our simple online application in minutes." },
              { title: "Get Approved", description: "Receive a decision within 24-48 hours." },
              { title: "Access Funds", description: "Get immediate access to your credit line." },
              { title: "Grow", description: "Use funds to fuel your business growth interest-free." },
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

      {/* Use Cases Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How You Can Use 0% Credit Lines</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the various ways our 0% credit lines can help your business thrive
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "Inventory purchases",
              "Equipment upgrades",
              "Marketing campaigns",
              "Hiring new employees",
              "Expanding business locations",
              "Managing cash flow",
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
                <p className="text-gray-800 font-semibold">{useCase}</p>
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
              Get answers to common questions about our 0% credit lines
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                q: "How long is the 0% interest period?",
                a: "Our 0% interest period typically lasts up to 18 months, giving you ample time to use and repay the funds without accruing interest charges.",
              },
              {
                q: "What happens after the 0% period ends?",
                a: "After the 0% period, any remaining balance will be subject to the standard interest rate. We'll provide clear information about the post-promotional rate before you apply.",
              },
              {
                q: "Is there a credit check required?",
                a: "Yes, we do perform a credit check as part of our approval process. However, we consider multiple factors beyond just credit score when making our decisions.",
              },
              {
                q: "Can I use the credit line for any business expense?",
                a: "Yes, you can use the 0% credit line for virtually any legitimate business expense, from inventory purchases to marketing campaigns and beyond.",
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
