"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Download, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

interface ApplicationSuccessProps {
  referenceId: string
}

export default function ApplicationSuccess({ referenceId }: ApplicationSuccessProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-2xl mx-auto">
      <Card className="border-0 shadow-xl overflow-hidden bg-white/95 backdrop-blur-sm dark:bg-gray-800/90">
        <CardContent className="p-8 md:p-12">
          <motion.div className="flex flex-col items-center text-center space-y-6" variants={itemVariants}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.3,
              }}
              className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
            >
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </motion.div>

            <motion.h2 className="text-3xl font-bold text-gray-900 dark:text-white" variants={itemVariants}>
              Application Submitted!
            </motion.h2>

            <motion.p className="text-gray-600 dark:text-gray-300 text-lg" variants={itemVariants}>
              Thank you for your application. Our team will review your information and contact you shortly.
            </motion.p>

            <motion.div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 w-full" variants={itemVariants}>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Your Reference ID</p>
              <p className="text-xl font-mono font-bold text-primary tracking-wider">{referenceId}</p>
            </motion.div>

            <motion.div className="flex flex-col sm:flex-row gap-4 w-full" variants={itemVariants}>
              <Button variant="outline" size="lg" className="flex-1 gap-2" onClick={() => window.print()}>
                <Download className="w-4 h-4" />
                Save Application
              </Button>
              <Button variant="outline" size="lg" className="flex-1 gap-2" asChild>
                <Link href="https://calendly.com/diamond-tier-capital/consultation">
                  <Calendar className="w-4 h-4" />
                  Schedule Consultation
                </Link>
              </Button>
            </motion.div>

            <motion.div className="border-t border-gray-100 dark:border-gray-700 pt-6 w-full" variants={itemVariants}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">What happens next?</h3>
              <ol className="space-y-4 text-left">
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    1
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our team will review your application within 1-2 business days.
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    2
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    A funding specialist will contact you to discuss your options.
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    3
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    We'll work with you to finalize the best funding solution for your business.
                  </p>
                </li>
              </ol>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button asChild size="lg" className="gap-2 mt-4">
                <Link href="/">
                  Return to Homepage
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
