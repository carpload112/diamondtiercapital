/**
 * Calculate commission amount
 */
export function calculateCommission(amount: number, rate: number): number {
  return (amount * rate) / 100
}

/**
 * Generate a unique referral code for an affiliate
 */
export function generateReferralCode(firstName: string, lastName: string): string {
  // Get first 2 letters of first name and last name (or first letter if name is only 1 character)
  const firstInitials = firstName.substring(0, Math.min(2, firstName.length)).toUpperCase()
  const lastInitials = lastName.substring(0, Math.min(2, lastName.length)).toUpperCase()

  // Generate a random 6-character alphanumeric string
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let randomString = ""
  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  // Combine initials and random string
  return `${firstInitials}${lastInitials}${randomString}`
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100)
}
