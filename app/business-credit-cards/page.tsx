"use client"

import { motion } from "framer-motion"
import { CreditCard, TrendingUp, Gift } from "lucide-react"
import ServicePageLayout from "../components/ServicePageLayout"

export default function BusinessCreditCardsPage() {
  return (
    <ServicePageLayout
      title="Business Credit Cards"
      subtitle="Maximize your purchasing power with strategic credit card stacking"
      icon={<CreditCard className="w-full h-full text-white/90 drop-shadow-lg" />}
      primaryCTA="Explore Cards"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Benefits of Our Credit Card Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock powerful financial tools for your business growth
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: CreditCard,
                title: "Multiple High-Limit Cards",
                description: "Access to various cards with high credit limits for your business needs",
              },
              {
                icon: Gift,
                title: "Rewards Optimization",
                description: "Earn maximum rewards on your business spending across different categories",
              },
              {
                icon: TrendingUp,
                title: "Build Business Credit",
                description: "Establish and improve your business credit profile with responsible use",
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

      {/* Credit Card Stacking Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Credit Card Stacking Process</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: "Assess", description: "We evaluate your business profile and credit history." },
              { title: "Strategize", description: "Develop a custom card stacking strategy for your needs." },
              { title: "Apply", description: "We handle applications for multiple cards simultaneously." },
              { title: "Maximize", description: "Learn how to optimize your new credit for business growth." },
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

      {/* Card Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Types of Business Credit Cards</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the various credit card options available for your business
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "Cash Back Cards",
              "Travel Reward Cards",
              "0% Intro APR Cards",
              "Secured Business Cards",
              "Charge Cards",
              "Co-branded Cards",
            ].map((cardType, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <CreditCard className="h-8 w-8 text-blue-500 mb-4" />
                <p className="text-gray-800 font-semibold">{cardType}</p>
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
              Get answers to common questions about business credit cards and our stacking strategy
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                q: "What is credit card stacking?",
                a: "Credit card stacking is the strategic process of applying for and using multiple business credit cards to maximize your overall credit limit and optimize rewards across different spending categories.",
              },
              {
                q: "How many credit cards can I get through stacking?",
                a: "The number of cards depends on your business's qualifications and needs. We typically recommend 3-5 cards for most businesses, but this can vary.",
              },
              {
                q: "Will applying for multiple cards hurt my credit score?",
                a: "While there may be a temporary dip in your credit score due to multiple inquiries, responsible use of the new credit lines can ultimately improve your credit profile in the long term.",
              },
              {
                q: "How do you determine which cards are best for my business?",
                a: "We analyze your business spending patterns, credit profile, and financial goals to recommend a tailored mix of cards that will provide the most benefit in terms of credit limits, rewards, and features.",
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
