"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight } from "lucide-react"
import SBAFormStep from "../components/SBAFormStep"
import ConfettiExplosion from "react-confetti-explosion"
import { submitLoanApplication } from "@/lib/form-service"
import { useToast } from "@/components/ui/use-toast"

const formSteps = [
  {
    title: "Basic Information",
    fields: [
      { name: "fullName", label: "Full Name", type: "text", placeholder: "John Doe" },
      { name: "email", label: "Email Address", type: "email", placeholder: "john@example.com" },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "(123) 456-7890" },
    ],
  },
  {
    title: "Business Details",
    fields: [
      { name: "businessName", label: "Business Name", type: "text", placeholder: "Acme Inc." },
      {
        name: "businessType",
        label: "Business Type",
        type: "select",
        options: ["Sole Proprietorship", "LLC", "Corporation", "Partnership"],
      },
      { name: "yearsInBusiness", label: "Years in Business", type: "number", placeholder: "2" },
    ],
  },
  {
    title: "Loan Information",
    fields: [
      { name: "loanAmount", label: "Desired Loan Amount", type: "number", placeholder: "50000" },
      {
        name: "loanPurpose",
        label: "Loan Purpose",
        type: "select",
        options: ["Working Capital", "Equipment Purchase", "Real Estate", "Debt Refinancing"],
      },
      { name: "collateral", label: "Do you have collateral?", type: "radio", options: ["Yes", "No"] },
    ],
  },
  {
    title: "Financial Information",
    fields: [
      { name: "annualRevenue", label: "Annual Revenue", type: "number", placeholder: "100000" },
      {
        name: "creditScore",
        label: "Estimated Credit Score",
        type: "select",
        options: ["Excellent (750+)", "Good (700-749)", "Fair (650-699)", "Poor (Below 650)"],
      },
      {
        name: "bankruptcy",
        label: "Have you filed for bankruptcy in the last 7 years?",
        type: "radio",
        options: ["Yes", "No"],
      },
    ],
  },
]

export default function ApplyNow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isExploding, setIsExploding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const nextStep = async () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsSubmitting(true)
      try {
        // Convert numeric fields to numbers
        const processedData = {
          ...formData,
          yearsInBusiness: Number.parseInt(formData.yearsInBusiness) || 0,
          loanAmount: Number.parseInt(formData.loanAmount) || 0,
          annualRevenue: Number.parseInt(formData.annualRevenue) || 0,
        }

        await submitLoanApplication(processedData)
        setIsExploding(true)
        toast({
          title: "Application Submitted",
          description: "We've received your loan application and will contact you soon.",
          variant: "default",
        })
      } catch (error) {
        console.error("Error submitting application:", error)
        toast({
          title: "Submission Error",
          description: "There was a problem submitting your application. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">SBA Loan Application</h1>
          <Progress value={((currentStep + 1) / formSteps.length) * 100} className="mb-6" />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <SBAFormStep step={formSteps[currentStep]} formData={formData} onChange={handleInputChange} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="px-8 py-4 bg-gray-50 flex justify-between items-center">
          <Button onClick={prevStep} disabled={currentStep === 0} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button onClick={nextStep} disabled={isSubmitting}>
            {currentStep === formSteps.length - 1 ? (isSubmitting ? "Submitting..." : "Submit") : "Next"}{" "}
            {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </motion.div>
      {isExploding && <ConfettiExplosion force={0.8} duration={3000} particleCount={250} width={1600} />}
    </div>
  )
}
