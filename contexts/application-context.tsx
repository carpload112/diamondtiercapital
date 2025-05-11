"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { APPLICATION_STATUSES } from "@/lib/constants"
import { handleError } from "@/lib/utils/error-utils"
import { submitApplication } from "@/lib/supabase/actions"

// Define application form data type
type ApplicationFormData = Record<string, any>

// Define application context type
type ApplicationContextType = {
  formData: ApplicationFormData
  currentStep: number
  isSubmitting: boolean
  isComplete: boolean
  referenceId: string
  applicationId: string | null
  setFormData: (data: ApplicationFormData) => void
  updateField: (name: string, value: any) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  submitInitialApplication: () => Promise<void>
  submitFinalApplication: () => Promise<void>
  resetApplication: () => void
}

// Create application context
const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined)

// Application provider component
export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<ApplicationFormData>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [referenceId, setReferenceId] = useState("")
  const [applicationId, setApplicationId] = useState<string | null>(null)

  // Update a single field
  const updateField = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Navigation functions
  const nextStep = () => setCurrentStep((prev) => prev + 1)
  const prevStep = () => setCurrentStep((prev) => Math.max(0, prev - 1))
  const goToStep = (step: number) => setCurrentStep(step)

  // Submit initial application to get an ID
  const submitInitialApplication = async () => {
    try {
      setIsSubmitting(true)

      const result = await submitApplication({
        ...formData,
        status: APPLICATION_STATUSES.DRAFT,
      })

      if (!result.success) {
        throw new Error(result.error || "Failed to save application")
      }

      setApplicationId(result.applicationId || null)
      nextStep()

      return result
    } catch (error) {
      handleError(error, "Failed to save application")
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  // Submit final application
  const submitFinalApplication = async () => {
    try {
      setIsSubmitting(true)

      const result = await submitApplication({
        ...formData,
        applicationId,
        status: APPLICATION_STATUSES.PENDING,
      })

      if (!result.success) {
        throw new Error(result.error || "Failed to submit application")
      }

      setReferenceId(result.referenceId || "")
      setIsComplete(true)

      return result
    } catch (error) {
      handleError(error, "Failed to submit application")
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset application state
  const resetApplication = () => {
    setFormData({})
    setCurrentStep(0)
    setIsComplete(false)
    setReferenceId("")
    setApplicationId(null)
  }

  // Provide application context
  return (
    <ApplicationContext.Provider
      value={{
        formData,
        currentStep,
        isSubmitting,
        isComplete,
        referenceId,
        applicationId,
        setFormData,
        updateField,
        nextStep,
        prevStep,
        goToStep,
        submitInitialApplication,
        submitFinalApplication,
        resetApplication,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  )
}

// Hook to use application context
export function useApplication() {
  const context = useContext(ApplicationContext)

  if (context === undefined) {
    throw new Error("useApplication must be used within an ApplicationProvider")
  }

  return context
}
