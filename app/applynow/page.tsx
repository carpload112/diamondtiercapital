"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Building2,
  User,
  FileText,
  Shield,
  LockIcon,
  CheckIcon,
  ShieldIcon,
} from "lucide-react"
import FormStep from "../components/FormStep"
import FormProgress from "../components/FormProgress"
import MobileStepper from "../components/MobileStepper"
import ApplicationSuccess from "../components/ApplicationSuccess"
import { useToast } from "@/components/ui/use-toast"
import { submitApplication } from "@/lib/supabase/actions"
import { useSearchParams } from "next/navigation"
import { BankStatementUploader } from "@/components/BankStatementUploader"
import { isValidReferralCode, getReferralCodeFromCookies } from "@/lib/services/affiliate-tracking-service"

const ApplyNowPage = () => {
  const searchParams = useSearchParams()
  // Support both referralCode and ref parameters
  const referralCodeParam = searchParams.get("referralCode") || searchParams.get("ref")

  const [referralCode, setReferralCode] = useState<string | null>(referralCodeParam)
  const [referralCodeValidated, setReferralCodeValidated] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [referenceId, setReferenceId] = useState("")
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})
  const [showForm, setShowForm] = useState(false)
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const [stepCompletion, setStepCompletion] = useState(0)
  const { toast } = useToast()

  const formRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  // Validate referral code when component mounts
  useEffect(() => {
    const validateReferralCode = async () => {
      // First check URL parameters
      if (referralCode) {
        try {
          console.log(`Validating referral code from URL: ${referralCode}`)
          const isValid = await isValidReferralCode(referralCode)

          if (isValid) {
            console.log(`Referral code ${referralCode} is valid`)
            setReferralCodeValidated(true)
            setFormData((prev) => ({
              ...prev,
              referralCode: referralCode,
            }))

            // Show toast notification
            toast({
              title: "Referral Code Applied",
              description: "Your referral code has been successfully applied to your application.",
              variant: "default",
            })
            return // Exit early if URL parameter is valid
          } else {
            console.warn(`Referral code ${referralCode} is invalid`)
            setReferralCode(null)
            setReferralCodeValidated(false)

            // Show toast notification
            toast({
              title: "Invalid Referral Code",
              description: "The referral code provided is invalid. Your application will continue without a referral.",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error("Error validating referral code:", error)
          setReferralCode(null)
          setReferralCodeValidated(false)
        }
      }

      // If no valid URL parameter, check cookies
      try {
        const cookieCode = await getReferralCodeFromCookies()
        if (cookieCode) {
          console.log(`Found referral code in cookies: ${cookieCode}`)
          const isValid = await isValidReferralCode(cookieCode)

          if (isValid) {
            console.log(`Cookie referral code ${cookieCode} is valid`)
            setReferralCode(cookieCode)
            setReferralCodeValidated(true)
            setFormData((prev) => ({
              ...prev,
              referralCode: cookieCode,
            }))

            // Show toast notification
            toast({
              title: "Referral Code Applied",
              description: "A saved referral code has been applied to your application.",
              variant: "default",
            })
          } else {
            console.warn(`Cookie referral code ${cookieCode} is invalid`)
          }
        }
      } catch (error) {
        console.error("Error checking cookie referral code:", error)
      }
    }

    validateReferralCode()
  }, [referralCode, toast])

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
        // Add a hidden field for referral code if we have one
        ...(referralCodeValidated
          ? [
              {
                name: "referralCode",
                label: "Referral Code",
                type: "hidden",
                value: referralCode,
                required: false,
              },
            ]
          : []),
      ],
    },
  ]

  // Calculate completion percentage for the current step
  useEffect(() => {
    const calculateStepCompletion = () => {
      const currentFields = formSteps[currentStep].fields
      const requiredFields = currentFields.filter((field) => field.required && field.type !== "custom")

      if (requiredFields.length === 0) return 100

      const completedFields = requiredFields.filter((field) => !!formData[field.name])
      return Math.round((completedFields.length / requiredFields.length) * 100)
    }

    setStepCompletion(calculateStepCompletion())
  }, [currentStep, formData])

  const scrollToForm = () => {
    setShowForm(true)
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setTouchedFields((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
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
    // Special handling for bank statement step
    if (currentStep === 4) {
      // If we're on the bank statement step and don't have an applicationId yet,
      // we need to create one first
      if (!applicationId) {
        toast({
          title: "Action required",
          description: "Please click 'Prepare for Upload' to continue with bank statement uploads.",
          variant: "destructive",
        })
        return
      }

      // If we have an applicationId but no bank statements uploaded yet
      if (!formData.bankStatements) {
        toast({
          title: "Bank statements required",
          description: "Please upload at least one bank statement to continue.",
          variant: "destructive",
        })
        return
      }
    }

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
      // Smooth scroll to the form header
      headerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      handleFinalSubmit()
    }
  }

  // Update handleInitialSubmit to ensure referral code is included
  const handleInitialSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Ensure referral code is included in the submission
      const dataToSubmit = {
        ...formData,
        referralCode: formData.referralCode || referralCode, // Use from form data or state
        status: "draft", // Mark as draft until final submission
      }

      console.log("Submitting initial application with data:", dataToSubmit)

      // Submit the initial application data to get an application ID
      const result = await submitApplication(dataToSubmit)

      if (result.success && result.applicationId) {
        setApplicationId(result.applicationId)
        setCurrentStep(currentStep + 1)
        headerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })

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

  // Update handleFinalSubmit to ensure referral code is included
  const handleFinalSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Ensure referral code is included in the final submission
      const dataToSubmit = {
        ...formData,
        referralCode: formData.referralCode || referralCode, // Use from form data or state
        applicationId: applicationId,
        status: "pending", // Change from draft to pending ONLY on final submission
      }

      console.log("Submitting final application with data:", dataToSubmit)

      // Update the application with final status
      const result = await submitApplication(dataToSubmit)

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
      headerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Custom component renderer for bank statement uploader
  const renderCustomComponent = (field: any) => {
    if (field.component === "BankStatementUploader") {
      // Check if we have an applicationId
      if (!applicationId) {
        // Create a temporary application ID if we don't have one yet
        const handleCreateTempApplication = async () => {
          setIsSubmitting(true)
          try {
            // Validate that we have the minimum required data
            if (!formData.fullName || !formData.email || !formData.businessName) {
              throw new Error("Please complete the personal and business information steps first")
            }

            // Ensure referral code is included
            const dataToSubmit = {
              ...formData,
              referralCode: formData.referralCode || referralCode, // Use from form data or state
              status: "draft", // Mark as draft until final submission
            }

            // Submit the initial application data to get an application ID
            const result = await submitApplication(dataToSubmit)

            if (result.success && result.applicationId) {
              setApplicationId(result.applicationId)
              toast({
                title: "Ready for uploads",
                description: "You can now upload your bank statements.",
              })
            } else {
              throw new Error(result.error || "Failed to prepare for uploads")
            }
          } catch (error) {
            console.error("Error creating temporary application:", error)
            toast({
              title: "Upload preparation failed",
              description:
                error instanceof Error ? error.message : "There was an error preparing for uploads. Please try again.",
              variant: "destructive",
            })
          } finally {
            setIsSubmitting(false)
          }
        }

        return (
          <div className="p-6 border border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prepare for Bank Statement Upload
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              We need to save your information before you can upload bank statements.
            </p>
            <Button
              onClick={handleCreateTempApplication}
              disabled={isSubmitting}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Preparing...</span>
                </>
              ) : (
                <>
                  <span>Prepare for Upload</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )
      }

      // If we have an applicationId, render the uploader
      return (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-2 mt-1">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Bank Statement Instructions</h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Please upload your last 3 months of business bank statements. Accepted formats: PDF, JPG, PNG, Excel
                  (max 10MB each).
                </p>
              </div>
            </div>
          </div>

          <BankStatementUploader
            applicationId={applicationId}
            onUploadComplete={() => {
              // Mark this step as complete when uploads are done
              handleInputChange("bankStatements", true)
              toast({
                title: "Upload successful",
                description: "Your bank statements have been uploaded successfully.",
              })
            }}
          />
        </div>
      )
    }
    return null
  }

  // Get the icon component for the current step
  const getStepIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      User: <User className="h-6 w-6" />,
      Building2: <Building2 className="h-6 w-6" />,
      LineChart: <DollarSign className="h-6 w-6" />,
      DollarSign: <DollarSign className="h-6 w-6" />,
      FileText: <FileText className="h-6 w-6" />,
    }
    return icons[iconName] || <FileText className="h-6 w-6" />
  }

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
            Complete our simple application process to access the funding your business needs.
          </p>

          {/* Display referral code if validated */}
          {referralCodeValidated && (
            <div className="mt-4">
              <Badge className="px-3 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                Referral Code Applied: {referralCode}
              </Badge>
            </div>
          )}
        </div>

        {/* Step-by-Step Process */}
        {!showForm && (
          <div className="grid gap-8 mb-16">
            {/* Step 1: Check Credit Score */}
            <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="grid md:grid-cols-5 items-stretch">
                <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 flex flex-col justify-center">
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
                    Get your credit score for just $1 (7-day trial) to see exactly where you stand. This helps us find
                    the best funding options for your situation.
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
            <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
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
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">Basic personal information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">Business details</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
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
                    Our team will review your application and contact you with funding options tailored to your
                    business.
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
              <CardFooter className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 p-6 flex justify-center">
                <Button
                  size="lg"
                  className="gap-2 bg-blue-600 hover:bg-blue-700 px-10 py-6 text-lg shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={() => scrollToForm()}
                >
                  Start Your Application
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Application Form Section */}
        {(showForm || isComplete) && (
          <div ref={formRef} id="application-form" className="max-w-3xl mx-auto pt-8">
            <Card className="border-0 shadow-xl overflow-hidden bg-white dark:bg-gray-800 mb-8 transition-all duration-300">
              <div ref={headerRef}>
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                  <div className="flex items-center gap-3 mb-2">
                    {!isComplete && (
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        {getStepIcon(formSteps[currentStep].icon)}
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-2xl">
                        {isComplete ? "Application Submitted" : formSteps[currentStep].title}
                      </CardTitle>
                      <CardDescription className="text-blue-100">
                        {isComplete ? "Thank you for your application" : formSteps[currentStep].description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </div>
              <CardContent className="p-6 sm:p-8">
                {!isComplete ? (
                  <>
                    {/* Progress indicators */}
                    <FormProgress steps={formSteps} currentStep={currentStep} completion={stepCompletion} />
                    <MobileStepper
                      currentStep={currentStep}
                      totalSteps={formSteps.length}
                      completion={stepCompletion}
                    />

                    <Separator className="my-6" />

                    <div className="my-6">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentStep}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <FormStep
                            step={formSteps[currentStep]}
                            formData={formData}
                            onChange={handleInputChange}
                            errors={errors}
                            touchedFields={touchedFields || {}}
                            setTouchedFields={setTouchedFields}
                            renderCustomComponent={renderCustomComponent}
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <Separator className="my-6" />

                    <div className="flex justify-between items-center mt-8">
                      <Button
                        onClick={prevStep}
                        disabled={currentStep === 0 || isSubmitting}
                        variant="outline"
                        className="gap-2 transition-all duration-300 hover:translate-x-[-4px]"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back</span>
                      </Button>

                      <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Shield className="h-4 w-4 text-green-500" />
                        Your information is secure
                      </div>

                      <Button
                        onClick={nextStep}
                        disabled={isSubmitting || (currentStep === 4 && !formData.bankStatements)}
                        className="gap-2 transition-all duration-300 hover:translate-x-[4px] bg-blue-600 hover:bg-blue-700"
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
                  </>
                ) : (
                  <ApplicationSuccess referenceId={referenceId} />
                )}
              </CardContent>
              <CardFooter className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 p-6 border-t border-gray-100 dark:border-gray-700">
                <div className="w-full flex flex-col items-center justify-center space-y-3">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-1">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Secure & Confidential</span>
                  </div>

                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 max-w-lg">
                    Your information is secure and will never be shared without your permission. By submitting this
                    form, you agree to our{" "}
                    <Link
                      href="/terms-of-service"
                      className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy-policy"
                      className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                      <LockIcon className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                      <ShieldIcon className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                      <CheckIcon className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApplyNowPage
