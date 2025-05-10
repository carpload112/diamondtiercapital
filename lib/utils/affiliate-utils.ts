/**
 * Generate a referral code based on name
 */
export function generateReferralCode(firstName: string, lastName: string): string {
  const prefix = firstName.substring(0, 2).toUpperCase() + lastName.substring(0, 2).toUpperCase()
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}${randomPart}`
}

/**
 * Calculate commission amount based on amount and rate
 */
export function calculateCommission(amount: number, rate: number): number {
  return (amount * rate) / 100
}

/**
 * Format currency
 */
export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount)
}
