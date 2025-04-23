"use client"

import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What types of business funding do you offer?",
    answer:
      "We offer a variety of funding solutions including SBA loans, 0% credit lines, unsecured loans, and business credit card stacking. Our team works with you to determine the best option based on your specific business needs and qualifications.",
  },
  {
    question: "How long does the approval process take?",
    answer:
      "Our approval process is streamlined for efficiency. Depending on the funding type, you can receive approval in as little as 24-48 hours. SBA loans typically take longer, usually 2-4 weeks, due to government processing requirements.",
  },
  {
    question: "What credit score do I need to qualify?",
    answer:
      "Credit score requirements vary by funding type. Generally, we recommend a minimum score of 650 for optimal options, but we have solutions for businesses with scores as low as 580. If your credit score is lower, our credit repair services can help improve it.",
  },
  {
    question: "Do I need collateral for business funding?",
    answer:
      "Not all of our funding options require collateral. We offer unsecured loans and credit lines specifically designed for businesses without assets to pledge. SBA loans may require collateral depending on the loan amount and your business profile.",
  },
  {
    question: "Can startups qualify for your funding solutions?",
    answer:
      "Yes, we have funding options for startups, though they may differ from those available to established businesses. Startups typically qualify for smaller initial amounts, with opportunities to access more funding as they build business credit history.",
  },
  {
    question: "How can I get started with Diamond Tier Capital?",
    answer:
      "Getting started is easy! Simply schedule a free consultation through our website. During this call, one of our funding experts will discuss your business needs, explain your options, and guide you through the next steps in the process.",
  },
]

export default function FAQ() {
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block px-4 py-1 bg-blue-100 rounded-full text-blue-600 font-medium text-sm mb-4">
            Common Questions
          </div>
          <h2 className="mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">Find answers to common questions about our business funding solutions</p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="border border-gray-200 rounded-lg mb-4 overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">{faq.answer}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
