/**
 * Form validation utilities
 */

/**
 * Validate an email address
 * @param email Email to validate
 * @returns True if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate a phone number
 * @param phone Phone number to validate
 * @returns True if valid, false otherwise
 */
export function isValidPhone(phone: string): boolean {
  // Allow formats like (123) 456-7890, 123-456-7890, 1234567890
  const phoneRegex = /^[\d\s()-]{10,15}$/
  return phoneRegex.test(phone)
}

/**
 * Validate a form field
 * @param value Field value
 * @param fieldType Type of field
 * @param required Whether the field is required
 * @returns Error message or null if valid
 */
export function validateField(value: any, fieldType: string, required = true): string | null {
  // Check if required field is empty
  if (required && (value === undefined || value === null || value === "")) {
    return "This field is required"
  }

  // If not required and empty, it's valid
  if (!required && (value === undefined || value === null || value === "")) {
    return null
  }

  // Type-specific validation
  switch (fieldType) {
    case "email":
      return isValidEmail(value) ? null : "Please enter a valid email address"
    case "phone":
      return isValidPhone(value) ? null : "Please enter a valid phone number"
    case "checkbox":
      return value === true ? null : "You must check this box to continue"
    default:
      return null
  }
}
