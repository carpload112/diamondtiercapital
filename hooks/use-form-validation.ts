"use client"

import { useState, useCallback } from "react"
import { validateField } from "@/lib/utils/validation-utils"

type FieldConfig = {
  name: string
  type: string
  required?: boolean
  validate?: (value: any) => string | null
}

type ValidationErrors = Record<string, string>
type TouchedFields = Record<string, boolean>

/**
 * Hook for form validation
 */
export function useFormValidation(fields: FieldConfig[]) {
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({})

  // Validate a single field
  const validateSingleField = useCallback(
    (name: string, value: any) => {
      const fieldConfig = fields.find((f) => f.name === name)

      if (!fieldConfig) return null

      // Use custom validation if provided
      if (fieldConfig.validate) {
        return fieldConfig.validate(value)
      }

      // Otherwise use standard validation
      return validateField(value, fieldConfig.type, fieldConfig.required)
    },
    [fields],
  )

  // Handle field change
  const handleFieldChange = useCallback(
    (name: string, value: any) => {
      // Mark field as touched
      setTouchedFields((prev) => ({ ...prev, [name]: true }))

      // Clear error if value is valid
      const error = validateSingleField(name, value)

      setErrors((prev) => {
        if (error) {
          return { ...prev, [name]: error }
        } else {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        }
      })

      return error === null
    },
    [validateSingleField],
  )

  // Validate all fields
  const validateForm = useCallback(
    (formData: Record<string, any>) => {
      const newErrors: ValidationErrors = {}
      let isValid = true

      // Validate each field
      fields.forEach((field) => {
        const error = validateSingleField(field.name, formData[field.name])

        if (error) {
          newErrors[field.name] = error
          isValid = false
        }
      })

      setErrors(newErrors)

      // Mark all fields as touched if there are errors
      if (!isValid) {
        const allTouched: TouchedFields = {}
        fields.forEach((field) => {
          allTouched[field.name] = true
        })
        setTouchedFields((prev) => ({ ...prev, ...allTouched }))
      }

      return isValid
    },
    [fields, validateSingleField],
  )

  // Reset validation state
  const resetValidation = useCallback(() => {
    setErrors({})
    setTouchedFields({})
  }, [])

  return {
    errors,
    touchedFields,
    handleFieldChange,
    validateForm,
    resetValidation,
    setTouchedFields,
  }
}
