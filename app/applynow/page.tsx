"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, CreditCard, DollarSign, ArrowLeft, Loader2 } from "lucide-react"
import FormStep from "../components/FormStep"
import FormProgress from "../components/FormProgress"
import MobileStepper from "../components/MobileStepper"
import ApplicationSuccess from "../components/ApplicationSuccess"
import { useToast } from "@/components/ui/use-toast"
import { submitApplication } from "@/lib/supabase/actions"
import { useSearchParams } from "next/navigation"

// Define the form steps with improved descriptions and tooltips
const formSteps = [
  {
    title: "Personal Information",
    description: "Tell us about yourself",
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
    description: "Tell us about your business",
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
      {
        name: "yearsInBusiness",
        label: "Years in Business",
        type: "select",
        options: ["Less than 1 year", "1-2 years", "3-5 years", "5+ years"],
        required: true,
      },
      {
        name: "ein",
        label: "EIN (Optional)",
        type: "text",
        placeholder: "XX-XXXXXXX",
        required: false,
      },
    ],
  },
  {
    title: "Financial Information",
    description: "Tell us about your finances",
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
        name: "creditScore",
        label: "Estimated Personal Credit Score",
        type: "select",
        options: ["Excellent (750+)", "Good (700-749)", "Fair (650-699)", "Poor (Below 650)", "Not Sure"],
        required: true,
      },
      {
        name: "monthlyProfit",
        label: "Average Monthly Profit",
        type: "select",
        options: ["Not profitable yet", "Under $5,000", "$5,000 - $10,000", "$10,000 - $25,000", "Over $25,000"],
        required: true,
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
    title: "Funding Needs",
    description: "Tell us what you need",
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
        required: true,
      },
    ],
  },
  {
    title: "Additional Information",
    description: "Final details",
    icon: "FileText",
    fields: [
      {
        name: "hearAboutUs",
        label: "How did you hear about us?",
        type: "select",
        options: ["Search Engine", "Social Media", "Referral", "Advertisement", "Other"],
        required: true,
      },
      {
        name: "additionalInfo",
        label: "Additional Information",
        type: "textarea",
        placeholder: "Anything else you'd like us to know?",
        required: false,
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
        required: false,
      },
    ],
  },
]

export default function ApplyNowPage() {
  const searchParams = useSearchParams()
  const referralCode = searchParams.get("ref")

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({
    ...(referralCode ? { referralCode } : {}),
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [referenceId, setReferenceId] = useState("")
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})
  const [showForm, setShowForm] = useState(false)
  const { toast } = useToast()

  const formRef = useRef<HTMLDivElement>(null)

  const scrollToForm = () => {
    setShowForm(true)
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

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
      if (field.required) {
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

    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: formRef.current?.offsetTop || 0, behavior: "smooth" })
    } else {
      handleSubmit()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: formRef.current?.offsetTop || 0, behavior: "smooth" })
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Make sure the referral code is included in the submission
      if (referralCode && !formData.referralCode) {
        formData.referralCode = referralCode
      }
      // Submit to database using the server action
      const result = await submitApplication(formData)

      if (result.success) {
        // Set the reference ID from the database
        setReferenceId(result.referenceId)

        // Show success state
        setIsComplete(true)

        toast({
          title: "Application Submitted!",
          description: "We've received your application and will contact you soon.",
          variant: "default",
        })
      } else {
        throw new Error(result.error || "Failed to submit application")
      }
    } catch (error) {
      console.error("Error submitting application:", error)
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
    const requiredFields = currentFields.filter((field) => field.required)

    if (requiredFields.length === 0) return 100

    const completedFields = requiredFields.filter((field) => !!formData[field.name])
    return Math.round((completedFields.length / requiredFields.length) * 100)
  }

  const stepCompletion = calculateStepCompletion()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
            Business Funding
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Get Funding For Your Business
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Complete our simple 3-step process to access the funding your business needs.
          </p>
        </div>

        {/* Step-by-Step Process */}
        <div className="grid gap-8 mb-16">
          {/* Step 1: Check Credit Score */}
          <Card className="overflow-hidden border-0 shadow-md">
            <div className="grid md:grid-cols-5 items-stretch">
              <div className="md:col-span-2 bg-blue-600 text-white p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold">1</span>
                  </div>
                  <h2 className="text-xl font-bold">Check Your Credit</h2>
                </div>
                <p className="mb-4 text-blue-100">
                  Start by checking your exact credit score with Identity IQ. This helps us match you with the best
                  funding options.
                </p>
                <div className="mt-auto">
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <Image
                      src="/images/identityiq-logo.svg"
                      alt="Identity IQ"
                      width={150}
                      height={45}
                      className="h-auto"
                    />
                  </div>
                </div>
              </div>
              <div className="md:col-span-3 p-6 flex flex-col justify-center">
                <p className="mb-6 text-gray-700 dark:text-gray-300">
                  Get your credit score for just $1 (7-day trial) to see exactly where you stand. This helps us find the
                  best funding options for your situation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <Button className="gap-2 bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto" size="lg" asChild>
                    <a
                      href="https://member.identityiq.com/sc-securemax.aspx?offercode=431279M1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <CreditCard className="h-4 w-4" />
                      Check Your Credit ($1 Trial)
                    </a>
                  </Button>
                  <button
                    onClick={() => scrollToForm()}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 underline"
                  >
                    Skip this step
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  7-day free trial for $1, then $24.99/month. Cancel anytime.
                </p>
              </div>
            </div>
          </Card>

          {/* Step 2-3 Combined */}
          <Card className="overflow-hidden border-0 shadow-md">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Step 2 */}
              <div className="border-r border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                    <span className="font-bold">2</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Apply Now</h2>
                </div>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  Fill out our simple application form with your business details. Takes just 3 minutes.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Basic personal information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Business details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Funding requirements</span>
                  </li>
                </ul>
              </div>

              {/* Step 3 */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                    <span className="font-bold">3</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Get Funded</h2>
                </div>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  Our team will review your application and contact you with funding options tailored to your business.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">SBA loans up to $5 million</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Business credit cards with rewards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Unsecured financing options</span>
                  </li>
                </ul>
              </div>
            </div>
            <CardFooter className="bg-gray-50 dark:bg-gray-800/50 p-6 flex justify-center">
              <Button
                size="lg"
                className="gap-2 bg-blue-600 hover:bg-blue-700 px-10 py-6 text-lg"
                onClick={() => scrollToForm()}
              >
                Start Your Application
                <ArrowRight className="h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Application Form Section */}
        {showForm && (
          <div ref={formRef} id="application-form" className="max-w-3xl mx-auto pt-8">
            <Card className="border-0 shadow-xl overflow-hidden bg-white dark:bg-gray-800 mb-8">
              <CardHeader className="bg-blue-600 text-white">
                <CardTitle className="text-xl">Business Funding Application</CardTitle>
                <CardDescription className="text-blue-100">Please complete all required fields below</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {!isComplete ? (
                  <>
                    {/* Progress indicators */}
                    <FormProgress steps={formSteps} currentStep={currentStep} completion={stepCompletion} />
                    <MobileStepper
                      currentStep={currentStep}
                      totalSteps={formSteps.length}
                      completion={stepCompletion}
                    />

                    <div className="my-6">
                      <FormStep
                        key={currentStep}
                        step={formSteps[currentStep]}
                        formData={formData}
                        onChange={handleInputChange}
                        errors={errors}
                        touchedFields={touchedFields || {}}
                        setTouchedFields={setTouchedFields}
                      />
                    </div>

                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                      <Button
                        onClick={prevStep}
                        disabled={currentStep === 0 || isSubmitting}
                        variant="outline"
                        className="gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back</span>
                      </Button>

                      <div className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
                        Step {currentStep + 1} of {formSteps.length}
                      </div>

                      <Button onClick={nextStep} disabled={isSubmitting} className="gap-2">
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
                  </>
                ) : (
                  <ApplicationSuccess referenceId={referenceId} />
                )}
              </CardContent>
              <CardFooter className="bg-gray-50 dark:bg-gray-800/50 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Your information is secure and will never be shared without your permission. By submitting this form,
                you agree to our{" "}
                <Link href="/terms-of-service" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
