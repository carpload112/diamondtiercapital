"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import CalendlyModal from "@/components/layout/CalendlyModal"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  Send,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  CheckCircle2,
} from "lucide-react"

export default function ContactPage() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setFormSubmitted(true)

    // Reset form after 5 seconds
    setTimeout(() => {
      setFormSubmitted(false)
      const form = e.target as HTMLFormElement
      form.reset()
    }, 5000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-accent text-white py-20 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("/abstract-financial-pattern.png")`,
            backgroundSize: "cover",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-sm">Get In Touch</h1>
            <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Have questions about business funding? Our team of financial experts is here to help you navigate your
              options.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                onClick={() => setIsCalendlyOpen(true)}
                className="bg-white text-primary hover:bg-white/90 shadow-lg"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Consultation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10"
                onClick={() => {
                  const formElement = document.getElementById("contact-form")
                  if (formElement) {
                    formElement.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                <Mail className="mr-2 h-5 w-5" />
                Send Message
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-24 relative z-20">
            {[
              {
                icon: <Phone className="h-8 w-8 text-primary" />,
                title: "Call Us",
                content: "(305) 922-3379",
                action: "tel:+13059223379",
                actionText: "Call Now",
              },
              {
                icon: <Mail className="h-8 w-8 text-primary" />,
                title: "Email Us",
                content: "info@diamondtier.solutions",
                action: "mailto:info@diamondtier.solutions",
                actionText: "Send Email",
              },
              {
                icon: <MapPin className="h-8 w-8 text-primary" />,
                title: "Visit Us",
                content: "1501 Biscayne Blvd Suite 501, Miami, FL 33132",
                action: "https://maps.google.com/?q=1501+Biscayne+Blvd+Suite+501+Miami+FL+33132",
                actionText: "Get Directions",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.content}</p>
                <a
                  href={item.action}
                  className="text-primary hover:text-primary/80 font-medium flex items-center"
                  target={item.action.startsWith("http") ? "_blank" : undefined}
                  rel={item.action.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {item.actionText}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Map Section */}
      <section className="py-16" id="contact-form">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
                <h2 className="text-2xl font-bold">Send Us a Message</h2>
                <p className="text-white/90">We'll get back to you as soon as possible</p>
              </div>

              <div className="p-6">
                {formSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">Thank you for reaching out. We'll get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" placeholder="John Doe" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" placeholder="(123) 456-7890" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" name="subject" placeholder="How can we help you?" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us about your business and funding needs..."
                        rows={4}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Business Hours</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">Monday - Friday</p>
                        <p className="text-gray-600">9:00 AM - 5:00 PM EST</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">Saturday</p>
                        <p className="text-gray-600">By appointment only</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">Sunday</p>
                        <p className="text-gray-600">Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Connect With Us</h3>
                  <div className="flex space-x-4">
                    {[
                      {
                        icon: <Linkedin className="h-5 w-5" />,
                        url: "https://linkedin.com/company/diamond-tier-capital",
                      },
                      { icon: <Facebook className="h-5 w-5" />, url: "https://facebook.com/diamondtiercapital" },
                      { icon: <Twitter className="h-5 w-5" />, url: "https://twitter.com/diamondtiercap" },
                      { icon: <Instagram className="h-5 w-5" />, url: "https://instagram.com/diamondtiercapital" },
                    ].map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors duration-300"
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Need Immediate Assistance?</h3>
                  <p className="text-gray-600 mb-4">
                    Schedule a free consultation with one of our financial experts to discuss your business funding
                    needs.
                  </p>
                  <Button
                    onClick={() => setIsCalendlyOpen(true)}
                    className="w-full bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Consultation
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Visit Our Office</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're conveniently located in the heart of Miami's business district
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="rounded-xl overflow-hidden shadow-xl border border-gray-200 h-[450px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.6881967484!2d-80.19147648497953!3d25.78772798362354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b6823af8f3eb%3A0x3b3c47a5a8b91a1f!2s1501%20Biscayne%20Blvd%2C%20Miami%2C%20FL%2033132!5e0!3m2!1sen!2sus!4v1625584362545!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              className="w-full h-full"
            ></iframe>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find quick answers to common questions about contacting us
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                q: "What's the best way to contact you?",
                a: "The fastest way to reach us is through our contact form or by email at info@diamondtier.solutions. We aim to respond to all inquiries within 24 hours.",
              },
              {
                q: "Do you offer in-person consultations?",
                a: "Yes, we offer in-person consultations at our Miami office. Please schedule an appointment in advance using our online calendar.",
              },
              {
                q: "Can I request a callback?",
                a: "Yes! Just leave your phone number in the message field of our contact form, and we'll give you a call back at a time convenient for you.",
              },
              {
                q: "What information should I provide when contacting you?",
                a: "Please include your name, contact information, and a brief description of your business and financial needs. This helps us prepare for our conversation.",
              },
              {
                q: "Is there a fee for initial consultations?",
                a: "No, initial consultations are completely free. We believe in providing value first and helping you understand your options without any obligation.",
              },
              {
                q: "How quickly can I expect a response?",
                a: "We typically respond to all inquiries within 24 business hours. For urgent matters, please call us directly at (305) 922-3379.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <h3 className="text-lg font-bold mb-3 text-gray-800">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
            <p className="text-lg mb-8 text-white/90">
              Take the first step toward securing the funding your business needs to thrive.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                onClick={() => setIsCalendlyOpen(true)}
                className="bg-white text-primary hover:bg-white/90"
              >
                Schedule Your Free Consultation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10"
                asChild
              >
                <a href="/applynow">Apply Now</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </div>
  )
}
