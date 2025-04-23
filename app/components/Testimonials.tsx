"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "John Doe",
    company: "Tech Innovators Inc.",
    content:
      "Diamond Tier Capital helped us secure the funding we needed to scale our operations. Their expertise in business credit card stacking was invaluable.",
    avatar: "JD",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "Jane Smith",
    company: "Green Energy Solutions",
    content:
      "The 0% line of credit we obtained through Diamond Tier Capital allowed us to manage our cash flow effectively during our expansion phase.",
    avatar: "JS",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    name: "Robert Johnson",
    company: "Johnson Manufacturing",
    content:
      "I was skeptical at first, but their team guided me through the entire SBA loan process. The funding helped us purchase new equipment and hire additional staff.",
    avatar: "RJ",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
]

export default function Testimonials() {
  return (
    <section className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block px-4 py-1 bg-blue-100 rounded-full text-blue-600 font-medium text-sm mb-4">
            Client Success Stories
          </div>
          <h2 className="mb-4">What Our Clients Say</h2>
          <p className="text-xl text-gray-600">
            Hear from businesses that have transformed their growth with our funding solutions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                <CardContent className="p-0">
                  <div className="p-6 relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute top-6 right-6 h-12 w-12 text-blue-100 rotate-180"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                    </svg>

                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    <p className="italic text-gray-600 mb-6 relative z-10">&ldquo;{testimonial.content}&rdquo;</p>

                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 border-2 border-blue-100">
                        <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
