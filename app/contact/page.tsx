"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import CalendlyModal from "../components/CalendlyModal"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-blue-600 text-white py-16 md:py-24 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white drop-shadow-sm">Contact Us</h1>
            <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto text-blue-50">
              Get in touch with our team of financial consultants today
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calendly CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white p-8 rounded-lg shadow-md border border-slate-100"
            >
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Schedule a Consultation</h2>
              <p className="text-slate-600 mb-6">
                Ready to explore funding options for your business? Schedule a free consultation with one of our
                financial experts to discuss your needs and learn about potential solutions.
              </p>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                onClick={() => setIsCalendlyOpen(true)}
              >
                Book Your Consultation Now
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white p-8 rounded-lg shadow-md border border-slate-100"
            >
              <h3 className="text-2xl font-bold mb-6 text-slate-800">Contact Information</h3>
              <div className="space-y-5">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-slate-800">Email:</p>
                    <a href="mailto:info@diamondtier.solutions" className="text-blue-600 hover:underline">
                      info@diamondtier.solutions
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-slate-800">Phone:</p>
                    <a href="tel:+13059223379" className="text-blue-600 hover:underline">
                      (305) 922-3379
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-slate-800">Address:</p>
                    <p className="text-slate-600">1501 Biscayne Blvd Suite 501, Miami, FL 33132</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-slate-800">Business Hours:</p>
                    <p className="text-slate-600">Monday - Friday: 9:00 AM - 5:00 PM EST</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800">Visit Our Office</h2>
            <p className="text-lg text-slate-600">We're conveniently located in the heart of Miami</p>
          </motion.div>
          <div className="rounded-lg overflow-hidden shadow-md border border-slate-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.6881967484!2d-80.19147648497953!3d25.78772798362354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b6823af8f3eb%3A0x3b3c47a5a8b91a1f!2s1501%20Biscayne%20Blvd%2C%20Miami%2C%20FL%2033132!5e0!3m2!1sen!2sus!4v1625584362545!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              className="w-full"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Find quick answers to common questions about contacting us
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: "What's the best way to contact you?",
                a: "The fastest way to reach us is through our contact form or by email at info@diamondtier.solutions. We aim to respond to all inquiries within 24 hours.",
              },
              {
                q: "Do you offer in-person consultations?",
                a: "Yes, we offer in-person consultations at our Miami office. Please schedule an appointment in advance.",
              },
              {
                q: "Can I request a callback?",
                a: "Yes! Just leave your phone number in the message field of our contact form, and we'll give you a call back at a time convenient for you.",
              },
              {
                q: "What information should I provide when contacting you?",
                a: "Please include your name, contact information, and a brief description of your business and financial needs. This helps us prepare for our conversation.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-100"
              >
                <h3 className="text-lg font-bold mb-3 text-slate-800">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </div>
  )
}
