"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import FormStep from "./FormStep"
import FormProgress from "./FormProgress"
import MobileStepper from "./MobileStepper"
import ApplicationSuccess from "./ApplicationSuccess"
import ConfettiExplosion from "react-confetti-explosion"
import { useToast } from "@/components/ui/use-toast"
import { BankStatementUploader } from "@/components/BankStatementUploader"
import { submitApplication } from "@/lib/supabase/actions"

// Define the form steps with improved descriptions and tooltips
const formSteps = [
  {
    title: "Personal Information",
    description: "Tell us about yourself so we can personalize your experience.",
    icon: "User",
    fields: [
      {
        name: "fullName",
        label: "Full Name",
        type: "text",
        placeholder: "John Doe",
        required: true,
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "john@example.com",
        required: true,
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        placeholder: "(123) 456-7890",
        required: true,
      },
      {
        name: "preferredContact",
        label: "Preferred Contact Method",
        type: "select",
        options: ["Email", "Phone", "Text"],
        required: true,
      },
    ],
  },
  {
    title: "Business Details",
    description: "Tell us about your business to help us understand your needs.",
    icon: "Building2",
    fields: [
      {
        name: "businessName",
        label: "Business Name",
        type: "text",
        placeholder: "Acme Inc.",
        required: true,
      },
      {
        name: "businessType",
        label: "Business Structure",
        type: "select",
        options: ["Sole Proprietorship", "LLC", "Corporation", "Partnership", "Non-Profit"],
        required: true,
        tooltip: "Your business structure affects your tax obligations and personal liability.",
      },
      {
        name: "ein",
        label: "EIN",
        type: "text",
        placeholder: "XX-XXXXXXX",
        tooltip: "Your Employer Identification Number (if applicable)",
      },
      {
        name: "yearsInBusiness",
        label: "Years in Business",
        type: "select",
        options: ["Less than 1 year", "1-2 years", "3-5 years", "5+ years"],
        required: true,
      },
      {
        name: "industry",
        label: "Industry",
        type: "select",
        options: [
          "Retail",
          "Food & Beverage",
          "Professional Services",
          "Construction",
          "Healthcare",
          "Technology",
          "Manufacturing",
          "Real Estate",
          "Other",
        ],
        required: true,
      },
    ],
  },
  {
    title: "Financial Needs",
    description: "Help us understand your funding requirements.",
    icon: "DollarSign",
    fields: [
      {
        name: "fundingAmount",
        label: "Desired Funding Amount",
        type: "select",
        options: ["Under $50,000", "$50,000 - $100,000", "$100,000 - $250,000", "$250,000 - $500,000", "Over $500,000"],
        required: true,
      },
      {
        name: "fundingPurpose",
        label: "Primary Funding Purpose",
        type: "select",
        options: [
          "Working Capital",
          "Equipment Purchase",
          "Real Estate",
          "Debt Refinancing",
          "Business Expansion",
          "Inventory Purchase",
          "Marketing & Advertising",
          "Hiring & Staffing",
        ],
        required: true,
        tooltip: "What you plan to use the funds for helps us recommend the right financing options.",
      },
      {
        name: "timeframe",
        label: "Funding Timeframe",
        type: "select",
        options: [
          "Immediate (0-30 days)",
          "Short-term (1-3 months)",
          "Medium-term (3-6 months)",
          "Long-term (6+ months)",
        ],
        required: true,
      },
      {
        name: "collateral",
        label: "Do you have collateral available?",
        type: "radio",
        options: ["Yes", "No", "Not Sure"],
        tooltip: "Assets that can be used to secure a loan, such as real estate, equipment, or inventory.",
      },
    ],
  },
  {
    title: "Financial Information",
    description: "This helps us determine which financing options you qualify for.",
    icon: "LineChart",
    fields: [
      {
        name: "annualRevenue",
        label: "Annual Business Revenue",
        type: "select",
        options: [
          "Pre-revenue",
          "Under $100,000",
          "$100,000 - $250,000",
          "$250,000 - $500,000",
          "$500,000 - $1 million",
          "Over $1 million",
        ],
        required: true,
      },
      {
        name: "estimatedMonthlyDeposits",
        label: "Estimated Monthly Deposits",
        type: "select",
        options: [
          "Under $5,000",
          "$5,000 - $10,000",
          "$10,000 - $25,000",
          "$25,000 - $50,000",
          "$50,000 - $100,000",
          "Over $100,000",
        ],
        required: true,
        tooltip: "Your average monthly deposits help us determine your cash flow and funding eligibility.",
      },
      {
        name: "creditScore",
        label: "Estimated Personal Credit Score",
        type: "select",
        options: ["Excellent (750+)", "Good (700-749)", "Fair (650-699)", "Poor (Below 650)", "Not Sure"],
        required: true,
        tooltip:
          "Your personal credit score is often considered for business financing, especially for new businesses.",
      },
      {
        name: "bankruptcy",
        label: "Have you filed for bankruptcy in the last 7 years?",
        type: "radio",
        options: ["Yes", "No"],
        required: true,
      },
    ],
  },
  {
    title: "Bank Statements",
    description: "Upload your last 3 months of business bank statements for verification.",
    icon: "FileText",
    fields: [
      {
        name: "bankStatements",
        label: "Bank Statements",
        type: "custom",
        component: "BankStatementUploader",
        required: true,
        tooltip: "We need your last 3 months of business bank statements to verify your income and expenses.",
      },
    ],
  },
  {
    title: "Additional Information",
    description: "Help us provide you with the best possible service.",
    icon: "FileText",
    fields: [
      {
        name: "hearAboutUs",
        label: "How did you hear about us?",
        type: "select",
        options: ["Search Engine", "Social Media", "Referral", "Advertisement", "Other"],
      },
      {
        name: "additionalInfo",
        label: "Additional Information",
        type: "textarea",
        placeholder: "Anything else you'd like us to know?",
      },
      {
        name: "termsAgreed",
        label: "Terms & Conditions",
        type: "checkbox",
        placeholder: "I agree to the Terms of Service and Privacy Policy",
        required: true,
      },
      {
        name: "marketingConsent",
        label: "Marketing Consent",
        type: "checkbox",
        placeholder: "I consent to receive marketing communications",
      },
    ],
  },
]

interface ApplicationFormProps {
  onBack: () => void
}

export default function ApplicationForm({ onBack }: ApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isExploding, setIsExploding] = useState(false)
  const [referenceId, setReferenceId] = useState("")
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const { toast } = useToast()

  // Reset errors when changing steps
  const handleInputChange = (name: string, value: any) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }))
    setTouchedFields((prev) => ({ ...prev, [name]: true }))

    // Clear error for this field when user changes the value
    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateStep = () => {
    const currentFields = formSteps[currentStep].fields
    const newErrors: Record<string, string> = {}

    currentFields.forEach((field) => {
      if (field.required && field.type !== "custom") {
        const value = formData[field.name]
        if (!value) {
          newErrors[field.name] = "This field is required"
        } else if (field.name === "email" && !/\S+@\S+\.\S+/.test(value)) {
          newErrors[field.name] = "Please enter a valid email address"
        } else if (field.name === "phone" && !/^[\d\s()-]{10,15}$/.test(value)) {
          newErrors[field.name] = "Please enter a valid phone number"
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (!validateStep()) {
      // Mark all fields as touched to show errors
      const touchedAll: Record<string, boolean> = {}
      formSteps[currentStep].fields.forEach((field) => {
        touchedAll[field.name] = true
      })
      setTouchedFields((prev) => ({ ...prev, ...touchedAll }))

      // Show toast for validation errors
      toast({
        title: "Please check your inputs",
        description: "Some required fields need your attention.",
        variant: "destructive",
      })
      return
    }

    // If we're on the Financial Information step, submit the initial application
    // to get an application ID for bank statement uploads
    if (currentStep === 3 && !applicationId) {
      handleInitialSubmit()
    } else if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      handleFinalSubmit()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      onBack()
    }
  }

  const handleInitialSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Log the form data to help with debugging
      console.log("Initial submit form data:", formData)

      // Submit the initial application data to get an application ID
      const result = await submitApplication({
        ...formData,
        status: "draft", // Mark as draft until final submission
      })

      if (result.success && result.applicationId) {
        setApplicationId(result.applicationId)
        setCurrentStep(currentStep + 1)
        window.scrollTo({ top: 0, behavior: "smooth" })

        toast({
          title: "Information Saved",
          description: "Your information has been saved. Please upload your bank statements.",
        })
      } else {
        throw new Error(result.error || "Failed to save application")
      }
    } catch (error) {
      console.error("Error submitting initial application:", error)
      toast({
        title: "Submission Failed",
        description: "There was an error saving your information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Log the form data to help with debugging
      console.log("Final submit form data:", formData)

      // Update the application with final status
      const result = await submitApplication({
        ...formData,
        applicationId: applicationId,
        status: "pending", // Change from draft to pending
      })

      if (result.success) {
        setReferenceId(result.referenceId || "")
        setIsComplete(true)
        setIsExploding(true)

        toast({
          title: "Application Submitted!",
          description: "We've received your application and will contact you soon.",
        })
      } else {
        throw new Error(result.error || "Failed to submit application")
      }
    } catch (error) {
      console.error("Error submitting final application:", error)
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate completion percentage for the current step
  const calculateStepCompletion = () => {
    const currentFields = formSteps[currentStep].fields
    const requiredFields = currentFields.filter((field) => field.required && field.type !== "custom")

    if (requiredFields.length === 0) return 100

    const completedFields = requiredFields.filter((field) => !!formData[field.name])
    return Math.round((completedFields.length / requiredFields.length) * 100)
  }

  const stepCompletion = calculateStepCompletion()

  // Custom component renderer for bank statement uploader
  const renderCustomComponent = (field: any) => {
    if (field.component === "BankStatementUploader" && applicationId) {
      return (
        <BankStatementUploader
          applicationId={applicationId}
          onUploadComplete={() => {
            // Mark this step as complete when uploads are done
            handleInputChange("bankStatements", true)
          }}
        />
      )
    }
    return <div className="text-sm text-red-500">Please complete previous steps first</div>
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {!isComplete ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center mb-10">
            <Button variant="ghost" onClick={onBack} className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Information
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Business Funding Application
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-base md:text-lg">
              Complete this application to get matched with the best funding options for your business needs.
            </p>
          </div>

          {/* Progress indicators */}
          <FormProgress steps={formSteps} currentStep={currentStep} completion={stepCompletion} />
          <MobileStepper currentStep={currentStep} totalSteps={formSteps.length} completion={stepCompletion} />

          {/* Form card */}
          <Card className="border-0 shadow-xl overflow-hidden bg-white/95 backdrop-blur-sm dark:bg-gray-800/90">
            <CardContent className="p-6 sm:p-8 md:p-10">
              <AnimatePresence mode="wait">
                <FormStep
                  key={currentStep}
                  step={formSteps[currentStep]}
                  formData={formData}
                  onChange={handleInputChange}
                  errors={errors}
                  touchedFields={touchedFields}
                  setTouchedFields={setTouchedFields}
                  renderCustomComponent={renderCustomComponent}
                />
              </AnimatePresence>

              <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100 dark:border-gray-700">
                <Button
                  onClick={prevStep}
                  disabled={isSubmitting}
                  variant="outline"
                  size="lg"
                  className="gap-2 transition-all duration-300 hover:translate-x-[-4px]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{currentStep === 0 ? "Back to Info" : "Back"}</span>
                </Button>

                <div className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
                  Step {currentStep + 1} of {formSteps.length}
                </div>

                <Button
                  onClick={nextStep}
                  disabled={isSubmitting || (currentStep === 4 && !formData.bankStatements)}
                  size="lg"
                  className="gap-2 min-w-[140px] transition-all duration-300 hover:translate-x-[4px] hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : currentStep === formSteps.length - 1 ? (
                    <>
                      <span>Submit Application</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Your information is secure and will never be shared without your permission.
            <br />
            By submitting this form, you agree to our{" "}
            <a href="/terms-of-service" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </a>
            .
          </div>
        </motion.div>
      ) : (
        <ApplicationSuccess referenceId={referenceId} />
      )}

      {isExploding && <ConfettiExplosion force={0.8} duration={3000} particleCount={250} width={1600} />}
    </div>
  )
}
