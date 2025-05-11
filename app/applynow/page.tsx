"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import FormStep from "../components/FormStep"
import FormProgress from "../components/FormProgress"
import MobileStepper from "../components/MobileStepper"
import ApplicationSuccess from "../components/ApplicationSuccess"
import { useToast } from "@/components/ui/use-toast"
import { submitApplication } from "@/lib/supabase/actions"
import { useSearchParams } from "next/navigation"
import { BankStatementUploader } from "@/components/BankStatementUploader"

const ApplyNowPage = () => {
  const searchParams = useSearchParams()
  const referralCode = searchParams.get("referralCode")

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
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const { toast } = useToast()

  const formRef = useRef<HTMLDivElement>(null)

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
          options: [
            "Under $50,000",
            "$50,000 - $100,000",
            "$100,000 - $250,000",
            "$250,000 - $500,000",
            "Over $500,000",
          ],
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
      title: "Bank Statements",
      description: "Upload your last 3 months of business bank statements",
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

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" })) // Clear error on change
  }

  const validateStep = () => {
    let isValid = true
    const newErrors: Record<string, string> = {}

    formSteps[currentStep].fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
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
    if (currentStep === 2 && !applicationId) {
      handleInitialSubmit()
    } else if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: formRef.current?.offsetTop || 0, behavior: "smooth" })
    } else {
      handleFinalSubmit()
    }
  }

  const handleInitialSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Submit the initial application data to get an application ID
      const result = await submitApplication({
        ...formData,
        status: "draft", // Mark as draft until final submission
      })

      if (result.success && result.applicationId) {
        setApplicationId(result.applicationId)
        setCurrentStep(currentStep + 1)
        window.scrollTo({ top: formRef.current?.offsetTop || 0, behavior: "smooth" })

        toast({
          title: "Information Saved",
          description: "Your information has been saved. Please continue with the next steps.",
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
      // Update the application with final status
      const result = await submitApplication({
        ...formData,
        applicationId: applicationId,
        status: "pending", // Change from draft to pending
      })

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

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: formRef.current?.offsetTop || 0, behavior: "smooth" })
    }
  }

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
    <div className="container py-12">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Apply Now</CardTitle>
          <CardDescription>Start your application in minutes.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="hidden md:block">
            <FormProgress steps={formSteps} currentStep={currentStep} />
          </div>
          <div className="md:hidden">
            <MobileStepper steps={formSteps} currentStep={currentStep} />
          </div>

          {!isComplete ? (
            <div ref={formRef}>
              <FormStep
                key={currentStep}
                step={formSteps[currentStep]}
                formData={formData}
                onChange={handleInputChange}
                errors={errors}
                touchedFields={touchedFields || {}}
                setTouchedFields={setTouchedFields}
                renderCustomComponent={renderCustomComponent}
              />
            </div>
          ) : (
            <ApplicationSuccess referenceId={referenceId} />
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 0 || isSubmitting}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={nextStep}
            disabled={isSubmitting || (currentStep === 4 && !formData.bankStatements)}
            className="gap-2"
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
        </CardFooter>
      </Card>
    </div>
  )
}

export default ApplyNowPage
