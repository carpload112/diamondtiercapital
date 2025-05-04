"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { Quote } from "lucide-react"

const testimonials = [
  {
    name: "John Doe",
    company: "Tech Innovators Inc.",
    content:
      "Diamond Tier Capital provided valuable guidance on business funding options. Their expertise in business credit education was very helpful for our startup's growth strategy.",
    avatar: "JD",
    rating: 5,
  },
  {
    name: "Jane Smith",
    company: "Green Energy Solutions",
    content:
      "The consultation services from Diamond Tier Capital helped us understand our financing options during our expansion phase. Their team was professional and knowledgeable.",
    avatar: "JS",
    rating: 5,
  },
  {
    name: "Robert Johnson",
    company: "Johnson Manufacturing",
    content:
      "Their team took the time to understand our business needs and provided tailored funding recommendations that worked for us. Highly recommend their services.",
    avatar: "RJ",
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-b from-secondary/50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[30%] rounded-full bg-accent/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Testimonials
          </div>
          <h2 className="text-4xl font-bold mb-4 gradient-text">What Our Clients Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from businesses we've helped with their funding needs
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
              <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-none overflow-hidden group">
                <CardContent className="p-0">
                  <div className="p-6 relative">
                    <div className="absolute top-6 right-6 text-primary/20 group-hover:text-primary/30 transition-colors">
                      <Quote className="h-12 w-12" />
                    </div>

                    {/* Rating */}
                    <div className="flex mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>

                    <p className="italic text-gray-600 mb-6 relative z-10">&ldquo;{testimonial.content}&rdquo;</p>

                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                        <AvatarImage src={`https://i.pravatar.cc/48?u=${testimonial.name}`} />
                        <AvatarFallback className="bg-primary/10 text-primary">{testimonial.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
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
